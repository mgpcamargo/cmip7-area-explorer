(function () {
  "use strict";

  // Savric et al. (2011) Natural Earth projection constants
  const A0 = 0.8707, A1 = -0.131979, A2 = -0.013791, A3 = 0.003971, A4 = -0.001529;
  const B0 = 1.007226, B1 = 0.015085, B2 = -0.044475, B3 = 0.028874, B4 = -0.005916;
  const NE_MAX_X = 2.735384723480633;
  const NE_MAX_Y = 1.422390506730596;

  const STAC_ENDPOINTS = [
    "https://discovery.east.esgf.io/search",
    "https://api.stac.esgf.ceda.ac.uk/search"
  ];

  // Live-verified CMIP7 Branded Variables Catalog (ESGF-NG / MIP-DS7)
  const VARIABLES = [
    { id: "tas", branded: "tas_tavg-h2m-hxy-u", compound: "atmos.tas_tavg-h2m-hxy-u.mon.glb", desc: "Near-Surface Air Temperature (2m mean)", domain: "atmos", mask: "u", freq: "mon, day", cmip6: "Amon.tas", defaultGrid: "g110" },
    { id: "tas", branded: "tas_tmax-h2m-hxy-u", compound: "atmos.tas_tmax-h2m-hxy-u.day.glb", desc: "Daily Max Near-Surface Air Temp (2m)", domain: "atmos", mask: "u", freq: "day", cmip6: "day.tasmax", defaultGrid: "g110", key: "tasmax" },
    { id: "tas", branded: "tas_tmin-h2m-hxy-u", compound: "atmos.tas_tmin-h2m-hxy-u.day.glb", desc: "Daily Min Near-Surface Air Temp (2m)", domain: "atmos", mask: "u", freq: "day", cmip6: "day.tasmin", defaultGrid: "g110", key: "tasmin" },
    { id: "pr", branded: "pr_tavg-u-hxy-u", compound: "atmos.pr_tavg-u-hxy-u.mon.glb", desc: "Precipitation Flux", domain: "atmos", mask: "u", freq: "mon, day", cmip6: "Amon.pr / day.pr", defaultGrid: "g110" },
    { id: "psl", branded: "psl_tavg-u-hxy-u", compound: "atmos.psl_tavg-u-hxy-u.mon.glb", desc: "Sea Level Pressure", domain: "atmos", mask: "u", freq: "mon, day", cmip6: "Amon.psl", defaultGrid: "g110" },
    { id: "uas", branded: "uas_tavg-h10m-hxy-u", compound: "atmos.uas_tavg-h10m-hxy-u.mon.glb", desc: "Eastward Near-Surface Wind (10m)", domain: "atmos", mask: "u", freq: "mon, day", cmip6: "Amon.uas", defaultGrid: "g108" },
    { id: "rsds", branded: "rsds_tavg-u-hxy-u", compound: "atmos.rsds_tavg-u-hxy-u.mon.glb", desc: "Surface Downwelling Shortwave Radiation", domain: "atmos", mask: "u", freq: "mon, day", cmip6: "Amon.rsds", defaultGrid: "g110" },
    { id: "tos", branded: "tos_tavg-u-hxy-sea", compound: "ocean.tos_tavg-u-hxy-sea.mon.glb", desc: "Sea Surface Temperature", domain: "ocean", mask: "sea", freq: "mon", cmip6: "Omon.tos", defaultGrid: "g126" },
    { id: "zos", branded: "zos_tavg-u-hxy-sea", compound: "ocean.zos_tavg-u-hxy-sea.mon.glb", desc: "Sea Surface Height Above Geoid", domain: "ocean", mask: "sea", freq: "mon", cmip6: "Omon.zos", defaultGrid: "g126" },
    { id: "sos", branded: "sos_tavg-u-hxy-sea", compound: "ocean.sos_tavg-u-hxy-sea.mon.glb", desc: "Sea Surface Salinity", domain: "ocean", mask: "sea", freq: "mon", cmip6: "Omon.sos", defaultGrid: "g126" },
    { id: "mrso", branded: "mrso_tavg-u-hxy-lnd", compound: "land.mrso_tavg-u-hxy-lnd.mon.glb", desc: "Total Soil Moisture Content", domain: "land", mask: "lnd", freq: "mon", cmip6: "Lmon.mrso", defaultGrid: "g110" },
    { id: "lai", branded: "lai_tavg-u-hxy-lnd", compound: "land.lai_tavg-u-hxy-lnd.mon.glb", desc: "Leaf Area Index", domain: "land", mask: "lnd", freq: "mon", cmip6: "Lmon.lai", defaultGrid: "g110" },
    { id: "siconc", branded: "siconc_tavg-u-hxy-u", compound: "seaIce.siconc_tavg-u-hxy-u.mon.glb", desc: "Sea-Ice Area Percentage", domain: "seaIce", mask: "u", freq: "mon", cmip6: "SImon.siconc", defaultGrid: "g126" },
    { id: "fgco2", branded: "fgco2_tavg-u-hxy-sea", compound: "ocnBgchem.fgco2_tavg-u-hxy-sea.mon.glb", desc: "Surface Downward Mass Flux of CO2", domain: "ocnBgchem", mask: "sea", freq: "mon", cmip6: "Omon.fgco2", defaultGrid: "g126" }
  ].map(v => ({ ...v, rowKey: v.key || v.id }));

  const WORLD = window.WORLD_110M || { countries: [], lakes: [] };

  const state = {
    latMin: -56,
    latMax: 13,
    lonMin: -82,
    lonMax: -34,
    regionName: "South America",
    lonMode: "360",
    projection: "naturalEarth",
    toolMode: "draw",
    zoom: 1,
    panX: 0,
    panY: 0,
    selectedVar: VARIABLES[0],
    codeTab: "python",
    hoverCountry: null,
    hoverCoords: null,
    interactMode: null,
    dragStartScreen: null,
    dragStartGeo: null,
    dragStartBox: null,
    dragStartPan: null,
    surface: { hasLand: true, hasOcean: true, hasPolar: false, label: "Mixed (Land + Ocean)", countries: [] },
    liveItems: [],
    cart: {}, // id -> STAC feature
    expandedIds: {}, // id -> bool
    previewBbox: null // [lonMin, latMin, lonMax, latMax] of hovered STAC dataset
  };

  const canvas = document.getElementById("world-map");
  const ctx = canvas.getContext("2d");
  const BASE_W = 960;
  const BASE_H = 500;
  const PAD = 20;

  // --- URL Hash Persistence ---
  function loadStateFromHash() {
    if (typeof location === "undefined" || !location.hash || location.hash.length < 2) return;
    try {
      const params = new URLSearchParams(location.hash.slice(1));
      const bbox = params.get("bbox");
      if (bbox) {
        const parts = bbox.split(",").map(Number);
        if (parts.length === 4 && parts.every(n => !Number.isNaN(n))) {
          state.lonMin = Math.max(-180, Math.min(parts[0], parts[2]));
          state.latMin = Math.max(-90, Math.min(parts[1], parts[3]));
          state.lonMax = Math.min(180, Math.max(parts[0], parts[2]));
          state.latMax = Math.min(90, Math.max(parts[1], parts[3]));
          state.regionName = params.get("region") || "Shared Box";
        }
      }
      const varKey = params.get("var");
      if (varKey) {
        const found = VARIABLES.find(v => v.rowKey === varKey || v.branded === varKey);
        if (found) state.selectedVar = found;
      }
      const exp = params.get("exp");
      if (exp) {
        const expEl = document.getElementById("select-experiment");
        if (expEl && Array.from(expEl.options).some(o => o.value === exp)) expEl.value = exp;
      }
      const grid = params.get("grid");
      if (grid) {
        const gEl = document.getElementById("select-grid");
        if (gEl && Array.from(gEl.options).some(o => o.value === grid)) gEl.value = grid;
      }
      const proj = params.get("proj");
      if (proj === "equirect" || proj === "naturalEarth") {
        state.projection = proj;
      }
    } catch (_) {
      // Ignore malformed hashes
    }
  }

  function syncHash() {
    if (typeof history === "undefined" || typeof location === "undefined") return;
    if (location.protocol !== "http:" && location.protocol !== "https:") return;
    const exp = document.getElementById("select-experiment").value;
    const grid = document.getElementById("select-grid").value;
    const params = new URLSearchParams({
      bbox: `${state.lonMin},${state.latMin},${state.lonMax},${state.latMax}`,
      var: state.selectedVar.rowKey,
      exp,
      grid,
      proj: state.projection,
      region: state.regionName
    });
    history.replaceState(null, "", "#" + params.toString());
  }

  // --- Projection Math ---
  function neForward(lonDeg, latDeg) {
    const lam = (lonDeg * Math.PI) / 180;
    const phi = (latDeg * Math.PI) / 180;
    const phi2 = phi * phi;
    const phi4 = phi2 * phi2;
    const x = lam * (A0 + phi2 * (A1 + phi2 * (A2 + phi4 * (A3 + phi2 * A4))));
    const y = phi * (B0 + phi2 * (B1 + phi4 * (B2 + phi2 * (B3 + phi2 * B4))));
    return [x / NE_MAX_X, y / NE_MAX_Y];
  }

  function neInverse(nx, ny) {
    const x = nx * NE_MAX_X;
    const y = Math.max(-1, Math.min(1, ny)) * NE_MAX_Y;
    let phi = y;
    for (let i = 0; i < 12; i++) {
      const phi2 = phi * phi;
      const phi4 = phi2 * phi2;
      const f = phi * (B0 + phi2 * (B1 + phi4 * (B2 + phi2 * (B3 + phi2 * B4)))) - y;
      const df = B0 + phi2 * (3 * B1 + phi4 * (7 * B2 + phi2 * (9 * B3 + 11 * phi2 * B4)));
      phi -= f / df;
      if (Math.abs(f) < 1e-10) break;
    }
    const phi2 = phi * phi;
    const phi4 = phi2 * phi2;
    const lam = x / (A0 + phi2 * (A1 + phi2 * (A2 + phi4 * (A3 + phi2 * A4))));
    return {
      lon: Math.max(-180, Math.min(180, (lam * 180) / Math.PI)),
      lat: Math.max(-90, Math.min(90, (phi * 180) / Math.PI))
    };
  }

  function projectToBase(lon, lat) {
    const usableW = BASE_W - PAD * 2;
    const usableH = BASE_H - PAD * 2;
    if (state.projection === "equirect") {
      return [
        PAD + ((lon + 180) / 360) * usableW,
        PAD + ((90 - lat) / 180) * usableH
      ];
    }
    const [nx, ny] = neForward(lon, lat);
    return [
      BASE_W / 2 + nx * (usableW / 2),
      BASE_H / 2 - ny * (usableH / 2)
    ];
  }

  function projectToScreen(lon, lat) {
    const [bx, by] = projectToBase(lon, lat);
    return [
      (bx - BASE_W / 2) * state.zoom + BASE_W / 2 + state.panX,
      (by - BASE_H / 2) * state.zoom + BASE_H / 2 + state.panY
    ];
  }

  function screenToGeo(sx, sy) {
    const bx = (sx - BASE_W / 2 - state.panX) / state.zoom + BASE_W / 2;
    const by = (sy - BASE_H / 2 - state.panY) / state.zoom + BASE_H / 2;
    const usableW = BASE_W - PAD * 2;
    const usableH = BASE_H - PAD * 2;
    if (state.projection === "equirect") {
      return {
        lon: Math.max(-180, Math.min(180, ((bx - PAD) / usableW) * 360 - 180)),
        lat: Math.max(-90, Math.min(90, 90 - ((by - PAD) / usableH) * 180))
      };
    }
    const nx = (bx - BASE_W / 2) / (usableW / 2);
    const ny = -(by - BASE_H / 2) / (usableH / 2);
    return neInverse(nx, ny);
  }

  // --- Geometry & Spatial Diagnostics ---
  function pointInRing(lon, lat, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lon < ((xj - xi) * (lat - yi)) / ((yj - yi) || 1e-9) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function pointInCountry(lon, lat, country) {
    const [bMinX, bMinY, bMaxX, bMaxY] = country.b;
    if (lon < bMinX || lon > bMaxX || lat < bMinY || lat > bMaxY) return false;
    for (const poly of country.g) {
      if (pointInRing(lon, lat, poly[0])) {
        let inHole = false;
        for (let h = 1; h < poly.length; h++) {
          if (pointInRing(lon, lat, poly[h])) { inHole = true; break; }
        }
        if (!inHole) return true;
      }
    }
    return false;
  }

  function findCountryAt(lon, lat) {
    for (const c of WORLD.countries) {
      if (pointInCountry(lon, lat, c)) return c;
    }
    return null;
  }

  function boxesOverlap(aMinX, aMinY, aMaxX, aMaxY, bMinX, bMinY, bMaxX, bMaxY) {
    return aMinX <= bMaxX && aMaxX >= bMinX && aMinY <= bMaxY && aMaxY >= bMinY;
  }

  function analyzeSelectedArea() {
    const steps = 16;
    let landCount = 0;
    let oceanCount = 0;
    const hitCountries = new Set();

    for (let i = 0; i <= steps; i++) {
      const lat = state.latMin + ((state.latMax - state.latMin) * i) / steps;
      for (let j = 0; j <= steps; j++) {
        const lon = state.lonMin + ((state.lonMax - state.lonMin) * j) / steps;
        const hit = findCountryAt(lon, lat);
        if (hit) {
          landCount++;
          hitCountries.add(hit.n);
        } else {
          oceanCount++;
        }
      }
    }

    for (const c of WORLD.countries) {
      if (hitCountries.has(c.n)) continue;
      if (!boxesOverlap(state.lonMin, state.latMin, state.lonMax, state.latMax, c.b[0], c.b[1], c.b[2], c.b[3])) continue;
      outer: for (const poly of c.g) {
        for (const pt of poly[0]) {
          if (pt[0] >= state.lonMin && pt[0] <= state.lonMax && pt[1] >= state.latMin && pt[1] <= state.latMax) {
            hitCountries.add(c.n);
            landCount = Math.max(landCount, 1);
            break outer;
          }
        }
      }
    }

    const hasLand = landCount > 0;
    const hasOcean = oceanCount > 0;
    const hasPolar = Math.abs(state.latMax) >= 58 || Math.abs(state.latMin) >= 58;

    let label = "Mixed (Land + Ocean)";
    if (hasLand && !hasOcean) label = "Land-only";
    else if (!hasLand && hasOcean) label = "Ocean-only";

    const countriesList = Array.from(hitCountries).sort();
    state.surface = { hasLand, hasOcean, hasPolar, label, countries: countriesList };

    const toRad = Math.PI / 180;
    const latFrac = Math.abs(Math.sin(state.latMax * toRad) - Math.sin(state.latMin * toRad)) / 2;
    const lonFrac = Math.abs(state.lonMax - state.lonMin) / 360;
    const areaPct = Math.max(0.01, latFrac * lonFrac * 100);

    document.getElementById("diag-area-pct").textContent = areaPct.toFixed(1) + "%";
    document.getElementById("diag-surface").textContent = label;
    document.getElementById("region-label").textContent = state.regionName;

    const countriesEl = document.getElementById("diag-countries");
    if (countriesList.length === 0) {
      countriesEl.textContent = "Open Ocean (international waters)";
    } else if (countriesList.length <= 7) {
      countriesEl.textContent = countriesList.join(", ");
    } else {
      countriesEl.textContent = countriesList.slice(0, 7).join(", ") + ` (+${countriesList.length - 7} more)`;
    }

    const realmsEl = document.getElementById("diag-realms");
    const badges = [
      { name: "atmos (u)", ok: true },
      { name: "land (lnd)", ok: hasLand },
      { name: "ocean (sea)", ok: hasOcean },
      { name: "ocnBgchem (sea)", ok: hasOcean },
      { name: "seaIce", ok: hasOcean && hasPolar }
    ];
    realmsEl.innerHTML = badges.map(b =>
      `<span class="pill ${b.ok ? "" : "disabled"}">${b.name}</span>`
    ).join("");

    let advice = "";
    if (areaPct < 20) {
      advice = `Regional box (${areaPct.toFixed(1)}% of globe). Stream via intake-esgf + xarray spatial slicing instead of downloading full global NetCDF files.`;
    } else if (areaPct < 60) {
      advice = `Large regional footprint (${areaPct.toFixed(1)}% of globe). Python streaming works for single variables; use ESGpull or Globus for multi-model ensembles.`;
    } else {
      advice = `Near-global footprint (${areaPct.toFixed(1)}% of globe). Recommended: MetaGrid wget scripts, ESGpull CLI, or Globus bulk transfer.`;
    }
    document.getElementById("diag-advice").textContent = advice;
  }

  // --- Map Rendering ---
  function traceGlobeBoundary() {
    ctx.beginPath();
    if (state.projection === "equirect") {
      const [x1, y1] = projectToScreen(-180, 90);
      const [x2, y2] = projectToScreen(180, -90);
      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      return;
    }
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const lat = 90 - (180 * i) / steps;
      const [x, y] = projectToScreen(180, lat);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = 0; i <= steps; i++) {
      const lon = 180 - (360 * i) / steps;
      const [x, y] = projectToScreen(lon, -90);
      ctx.lineTo(x, y);
    }
    for (let i = 0; i <= steps; i++) {
      const lat = -90 + (180 * i) / steps;
      const [x, y] = projectToScreen(-180, lat);
      ctx.lineTo(x, y);
    }
    for (let i = 0; i <= steps; i++) {
      const lon = -180 + (360 * i) / steps;
      const [x, y] = projectToScreen(lon, 90);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function traceBoxPerimeter(lonMin, latMin, lonMax, latMax) {
    const segs = 24;
    ctx.beginPath();
    for (let i = 0; i <= segs; i++) {
      const lon = lonMin + ((lonMax - lonMin) * i) / segs;
      const [x, y] = projectToScreen(lon, latMax);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = 1; i <= segs; i++) {
      const lat = latMax - ((latMax - latMin) * i) / segs;
      const [x, y] = projectToScreen(lonMax, lat);
      ctx.lineTo(x, y);
    }
    for (let i = 1; i <= segs; i++) {
      const lon = lonMax - ((lonMax - lonMin) * i) / segs;
      const [x, y] = projectToScreen(lon, latMin);
      ctx.lineTo(x, y);
    }
    for (let i = 1; i <= segs; i++) {
      const lat = latMin + ((latMax - latMin) * i) / segs;
      const [x, y] = projectToScreen(lonMin, lat);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function getBoxHandlePoints() {
    const midLon = (state.lonMin + state.lonMax) / 2;
    const midLat = (state.latMin + state.latMax) / 2;
    return [
      { id: "nw", pt: projectToScreen(state.lonMin, state.latMax), cursor: "nwse-resize" },
      { id: "n",  pt: projectToScreen(midLon, state.latMax),       cursor: "ns-resize" },
      { id: "ne", pt: projectToScreen(state.lonMax, state.latMax), cursor: "nesw-resize" },
      { id: "e",  pt: projectToScreen(state.lonMax, midLat),       cursor: "ew-resize" },
      { id: "se", pt: projectToScreen(state.lonMax, state.latMin), cursor: "nwse-resize" },
      { id: "s",  pt: projectToScreen(midLon, state.latMin),       cursor: "ns-resize" },
      { id: "sw", pt: projectToScreen(state.lonMin, state.latMin), cursor: "nesw-resize" },
      { id: "w",  pt: projectToScreen(state.lonMin, midLat),       cursor: "ew-resize" }
    ];
  }

  function drawRings(polys) {
    for (const poly of polys) {
      for (const ring of poly) {
        if (ring.length < 2) continue;
        const [x0, y0] = projectToScreen(ring[0][0], ring[0][1]);
        ctx.moveTo(x0, y0);
        for (let i = 1; i < ring.length; i++) {
          const [x, y] = projectToScreen(ring[i][0], ring[i][1]);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
      }
    }
  }

  function drawMap() {
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== BASE_W * dpr || canvas.height !== BASE_H * dpr) {
      canvas.width = BASE_W * dpr;
      canvas.height = BASE_H * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isLight = document.documentElement.classList.contains("light");
    const outerBg = isLight ? "#dbe6f2" : "#060b16";
    const oceanTop = isLight ? "#d6ebfa" : "#0b1e38";
    const oceanEq = isLight ? "#e6f4fe" : "#112c4f";
    const gridColor = isLight ? "rgba(15, 23, 42, 0.10)" : "rgba(148, 163, 184, 0.14)";
    const specialLineColor = isLight ? "rgba(2, 132, 199, 0.25)" : "rgba(56, 189, 248, 0.22)";
    const landFill = isLight ? "#e9e5d8" : "#243447";
    const landHoverFill = isLight ? "#d6d0bd" : "#324963";
    const borderColor = isLight ? "#94a3b8" : "#475569";
    const coastColor = isLight ? "#64748b" : "#64748b";
    const lakeFill = isLight ? "#cce7fa" : "#0e2645";
    const boxFill = isLight ? "rgba(37, 99, 235, 0.20)" : "rgba(56, 189, 248, 0.20)";
    const boxStroke = isLight ? "#1d4ed8" : "#38bdf8";
    const labelColor = isLight ? "#475569" : "#94a3b8";

    ctx.fillStyle = outerBg;
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    ctx.save();
    traceGlobeBoundary();
    ctx.clip();

    const grad = ctx.createLinearGradient(0, 0, 0, BASE_H);
    grad.addColorStop(0, oceanTop);
    grad.addColorStop(0.5, oceanEq);
    grad.addColorStop(1, oceanTop);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, BASE_W, BASE_H);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let lon = -150; lon <= 150; lon += 30) {
      ctx.beginPath();
      for (let lat = -90; lat <= 90; lat += 5) {
        const [x, y] = projectToScreen(lon, lat);
        if (lat === -90) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      for (let lon = -180; lon <= 180; lon += 10) {
        const [x, y] = projectToScreen(lon, lat);
        if (lon === -180) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = specialLineColor;
    [0, 23.44, -23.44, 66.56, -66.56].forEach(lat => {
      ctx.beginPath();
      for (let lon = -180; lon <= 180; lon += 10) {
        const [x, y] = projectToScreen(lon, lat);
        if (lon === -180) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    ctx.restore();

    ctx.fillStyle = landFill;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 0.75;
    for (const c of WORLD.countries) {
      ctx.beginPath();
      drawRings(c.g);
      ctx.fill("evenodd");
      ctx.stroke();
    }

    if (state.hoverCountry) {
      ctx.save();
      ctx.fillStyle = landHoverFill;
      ctx.strokeStyle = boxStroke;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      drawRings(state.hoverCountry.g);
      ctx.fill("evenodd");
      ctx.stroke();
      ctx.restore();
    }

    if (WORLD.lakes && WORLD.lakes.length) {
      ctx.fillStyle = lakeFill;
      ctx.strokeStyle = coastColor;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      drawRings(WORLD.lakes);
      ctx.fill("evenodd");
      ctx.stroke();
    }

    // Country labels when zoomed in
    if (state.zoom >= 1.8) {
      ctx.font = "500 12px -apple-system, sans-serif";
      ctx.fillStyle = labelColor;
      ctx.textAlign = "center";
      for (const c of WORLD.countries) {
        const areaApprox = (c.b[2] - c.b[0]) * (c.b[3] - c.b[1]);
        if (areaApprox < 12) continue;
        const [cx, cy] = projectToScreen((c.b[0] + c.b[2]) / 2, (c.b[1] + c.b[3]) / 2);
        if (cx >= 0 && cx <= BASE_W && cy >= 0 && cy <= BASE_H) {
          ctx.fillText(c.n, cx, cy);
        }
      }
      ctx.textAlign = "left";
    }

    // Hovered STAC dataset footprint preview
    if (state.previewBbox) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      traceBoxPerimeter(state.previewBbox[0], state.previewBbox[1], state.previewBbox[2], state.previewBbox[3]);
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();
    }

    // User Selection Bounding Box
    ctx.save();
    traceBoxPerimeter(state.lonMin, state.latMin, state.lonMax, state.latMax);
    ctx.fillStyle = boxFill;
    ctx.fill();
    ctx.strokeStyle = boxStroke;
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // End globe clip

    ctx.save();
    traceGlobeBoundary();
    ctx.strokeStyle = coastColor;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();

    const handles = getBoxHandlePoints();
    for (const h of handles) {
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = boxStroke;
      ctx.lineWidth = 2;
      ctx.fillRect(h.pt[0] - 4.5, h.pt[1] - 4.5, 9, 9);
      ctx.strokeRect(h.pt[0] - 4.5, h.pt[1] - 4.5, 9, 9);
    }

    const [cx, cy] = projectToScreen((state.lonMin + state.lonMax) / 2, state.latMax);
    const dLat = Math.round((state.latMax - state.latMin) * 10) / 10;
    const dLon = Math.round((state.lonMax - state.lonMin) * 10) / 10;
    const dimText = `${dLat}° × ${dLon}°`;
    ctx.font = "600 12px ui-monospace, monospace";
    const tw = ctx.measureText(dimText).width + 12;
    const bx = Math.max(8, Math.min(BASE_W - tw - 8, cx - tw / 2));
    const by = Math.max(6, cy - 24);
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(bx, by, tw, 20);
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(dimText, bx + 6, by + 14);

    if (state.zoom <= 1.15) {
      ctx.font = "500 12px ui-monospace, monospace";
      ctx.fillStyle = labelColor;
      [-60, 0, 60].forEach(lat => {
        const [lx, ly] = projectToScreen(-180, lat);
        const txt = lat === 0 ? "0°" : (lat > 0 ? `${lat}°N` : `${Math.abs(lat)}°S`);
        ctx.fillText(txt, Math.max(4, lx - 34), ly + 4);
      });
    }
  }

  // --- Pointer / Zoom / Box Interactions ---
  function getBasePointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * BASE_W,
      y: ((e.clientY - rect.top) / rect.height) * BASE_H
    };
  }

  function findHandleAt(px, py) {
    for (const h of getBoxHandlePoints()) {
      if (Math.abs(px - h.pt[0]) <= 8 && Math.abs(py - h.pt[1]) <= 8) return h;
    }
    return null;
  }

  function isInsideBox(geo) {
    return geo.lon >= state.lonMin && geo.lon <= state.lonMax && geo.lat >= state.latMin && geo.lat <= state.latMax;
  }

  function snapHalf(val) { return Math.round(val * 2) / 2; }

  canvas.addEventListener("pointerdown", (e) => {
    const pos = getBasePointerPos(e);
    const geo = screenToGeo(pos.x, pos.y);
    canvas.setPointerCapture(e.pointerId);

    if (e.button === 1 || e.shiftKey || state.toolMode === "pan") {
      state.interactMode = "pan";
      state.dragStartScreen = pos;
      state.dragStartPan = { x: state.panX, y: state.panY };
      canvas.style.cursor = "grabbing";
      return;
    }

    const handle = findHandleAt(pos.x, pos.y);
    if (handle) {
      state.interactMode = "resize-" + handle.id;
      state.dragStartBox = { latMin: state.latMin, latMax: state.latMax, lonMin: state.lonMin, lonMax: state.lonMax };
      return;
    }

    if (isInsideBox(geo) && !(state.latMin === -90 && state.latMax === 90 && state.lonMin === -180 && state.lonMax === 180)) {
      state.interactMode = "move";
      state.dragStartGeo = geo;
      state.dragStartBox = { latMin: state.latMin, latMax: state.latMax, lonMin: state.lonMin, lonMax: state.lonMax };
      canvas.style.cursor = "move";
      return;
    }

    state.interactMode = "draw";
    state.dragStartGeo = geo;
  });

  canvas.addEventListener("pointermove", (e) => {
    const pos = getBasePointerPos(e);
    const geo = screenToGeo(pos.x, pos.y);
    state.hoverCoords = geo;

    if (!state.interactMode) {
      const country = findCountryAt(geo.lon, geo.lat);
      const changed = (country && country.n) !== (state.hoverCountry && state.hoverCountry.n);
      state.hoverCountry = country;

      const hud = document.getElementById("map-hud");
      hud.textContent = `Lat: ${geo.lat.toFixed(1)}°, Lon: ${geo.lon.toFixed(1)}°` + (country ? ` · ${country.n}` : " · Ocean");

      const handle = findHandleAt(pos.x, pos.y);
      if (state.toolMode === "pan" || e.shiftKey) canvas.style.cursor = "grab";
      else if (handle) canvas.style.cursor = handle.cursor;
      else if (isInsideBox(geo) && !(state.latMin === -90 && state.latMax === 90 && state.lonMin === -180 && state.lonMax === 180)) canvas.style.cursor = "move";
      else canvas.style.cursor = "crosshair";

      if (changed) drawMap();
      return;
    }

    if (state.interactMode === "pan") {
      state.panX = state.dragStartPan.x + (pos.x - state.dragStartScreen.x);
      state.panY = state.dragStartPan.y + (pos.y - state.dragStartScreen.y);
      drawMap();
      return;
    }

    if (state.interactMode === "draw") {
      state.latMin = snapHalf(Math.min(state.dragStartGeo.lat, geo.lat));
      state.latMax = snapHalf(Math.max(state.dragStartGeo.lat, geo.lat));
      state.lonMin = snapHalf(Math.min(state.dragStartGeo.lon, geo.lon));
      state.lonMax = snapHalf(Math.max(state.dragStartGeo.lon, geo.lon));
      if (state.latMax - state.latMin < 0.5) state.latMax = Math.min(90, state.latMin + 1);
      if (state.lonMax - state.lonMin < 0.5) state.lonMax = Math.min(180, state.lonMin + 1);
      state.regionName = "Custom Box";
    } else if (state.interactMode === "move") {
      const dLon = snapHalf(geo.lon - state.dragStartGeo.lon);
      const dLat = snapHalf(geo.lat - state.dragStartGeo.lat);
      const w = state.dragStartBox.lonMax - state.dragStartBox.lonMin;
      const h = state.dragStartBox.latMax - state.dragStartBox.latMin;
      let newLonMin = Math.max(-180, Math.min(180 - w, state.dragStartBox.lonMin + dLon));
      let newLatMin = Math.max(-90, Math.min(90 - h, state.dragStartBox.latMin + dLat));
      state.lonMin = snapHalf(newLonMin);
      state.lonMax = snapHalf(newLonMin + w);
      state.latMin = snapHalf(newLatMin);
      state.latMax = snapHalf(newLatMin + h);
      state.regionName = "Custom Box";
    } else if (state.interactMode.startsWith("resize-")) {
      const edge = state.interactMode.replace("resize-", "");
      const b = state.dragStartBox;
      let laMin = b.latMin, laMax = b.latMax, loMin = b.lonMin, loMax = b.lonMax;
      if (edge.includes("n")) laMax = Math.max(laMin + 0.5, snapHalf(geo.lat));
      if (edge.includes("s")) laMin = Math.min(laMax - 0.5, snapHalf(geo.lat));
      if (edge.includes("e")) loMax = Math.max(loMin + 0.5, snapHalf(geo.lon));
      if (edge.includes("w")) loMin = Math.min(loMax - 0.5, snapHalf(geo.lon));
      state.latMin = Math.max(-90, laMin);
      state.latMax = Math.min(90, laMax);
      state.lonMin = Math.max(-180, loMin);
      state.lonMax = Math.min(180, loMax);
      state.regionName = "Custom Box";
    }

    syncInputs();
    refreshAll();
  });

  canvas.addEventListener("pointerup", () => {
    const wasEditing = state.interactMode && state.interactMode !== "pan";
    state.interactMode = null;
    canvas.style.cursor = state.toolMode === "pan" ? "grab" : "crosshair";
    if (wasEditing) maybeAutoQuery();
  });

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
    zoomAt(factor, getBasePointerPos(e));
  }, { passive: false });

  function zoomAt(factor, pos) {
    const newZoom = Math.max(1, Math.min(8, state.zoom * factor));
    if (newZoom === state.zoom) return;
    const scale = newZoom / state.zoom;
    state.panX = pos.x - BASE_W / 2 - (pos.x - BASE_W / 2 - state.panX) * scale;
    state.panY = pos.y - BASE_H / 2 - (pos.y - BASE_H / 2 - state.panY) * scale;
    state.zoom = newZoom;
    if (state.zoom === 1) { state.panX = 0; state.panY = 0; }
    drawMap();
  }

  function zoomStep(delta) { zoomAt(delta > 0 ? 1.35 : 1 / 1.35, { x: BASE_W / 2, y: BASE_H / 2 }); }
  function resetView() { state.zoom = 1; state.panX = 0; state.panY = 0; drawMap(); }

  function setProjection(proj) {
    state.projection = proj;
    document.getElementById("proj-ne").classList.toggle("active", proj === "naturalEarth");
    document.getElementById("proj-eq").classList.toggle("active", proj === "equirect");
    drawMap();
    syncHash();
  }

  function setToolMode(mode) {
    state.toolMode = mode;
    document.getElementById("tool-draw").classList.toggle("active", mode === "draw");
    document.getElementById("tool-pan").classList.toggle("active", mode === "pan");
    canvas.style.cursor = mode === "pan" ? "grab" : "crosshair";
  }

  // --- Controls & Code Generation ---
  function syncInputs() {
    document.getElementById("input-lat-min").value = state.latMin;
    document.getElementById("input-lat-max").value = state.latMax;
    document.getElementById("input-lon-min").value = state.lonMin;
    document.getElementById("input-lon-max").value = state.lonMax;
  }

  function onManualCoordChange() {
    const la1 = parseFloat(document.getElementById("input-lat-min").value);
    const la2 = parseFloat(document.getElementById("input-lat-max").value);
    const lo1 = parseFloat(document.getElementById("input-lon-min").value);
    const lo2 = parseFloat(document.getElementById("input-lon-max").value);
    if (Number.isNaN(la1) || Number.isNaN(la2) || Number.isNaN(lo1) || Number.isNaN(lo2)) return;
    state.latMin = Math.max(-90, Math.min(la1, la2));
    state.latMax = Math.min(90, Math.max(la1, la2));
    state.lonMin = Math.max(-180, Math.min(lo1, lo2));
    state.lonMax = Math.min(180, Math.max(lo1, lo2));
    state.regionName = "Custom Box";
    refreshAll();
    maybeAutoQuery();
  }

  function applyPreset(name, latMin, latMax, lonMin, lonMax) {
    state.regionName = name;
    state.latMin = latMin; state.latMax = latMax;
    state.lonMin = lonMin; state.lonMax = lonMax;
    syncInputs();
    refreshAll();
    maybeAutoQuery();
  }

  function resetGlobal() { applyPreset("Global", -90, 90, -180, 180); }

  function setLonMode(mode) {
    state.lonMode = mode;
    document.getElementById("lon-mode-360").classList.toggle("active", mode === "360");
    document.getElementById("lon-mode-180").classList.toggle("active", mode === "180");
    updateGeneratedCode();
  }

  function isVarEligible(v) {
    if (v.domain === "seaIce") return (state.surface.hasOcean && state.surface.hasPolar) ? { ok: true, msg: "Available (polar sea)" } : { ok: false, msg: "Low/no sea ice" };
    if (v.mask === "lnd") return state.surface.hasLand ? { ok: true, msg: "Available (land)" } : { ok: false, msg: "No land in box" };
    if (v.mask === "sea") return state.surface.hasOcean ? { ok: true, msg: "Available (ocean)" } : { ok: false, msg: "No ocean in box" };
    return { ok: true, msg: "Available" };
  }

  function renderVariablesTable() {
    const domainFilter = document.getElementById("filter-domain").value;
    const tbody = document.getElementById("variables-tbody");
    const filtered = VARIABLES.filter(v => domainFilter === "all" || v.domain === domainFilter);

    tbody.innerHTML = filtered.map(v => {
      const elig = isVarEligible(v);
      const isSelected = state.selectedVar.rowKey === v.rowKey;
      return `
        <tr onclick="selectVariable('${v.rowKey}')" class="${isSelected ? "selected" : ""}">
          <td class="mono"><strong>${v.id}</strong></td>
          <td class="mono">${v.branded}</td>
          <td>${v.desc}</td>
          <td class="muted">${v.domain} (${v.mask})</td>
          <td class="muted">${v.freq}</td>
          <td class="mono muted">${v.cmip6}</td>
          <td class="${elig.ok ? "ok-text" : "warn-text"}">${elig.ok ? "✓ " : "⚠ "}${elig.msg}</td>
        </tr>
      `;
    }).join("");
  }

  function selectVariable(rowKey) {
    const found = VARIABLES.find(v => v.rowKey === rowKey);
    if (found) {
      state.selectedVar = found;
      renderVariablesTable();
      updateGeneratedCode();
      syncHash();
      maybeAutoQuery();
    }
  }

  function onFilterChanged() {
    updateGeneratedCode();
    syncHash();
    maybeAutoQuery();
  }

  function to360(lon) { return lon < 0 ? lon + 360 : lon; }

  function buildPythonCode(sourceIds) {
    const v = state.selectedVar;
    const exp = document.getElementById("select-experiment").value;
    const grid = document.getElementById("select-grid").value;
    const tStart = document.getElementById("input-time-start").value;
    const tEnd = document.getElementById("input-time-end").value;

    const gridLinePy = grid === "any" ? "" : `\n    grid_label="${grid}",`;
    const sourceLinePy = sourceIds && sourceIds.length
      ? `\n    source_id=${JSON.stringify(sourceIds)},`
      : "";

    const use360 = state.lonMode === "360";
    const lonMinStr = use360 ? to360(state.lonMin) : state.lonMin;
    const lonMaxStr = use360 ? to360(state.lonMax) : state.lonMax;
    const sliceLogic = (use360 && state.lonMin < 0 && state.lonMax > 0)
      ? `# Box crosses Prime Meridian (0°): roll 0..360 coordinates to -180..180 before slicing\nds = ds.assign_coords(lon=((ds.lon + 180) % 360) - 180).sortby("lon")\nsubset = ds.sel(lat=slice(${state.latMin}, ${state.latMax}), lon=slice(${state.lonMin}, ${state.lonMax}), time=slice("${tStart}", "${tEnd}"))`
      : `subset = ds.sel(lat=slice(${state.latMin}, ${state.latMax}), lon=slice(${lonMinStr}, ${lonMaxStr}), time=slice("${tStart}", "${tEnd}"))`;

    const slug = state.regionName.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    return `# Requires: pip install intake-esgf xarray zarr netcdf4
import intake_esgf
import xarray as xr

# 1. Search ESGF-NG STAC catalog for CMIP7
cat = intake_esgf.ESGFCatalog().search(
    project="CMIP7",
    experiment_id="${exp}",
    variable_id="${v.id}",
    variable_branded_name="${v.branded}",${gridLinePy}${sourceLinePy}
)
print(cat)

# 2. Lazy-load matching datasets (streams via Virtual Zarr / HTTP)
datasets = cat.to_dataset_dict(progressbar=True)
ds = next(iter(datasets.values()))

# 3. Subset selected area (${state.regionName}) & time window
${sliceLogic}

# 4. Save regional subset locally as NetCDF4
out_file = "cmip7_${v.branded}_${exp}_${slug}.nc"
subset.to_netcdf(out_file)
print("Saved:", out_file)`;
  }

  function updateGeneratedCode() {
    const v = state.selectedVar;
    const exp = document.getElementById("select-experiment").value;
    const grid = document.getElementById("select-grid").value;
    const tStart = document.getElementById("input-time-start").value;
    const tEnd = document.getElementById("input-time-end").value;

    document.getElementById("summary-selection").textContent =
      `${v.branded} · ${exp} · [${state.latMin}°, ${state.latMax}°] × [${state.lonMin}°, ${state.lonMax}°]`;

    let code = "";
    if (state.codeTab === "python") {
      const cartSources = Array.from(new Set(
        Object.values(state.cart).map(f => f.properties && f.properties["cmip7:source_id"]).filter(Boolean)
      ));
      code = buildPythonCode(cartSources);
    } else if (state.codeTab === "stac") {
      const extraGrid = grid === "any" ? "" : `,\n        {"op": "=", "args": [{"property": "cmip7:grid_label"}, "${grid}"]}`;
      code = `# Live ESGF-NG STAC search endpoint (CORS-enabled)
curl -s -X POST "https://discovery.east.esgf.io/search" \\
  -H "Content-Type: application/json" \\
  -d '{
    "collections": ["CMIP7"],
    "bbox": [${state.lonMin}, ${state.latMin}, ${state.lonMax}, ${state.latMax}],
    "datetime": "${tStart}T00:00:00Z/${tEnd}T23:59:59Z",
    "limit": 20,
    "filter": {
      "op": "and",
      "args": [
        {"op": "=", "args": [{"property": "latest"}, "true"]},
        {"op": "=", "args": [{"property": "cmip7:experiment_id"}, "${exp}"]},
        {"op": "=", "args": [{"property": "cmip7:variable_branded_name"}, "${v.branded}"]}${extraGrid}
      ]
    }
  }' | jq '.features[] | {id, source: .properties["cmip7:source_id"], grid: .properties["cmip7:grid_label"], files: (.assets | keys)}'`;
    } else {
      const gridFacet = grid === "any" ? "" : ` grid_label:${grid}`;
      code = `# Option A: Repo Python Checker CLI (zero external dependencies)
python3 scripts/cmip7_check_area.py \\
  --bbox ${state.lonMin} ${state.latMin} ${state.lonMax} ${state.latMax} \\
  --experiment ${exp} --variable ${v.id} --branded ${v.branded}

# Option B: ESGpull CLI (v0.10.0+ with ESGF-NG STAC support)
pip install esgpull
esgpull self install
esgpull add project:CMIP7 experiment_id:${exp} variable_id:${v.id}${gridFacet}
esgpull search
esgpull download
# Subset downloaded NetCDF files locally with CDO:
# cdo sellonlatbox,${state.lonMin},${state.lonMax},${state.latMin},${state.latMax} in.nc out.nc

# Option C: ESGF MetaGrid Web Portal (HTTP wget / Globus Bulk)
# 1. Open https://metagrid.esgf-west.org/ and filter Project = CMIP7
# 2. Sign in via Institutional SSO or GitHub (OpenID is retired)
# 3. Filter experiment_id=${exp}, variable_branded_name=${v.branded} -> Globus or wget`;
    }

    document.getElementById("code-output").textContent = code;
  }

  // --- Live ESGF-NG Dataset Browser & Download Cart ---
  function formatSize(bytes) {
    if (!bytes) return "—";
    const mb = bytes / (1024 * 1024);
    return mb >= 1024 ? (mb / 1024).toFixed(2) + " GB" : mb.toFixed(1) + " MB";
  }

  function formatYearRange(props) {
    const s = (props.start_datetime || "").slice(0, 4);
    const e = (props.end_datetime || "").slice(0, 4);
    return (s && e) ? `${s}–${e}` : "—";
  }

  function renderLiveDatasets() {
    const wrap = document.getElementById("live-datasets-wrap");
    const tbody = document.getElementById("live-datasets-tbody");

    if (!state.liveItems.length) {
      wrap.classList.add("hidden");
      tbody.innerHTML = "";
      return;
    }

    wrap.classList.remove("hidden");
    tbody.innerHTML = state.liveItems.map((item, idx) => {
      const p = item.properties || {};
      const id = item.id;
      const checked = !!state.cart[id];
      const expanded = !!state.expandedIds[id];
      const assets = Object.entries(item.assets || {});
      let html = `
        <tr onmouseenter="previewItemFootprint(${idx})" onmouseleave="previewItemFootprint(-1)" onclick="toggleFilesRow(${idx})">
          <td onclick="event.stopPropagation()">
            <input type="checkbox" ${checked ? "checked" : ""} onchange="toggleDatasetCart(${idx}, this.checked)" />
          </td>
          <td><strong>${p["cmip7:source_id"] || "—"}</strong><div class="muted small">${p["cmip7:institution_id"] || ""}</div></td>
          <td class="mono">${p["cmip7:experiment_id"] || "—"}<div class="muted small">${p["cmip7:variant_label"] || ""}</div></td>
          <td class="mono">${p["cmip7:variable_branded_name"] || "—"}</td>
          <td class="mono">${p["cmip7:frequency"] || "—"} · ${p["cmip7:grid_label"] || "—"}</td>
          <td class="mono">${formatYearRange(p)}</td>
          <td class="mono">${formatSize(p.size)}</td>
          <td><button class="sm" onclick="event.stopPropagation(); toggleFilesRow(${idx})">${expanded ? "Hide" : "Files"} (${assets.length})</button></td>
        </tr>
      `;
      if (expanded) {
        const filesHtml = assets.map(([fname, a]) => {
          const href = a.href || "#";
          const fSize = formatSize(a["file:size"]);
          return `
            <div class="file-item">
              <span class="mono small">${fname}</span>
              <div class="btn-group">
                <span class="muted small mono">${fSize}</span>
                <a class="small" href="${href}" target="_blank" rel="noopener noreferrer">Download .nc</a>
              </div>
            </div>
          `;
        }).join("");
        html += `<tr class="files-row"><td colspan="8"><div class="file-list">${filesHtml || '<span class="muted small">No HTTP file assets listed.</span>'}</div></td></tr>`;
      }
      return html;
    }).join("");
  }

  function updateCartBar() {
    const bar = document.getElementById("cart-bar");
    const items = Object.values(state.cart);
    if (!items.length) {
      bar.classList.add("hidden");
      return;
    }
    bar.classList.remove("hidden");
    let fileCount = 0;
    let totalBytes = 0;
    for (const it of items) {
      const assets = Object.values(it.assets || {});
      fileCount += assets.length;
      totalBytes += (it.properties && it.properties.size) || 0;
    }
    document.getElementById("cart-summary").textContent =
      `${items.length} dataset(s) · ${fileCount} NetCDF file(s) · ${formatSize(totalBytes)}`;
  }

  function previewItemFootprint(idx) {
    if (idx < 0 || !state.liveItems[idx] || !state.liveItems[idx].bbox) {
      state.previewBbox = null;
    } else {
      state.previewBbox = state.liveItems[idx].bbox;
    }
    drawMap();
  }

  function toggleFilesRow(idx) {
    const item = state.liveItems[idx];
    if (!item) return;
    state.expandedIds[item.id] = !state.expandedIds[item.id];
    renderLiveDatasets();
  }

  function toggleDatasetCart(idx, checked) {
    const item = state.liveItems[idx];
    if (!item) return;
    if (checked) state.cart[item.id] = item;
    else delete state.cart[item.id];
    updateCartBar();
    updateGeneratedCode();
  }

  function clearCart() {
    state.cart = {};
    updateCartBar();
    renderLiveDatasets();
    updateGeneratedCode();
  }

  function triggerDownload(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadWgetScript() {
    const items = Object.values(state.cart);
    if (!items.length) return;
    const lines = [
      "#!/usr/bin/env bash",
      "set -euo pipefail",
      `# CMIP7 NetCDF downloads generated by CMIP7 Area Explorer (${state.regionName}: bbox=[${state.lonMin},${state.latMin},${state.lonMax},${state.latMax}])`,
      ""
    ];
    for (const it of items) {
      lines.push(`# Dataset: ${it.id}`);
      for (const [fname, asset] of Object.entries(it.assets || {})) {
        if (asset.href) lines.push(`wget -c "${asset.href}" -O "${fname}"`);
      }
      lines.push("");
    }
    triggerDownload("download_cmip7.sh", lines.join("\n"), "text/x-shellscript");
  }

  function downloadPythonScript() {
    const cartSources = Array.from(new Set(
      Object.values(state.cart).map(f => f.properties && f.properties["cmip7:source_id"]).filter(Boolean)
    ));
    triggerDownload("subset_cmip7.py", buildPythonCode(cartSources), "text/x-python");
  }

  async function checkLiveEsgf() {
    const statusEl = document.getElementById("live-esgf-status");
    const v = state.selectedVar;
    const exp = document.getElementById("select-experiment").value;
    const grid = document.getElementById("select-grid").value;

    statusEl.innerHTML = `<span class="muted">Querying ESGF-NG STAC for <span class="mono">${v.branded}</span> (${exp})...</span>`;

    const args = [
      { op: "=", args: [{ property: "latest" }, "true"] },
      { op: "=", args: [{ property: "cmip7:experiment_id" }, exp] },
      { op: "=", args: [{ property: "cmip7:variable_branded_name" }, v.branded] }
    ];
    if (grid !== "any") {
      args.push({ op: "=", args: [{ property: "cmip7:grid_label" }, grid] });
    }

    const body = JSON.stringify({
      collections: ["CMIP7"],
      bbox: [state.lonMin, state.latMin, state.lonMax, state.latMax],
      limit: 12,
      filter: { op: "and", args }
    });

    let lastErr = null;
    for (const endpoint of STAC_ENDPOINTS) {
      try {
        const resp = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        state.liveItems = data.features || [];
        const matched = data.numberMatched ?? state.liveItems.length;
        renderLiveDatasets();

        if (state.liveItems.length === 0) {
          statusEl.innerHTML = `<span class="warn-text">0 live datasets found</span> for <span class="mono">${v.branded}</span> in <span class="mono">${exp}</span> (try <span class="mono">scen7-vl</span>, <span class="mono">scen7-h</span>, <span class="mono">historical</span>, or <span class="mono">esm-hist</span>).`;
        } else {
          statusEl.innerHTML = `<span class="ok-text">${matched} datasets matched</span> via <span class="mono">${new URL(endpoint).host}</span> (showing ${state.liveItems.length}).`;
        }
        return;
      } catch (err) {
        lastErr = err;
      }
    }

    state.liveItems = [];
    renderLiveDatasets();
    statusEl.innerHTML = `<span class="warn-text">Live browser fetch unavailable (${lastErr ? lastErr.message : "network"}).</span> Use <span class="mono">scripts/cmip7_check_area.py</span> in your terminal.`;
  }

  function maybeAutoQuery() {
    const toggle = document.getElementById("auto-query-toggle");
    if (!toggle || !toggle.checked) return;
    if (typeof location !== "undefined" && (location.protocol === "http:" || location.protocol === "https:")) {
      checkLiveEsgf();
    }
  }

  function switchCodeTab(tab) {
    state.codeTab = tab;
    ["python", "stac", "cli"].forEach(t => {
      document.getElementById("code-tab-" + t).classList.toggle("active", t === tab);
    });
    updateGeneratedCode();
  }

  function switchMainTab(tab) {
    const isExp = tab === "explorer";
    document.getElementById("panel-explorer").classList.toggle("hidden", !isExp);
    document.getElementById("panel-guidelines").classList.toggle("hidden", isExp);
    document.getElementById("tab-btn-explorer").classList.toggle("active", isExp);
    document.getElementById("tab-btn-guidelines").classList.toggle("active", !isExp);
    if (isExp) drawMap();
  }

  function toggleTheme() {
    document.documentElement.classList.toggle("light");
    drawMap();
  }

  function copyCode() {
    const text = document.getElementById("code-output").textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("copy-btn");
      btn.textContent = "Copied!";
      setTimeout(() => { btn.textContent = "Copy"; }, 1500);
    });
  }

  function copyShareUrl() {
    syncHash();
    const url = typeof location !== "undefined" ? location.href : "";
    if (!url || !navigator.clipboard) return;
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById("share-btn");
      btn.textContent = "Link Copied!";
      setTimeout(() => { btn.textContent = "Share Link"; }, 1500);
    });
  }

  function refreshAll() {
    drawMap();
    analyzeSelectedArea();
    renderVariablesTable();
    updateGeneratedCode();
    syncHash();
  }

  Object.assign(window, {
    zoomStep,
    resetView,
    setProjection,
    setToolMode,
    onManualCoordChange,
    applyPreset,
    resetGlobal,
    setLonMode,
    renderVariablesTable,
    selectVariable,
    onFilterChanged,
    updateGeneratedCode,
    checkLiveEsgf,
    previewItemFootprint,
    toggleFilesRow,
    toggleDatasetCart,
    clearCart,
    downloadWgetScript,
    downloadPythonScript,
    switchCodeTab,
    switchMainTab,
    toggleTheme,
    copyCode,
    copyShareUrl
  });

  loadStateFromHash();
  syncInputs();
  document.getElementById("proj-ne").classList.toggle("active", state.projection === "naturalEarth");
  document.getElementById("proj-eq").classList.toggle("active", state.projection === "equirect");
  refreshAll();
  maybeAutoQuery();
})();
