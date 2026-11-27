#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const appSrc = fs.readFileSync(path.join(ROOT, "src/app.js"), "utf8");
const i18nSrc = fs.readFileSync(path.join(ROOT, "src/i18n.js"), "utf8");
const worldSrc = fs.readFileSync(path.join(ROOT, "data/world-50m.js"), "utf8");

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  PASS  ${name}`);
  } catch (err) {
    console.error(`  FAIL  ${name}\n        ${err.message}`);
    process.exitCode = 1;
  }
}

function extractFunction(src, fnName) {
  const re = new RegExp(`function ${fnName}\\b[\\s\\S]*?\\n  \\}`);
  const m = src.match(re);
  if (!m) throw new Error(`Could not find function ${fnName}`);
  return m[0];
}

// 1. Test normalizeLonPair
const normalizeLonPair = new Function(`${extractFunction(appSrc, "normalizeLonPair")}; return normalizeLonPair;`)();

test("normalizeLonPair handles standard -180..180 bounds", () => {
  assert.deepStrictEqual(normalizeLonPair(-82, -34), [-82, -34]);
  assert.deepStrictEqual(normalizeLonPair(-34, -82), [-82, -34]);
  assert.deepStrictEqual(normalizeLonPair(100, 146), [100, 146]);
});

test("normalizeLonPair handles implicit 0..360 CMIP bounds", () => {
  assert.deepStrictEqual(normalizeLonPair(278, 326), [-82, -34]);
  assert.deepStrictEqual(normalizeLonPair(-82, 326), [-82, -34]);
  assert.deepStrictEqual(normalizeLonPair(350, 40), [-10, 40]);
  assert.deepStrictEqual(normalizeLonPair(0, 360), [-180, 180]);
  assert.deepStrictEqual(normalizeLonPair(180, 360), [-180, 0]);
});

// 2. Test getPrimaryCountryBounds against real world-50m.js
const worldCtx = { window: {} };
new Function("window", worldSrc)(worldCtx.window);
const countries = worldCtx.window.WORLD_50M.countries;
const getPrimaryCountryBounds = new Function(`${extractFunction(appSrc, "getPrimaryCountryBounds")}; return getPrimaryCountryBounds;`)();

test("getPrimaryCountryBounds frames antimeridian & overseas countries cleanly", () => {
  const byName = (n) => countries.find(c => c.n === n);

  const usa = getPrimaryCountryBounds(byName("United States of America"));
  assert(usa[0] >= -126 && usa[2] <= -66, `USA lon should be contiguous US, got ${usa}`);
  assert(usa[1] >= 24 && usa[3] <= 50, `USA lat should be contiguous US, got ${usa}`);

  const russia = getPrimaryCountryBounds(byName("Russia"));
  assert(russia[0] >= 19 && russia[2] <= 180, `Russia lon should avoid hemisphere wrap, got ${russia}`);

  const france = getPrimaryCountryBounds(byName("France"));
  assert(france[0] >= -6 && france[2] <= 10.5, `France should frame metropolitan France, got ${france}`);

  const brazil = getPrimaryCountryBounds(byName("Brazil"));
  assert.deepStrictEqual(brazil, byName("Brazil").b, "Brazil should remain untouched");

  const japan = getPrimaryCountryBounds(byName("Japan"));
  assert.deepStrictEqual(japan, byName("Japan").b, "Japan should remain untouched");
});

// 3. Test generated Python code compiles cleanly with python3 -m py_compile and handles 1D & 2D grids
const buildPythonCodeFactory = new Function(
  "state", "document",
  `${extractFunction(appSrc, "buildPythonCode")}; return buildPythonCode;`
);

test("buildPythonCode generates valid Python handling 1D rectilinear & 2D curvilinear grids", () => {
  const mockDoc = {
    getElementById: (id) => ({
      "select-experiment": { value: "historical" },
      "select-grid": { value: "any" },
      "input-time-start": { value: "1980-01-01" },
      "input-time-end": { value: "2020-12-31" }
    }[id])
  };
  const mockState = {
    latMin: -56, latMax: 13, lonMin: -82, lonMax: -34,
    regionName: "South America",
    selectedVar: { id: "tos", branded: "tos_tavg-u-hxy-sea" }
  };
  const buildPythonCode = buildPythonCodeFactory(mockState, mockDoc);
  const pyCode = buildPythonCode(["UKESM1-3-LL"]);

  assert(pyCode.includes('project="CMIP7"'), "Should specify CMIP7 project");
  assert(pyCode.includes('variable_branded_name="tos_tavg-u-hxy-sea"'), "Should include branded variable");
  assert(!pyCode.includes("progressbar="), "intake-esgf to_dataset_dict() must not pass unsupported progressbar kwarg");
  assert(pyCode.includes("cat.df = cat.df.iloc[:1]"), "Should slice to first dataset by default");
  assert(pyCode.includes('("lat", "latitude", "nav_lat")'), "Should auto-detect latitude coord name");
  assert(pyCode.includes('("lon", "longitude", "nav_lon")'), "Should auto-detect longitude coord name");
  assert(pyCode.includes("lat_vals[0] <= lat_vals[-1]"), "Should handle descending latitude");
  assert(pyCode.includes(").compute()"), "Should compute 2D dask mask before indexing");
  assert(pyCode.includes("mask.any(dim=dims[1])"), "Should index 2D curvilinear ocean grids via .isel()");
  assert(pyCode.includes('cal == "360_day"'), "Should clamp dates safely for 360_day/noleap calendars");
  assert(pyCode.includes("subset.load().to_netcdf(out_file)"), "Should materialize subset before NetCDF4 write");
  assert(pyCode.includes('if len(cat.df) == 0:'), "Should guard against empty search results");

  // Validate syntax with python3
  const tmpPy = path.join(ROOT, ".tmp_test_subset.py");
  fs.writeFileSync(tmpPy, pyCode, "utf8");
  try {
    execFileSync("python3", ["-m", "py_compile", tmpPy], { stdio: "pipe" });
  } finally {
    fs.rmSync(tmpPy, { force: true });
    fs.rmSync(path.join(ROOT, "__pycache__"), { recursive: true, force: true });
  }
});

// 4. Test i18n dictionary parity across EN, PT-BR, and ES
test("i18n.js has matching keys, 30 glossary rows, and 8 FAQs across en, pt, es", () => {
  const ctx = { window: {}, document: { documentElement: {}, querySelectorAll: () => [], getElementById: () => null }, location: { search: "", hash: "" } };
  // Extract TRANSLATIONS object by evaluating i18n.js and inspecting via a quick probe
  const probeSrc = i18nSrc.replace("window.CMIP7_I18N = {", "window.__TRANSLATIONS = TRANSLATIONS; window.CMIP7_I18N = {");
  new Function("window", "document", "location", probeSrc)(ctx.window, ctx.document, ctx.location);
  const T = ctx.window.__TRANSLATIONS;

  const enKeys = Object.keys(T.en).sort();
  const ptKeys = Object.keys(T.pt).sort();
  const esKeys = Object.keys(T.es).sort();
  assert.deepStrictEqual(ptKeys, enKeys, "PT keys must match EN keys");
  assert.deepStrictEqual(esKeys, enKeys, "ES keys must match EN keys");

  assert.strictEqual(T.en.glossary.length, 30, "EN glossary should have 30 rows");
  assert.strictEqual(T.pt.glossary.length, 30, "PT glossary should have 30 rows");
  assert.strictEqual(T.es.glossary.length, 30, "ES glossary should have 30 rows");

  assert.strictEqual(T.en.faqs.length, 8, "EN FAQs should have 8 items");
  assert.strictEqual(T.pt.faqs.length, 8, "PT FAQs should have 8 items");
  assert.strictEqual(T.es.faqs.length, 8, "ES FAQs should have 8 items");
});

console.log(`\n${passed} tests passed.`);
