(function () {
  "use strict";

  const PRESET_NAMES = {
    "South America": { en: "South America", pt: "América do Sul", es: "América del Sur" },
    "Amazon Basin": { en: "Amazon Basin", pt: "Bacia Amazônica", es: "Cuenca Amazónica" },
    "North America": { en: "North America", pt: "América do Norte", es: "América del Norte" },
    "Europe": { en: "Europe", pt: "Europa", es: "Europa" },
    "Mediterranean": { en: "Mediterranean", pt: "Mediterrâneo", es: "Mediterráneo" },
    "Africa": { en: "Africa", pt: "África", es: "África" },
    "East Asia": { en: "East Asia", pt: "Leste Asiático", es: "Asia Oriental" },
    "Australia & NZ": { en: "Australia & NZ", pt: "Austrália e NZ", es: "Australia y NZ" },
    "Niño 3.4 (ENSO)": { en: "Niño 3.4 (ENSO)", pt: "Niño 3.4 (ENOS)", es: "Niño 3.4 (ENOS)" },
    "North Atlantic": { en: "North Atlantic", pt: "Atlântico Norte", es: "Atlántico Norte" },
    "Arctic": { en: "Arctic", pt: "Ártico", es: "Ártico" },
    "Global": { en: "Global", pt: "Global", es: "Global" },
    "Custom Box": { en: "Custom Box", pt: "Área Personalizada", es: "Área Personalizada" }
  };

  const TRANSLATIONS = {
    en: {
      htmlLang: "en",
      pageTitle: "CMIP7 Area Explorer & ESGF-NG Portal",
      subtitle: "Sort and download state-of-the-art climate projection datasets.",
      navExplorer: "Area Explorer",
      navGuides: "Guides",
      switchToDark: "Switch to Dark Mode",
      switchToLight: "Switch to Light Mode",
      step01Title: "Select Geographic Area",
      projNE: "Natural Earth",
      projEq: "Equirectangular",
      toolDraw: "Draw Box",
      toolPan: "Pan",
      btnGlobal: "Global",
      btnGlobalTitle: "Select full globe (-90..90, -180..180)",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      zoomReset: "Reset zoom & pan",
      layersTitle: "Map layers (Atlas & Satellite)",
      mapType: "Map Type",
      layerAtlas: "Atlas",
      layerSatellite: "Satellite",
      mapDetails: "Map Details",
      bordersLabels: "Borders & Labels",
      latLonGrid: "Lat/Lon Grid",
      attribAtlas: "Natural Earth 1:50m (Public Domain)",
      attribSatellite: "Imagery: Copernicus Sentinel-2 Cloudless (EOX) · CC-BY-4.0",
      hudDefault: "Lat: — , Lon: —",
      hudOcean: "Ocean",
      hudDoubleClick: "2× click to select",
      regionsLabel: "Regions:",
      presetSouthAmerica: "South America",
      presetAmazon: "Amazon Basin",
      presetNorthAmerica: "North America",
      presetEurope: "Europe",
      presetMediterranean: "Mediterranean",
      presetAfrica: "Africa",
      presetEastAsia: "East Asia",
      presetAustraliaNZ: "Australia & NZ",
      presetNino34: "Niño 3.4",
      presetNorthAtlantic: "North Atlantic",
      presetArctic: "Arctic",
      boundsHeading: "Area Bounds & Diagnostics",
      latMin: "Lat Min (°N)",
      latMax: "Lat Max (°N)",
      lonMin: "Lon Min (°E)",
      lonMax: "Lon Max (°E)",
      eligibilityHeading: "Regional Eligibility Summary",
      globalAreaPct: "Global Area %",
      surfaceMask: "Surface Mask",
      surfaceMixed: "Mixed (Land + Ocean)",
      surfaceLand: "Land-only",
      surfaceOcean: "Ocean-only",
      intersectingLabel: "Intersecting territories: ",
      openOcean: "Open Ocean (international waters)",
      moreCount: "+{n} more",
      twoPathTitle: "Two ways to get this {pct}% area:",
      twoPathTitleDefault: "Two ways to get this area:",
      pathATitle: 'A. Regional subset output <span class="rec-tag">Recommended</span>',
      pathADesc: 'Export and run the Step 03 Python script on your machine to download a cropped <span class="mono">.nc</span> file for your region.',
      pathBTitle: "B. Full-globe NetCDF links / wget",
      pathBDesc: 'Official ESGF mirrors host global (<span class="mono">_glb_</span>) files. Download them directly or via <span class="mono">wget</span>, then crop locally with <span class="mono">cdo sellonlatbox</span>.',
      step02Title: "Select Variable & Search Catalog",
      step02Desc: "Pick a climate variable and scenario to find available datasets.",
      domainAll: "All Realms / Domains",
      domainAtmos: "Atmosphere (atmos)",
      domainOcean: "Ocean (ocean)",
      domainLand: "Land (land)",
      domainSeaIce: "Sea Ice (seaIce)",
      domainOcnBgchem: "Ocean Biogeochem (ocnBgchem)",
      expHistorical: "historical (1850–2021)",
      expEsmHist: "esm-hist (Emissions-driven)",
      expScenVl: "scen7-vl (ScenarioMIP Very Low)",
      expScenM: "scen7-m (ScenarioMIP Medium)",
      expScenH: "scen7-h (ScenarioMIP High)",
      expAmip: "amip (Atmos-only)",
      expPiControl: "piControl (Pre-industrial)",
      exp1pct: "1pctCO2 (Idealized)",
      expAbrupt: "abrupt-4xCO2 (Idealized)",
      gridAny: "Any CMIP7 grid_label",
      gridG110: "g110 (Atmos/Land standard)",
      gridG126: "g126 (Ocean standard)",
      gridG108: "g108 (Atmos vector/wind)",
      gridG124: "g124 (Ocean vector)",
      startDateTitle: "Start date (YYYY-MM-DD)",
      endDateTitle: "End date (YYYY-MM-DD)",
      thVarId: "Var ID",
      thBranded: "CMIP7 Branded Name",
      thDesc: "Description",
      thRealm: "Realm (Mask)",
      thFreq: "Freq",
      thCmip6: "CMIP6 Legacy",
      thAreaStatus: "Area Status",
      varDescs: {
        tas: "Near-Surface Air Temperature (2m mean)",
        tasmax: "Daily Max Near-Surface Air Temp (2m)",
        tasmin: "Daily Min Near-Surface Air Temp (2m)",
        pr: "Precipitation Flux",
        psl: "Sea Level Pressure",
        uas: "Eastward Near-Surface Wind (10m)",
        rsds: "Surface Downwelling Shortwave Radiation",
        tos: "Sea Surface Temperature",
        zos: "Sea Surface Height Above Geoid",
        sos: "Sea Surface Salinity",
        mrso: "Total Soil Moisture Content",
        lai: "Leaf Area Index",
        siconc: "Sea-Ice Area Percentage",
        fgco2: "Surface Downward Mass Flux of CO2"
      },
      eligPolarOk: "Available (polar sea)",
      eligPolarNo: "Low/no sea ice",
      eligLandOk: "Available (land)",
      eligLandNo: "No land in box",
      eligOceanOk: "Available (ocean)",
      eligOceanNo: "No ocean in box",
      eligOk: "Available",
      btnScanEsgf: "Scan Live ESGF-NG Datasets",
      page50: "50 per page",
      page100: "100 per page",
      page200: "200 per page",
      pageAll: "Load all matches",
      autoQueryLabel: "Auto-query on filter change",
      statusReady: 'Ready to query <span class="mono">discovery.east.esgf.io/search</span>',
      statusQuerying: '<span class="muted">Querying ESGF-NG STAC for <span class="mono">{branded}</span> ({exp})...</span>',
      statusZero: '<span class="warn-text">0 live datasets found</span> for <span class="mono">{branded}</span> in <span class="mono">{exp}</span> (try <span class="mono">scen7-vl</span>, <span class="mono">scen7-h</span>, <span class="mono">historical</span>, or <span class="mono">esm-hist</span>).',
      statusMatched: '<span class="ok-text">{total} datasets matched</span> via <span class="mono">{host}</span> (showing {shown}).',
      statusLoadingMore: '<span class="muted">Loading {loaded} / {total} datasets...</span>',
      statusLoadErr: '<span class="warn-text">Error loading next page ({msg}).</span>',
      statusStoppedErr: '<span class="warn-text">Stopped loading all pages ({msg}). Showing {shown}.</span>',
      statusFetchUnavail: '<span class="warn-text">Live browser fetch unavailable ({msg}).</span> Use <span class="mono">scripts/cmip7_check_area.py</span> in your terminal.',
      allLoaded: "All loaded ({n})",
      allFreqs: "All freqs",
      searchPlaceholder: "Filter model, variant, grid...",
      thModel: "Model (source_id)",
      thExpVar: "Experiment / Variant",
      thBrandedVar: "Branded Variable",
      thFreqGrid: "Freq · Grid",
      thTimeSpan: "Time Span",
      thSize: "Size",
      thFiles: "Files",
      noMatchFilter: "No loaded datasets match the current filter.",
      btnHide: "Hide",
      btnFiles: "Files",
      drawerNote: '<strong style="color:var(--fg);">Official ESGF mirrors only store full-globe files (<span class="mono">_glb_</span>).</strong> To get only your box (<span class="mono">{latMin}°..{latMax}°N, {lonMin}°..{lonMax}°E</span>), export and run the Python script in Step 03 on your machine, or crop these files after downloading.',
      fullGlobePill: "Full Globe",
      downloadGlobalNc: "Download Global .nc ↗",
      cropAfterDownload: "Crop after download:",
      btnCopyCdo: "Copy CDO",
      noHttpAssets: "No HTTP file assets listed.",
      paginationSummary: "Loaded {loaded} of {total} matched datasets",
      loadingText: "Loading...",
      btnLoadNext: "Load Next {n}",
      btnLoadAllRem: "Load All Remaining ({n})",
      cartLabel: "Download Cart:",
      cartSummary: "{n} dataset(s) · {files} global NetCDF file(s) · {size}",
      cartSummaryZero: "0 datasets selected",
      btnCartPy: "Python Subset (.py) · Area Only ★",
      btnCartWget: "wget (.sh) · Full Global Files",
      btnClearCart: "Clear Cart",
      step03Title: "Export Regional Download / Subsetting Script",
      selectionLabel: "Selection:",
      codeTabPython: "Python Area Crop ★",
      codeTabStac: "STAC API (cURL)",
      codeTabCli: "ESGpull / CDO CLI",
      codeOtherMethods: "Other methods",
      codeOptPyTitle: "Python Area Crop ★ (Recommended)",
      codeOptPyDesc: "Downloads & crops only your region into a local .nc file. Best for most researchers & students.",
      codeOptStacTitle: "STAC API (cURL)",
      codeOptStacDesc: "Fetches raw JSON catalog metadata & file URLs. Best for developers and shell/jq pipelines.",
      codeOptCliTitle: "ESGpull / CDO CLI",
      codeOptCliDesc: "Terminal bulk download & CDO cropping commands. Best for Linux/HPC clusters & multi-model archives.",
      btnDownloadPy: "Download .py",
      btnDownloadSh: "Download .sh",
      btnCopy: "Copy",
      btnCopied: "Copied!",
      visualGuidePdf: "docs/CMIP7_Area_Explorer_Visual_Guide.pdf",
      visualGuideTitle: "Visual User Guide",
      visualGuideDesc: "Illustrated PDF walkthrough covering area selection, CMIP7 branded variables, live ESGF-NG queries, and local subsetting scripts.",
      visualGuideCta: "Open Visual Guide ↗",
      guide01Title: "How CMIP7 Data Access Works",
      guide01Body: `
        <li><strong style="color:var(--fg);">Modern STAC catalog search:</strong> CMIP7 replaces legacy ESGF nodes with cloud-friendly STAC APIs (<span class="mono">discovery.east.esgf.io</span>, <span class="mono">api.stac.esgf.ceda.ac.uk</span>).</li>
        <li><strong style="color:var(--fg);">Institutional / GitHub sign-in (No OpenID):</strong> Authenticate on MetaGrid (<span class="mono">metagrid.esgf-west.org</span>) using Institutional SSO or GitHub when required.</li>
        <li><strong style="color:var(--fg);">Global files + local Python cropping:</strong> Official ESGF mirrors host full-globe <span class="mono">.nc</span> files under <strong>CC-BY-4.0</strong>. This tool builds an <span class="mono">intake-esgf</span> + <span class="mono">xarray</span> script that subsets your exact bounding box and saves a regional NetCDF4 file.</li>`,
      guide02Title: "CMIP7 Branded Variable Syntax",
      guide02Intro: 'Instead of CMIP6 table prefixes like <span class="mono">day.tasmax</span>, CMIP7 places the root physical variable first followed by structured branding suffixes:',
      guide02Body: `
        <li><span class="mono" style="color:var(--fg);">tas</span>: root variable (air temperature; <span class="mono">pr</span> = precipitation, <span class="mono">tos</span> = sea surface temp)</li>
        <li><span class="mono" style="color:var(--fg);">tmax / tavg</span>: temporal statistic (daily maximum vs. time mean)</li>
        <li><span class="mono" style="color:var(--fg);">h2m</span>: vertical coordinate (2m height; <span class="mono">u</span> = unlevelled/surface)</li>
        <li><span class="mono" style="color:var(--fg);">u / sea / lnd</span>: horizontal area mask (unmasked everywhere, ocean-only, or land-only)</li>`,
      guide03Title: "Standardized Grids & Experiments",
      guide03Body: `
        <li><strong style="color:var(--fg);">Grid labels (<span class="mono">grid_label</span>):</strong> Codes such as <span class="mono">g110</span> (atmosphere/land) or <span class="mono">g126</span> (ocean) identify MIP-DRS7 grid definitions. Leave set to <strong>Any</strong> unless comparing a single target grid.</li>
        <li><strong style="color:var(--fg);">Core &amp; ScenarioMIP experiments:</strong> Includes <span class="mono">historical</span>, <span class="mono">esm-hist</span> (emissions-driven), <span class="mono">piControl</span>, <span class="mono">amip</span>, idealized CO₂ runs, and <span class="mono">scen7-vl</span> / <span class="mono">scen7-m</span> / <span class="mono">scen7-h</span> projections.</li>`,
      guide04Title: "Choosing a Download Workflow",
      guide04Body: `
        <li><strong style="color:var(--fg);">Regional subset only:</strong> Click <strong style="color:var(--fg);">Download .py</strong> (or <strong style="color:var(--fg);">Copy</strong>) under <strong style="color:var(--fg);">Python Area Crop ★</strong> in Step 03 and run it locally in Python to fetch and save a cropped <span class="mono">.nc</span> file.</li>
        <li><strong style="color:var(--fg);">Direct full-globe NetCDF files:</strong> Use <strong style="color:var(--fg);">Download Global .nc ↗</strong> or <strong style="color:var(--fg);">wget (.sh)</strong>, then crop locally with <span class="mono">cdo sellonlatbox,...</span>.</li>
        <li><strong style="color:var(--fg);">Advanced / HPC workflows:</strong> Open <strong style="color:var(--fg);">Other methods ▾</strong> in Step 03 for raw <span class="mono">STAC API (cURL)</span> queries, <span class="mono">ESGpull</span> CLI (<span class="mono">v0.10.0+</span>), or <strong>Globus</strong> via <a href="https://metagrid.esgf-west.org/" target="_blank" rel="noopener noreferrer">ESGF MetaGrid</a>.</li>`,
      glossaryTitle: "Glossary",
      thAcronym: "Acronym",
      thMeaning: "Meaning",
      thExplanation: "Explanation",
      glossary: [
        ["AMIP", "Atmospheric Model Intercomparison Project", "A standardized climate experiment running atmosphere-only models forced by observed sea surface temperatures and sea ice."],
        ["API", "Application Programming Interface", "A structured software interface allowing scripts and web applications to query live ESGF-NG catalogs programmatically."],
        ["CC-BY-4.0", "Creative Commons Attribution 4.0 International", "The open data license under which CMIP7 model outputs are published, requiring attribution to the modeling groups."],
        ["CDO", "Climate Data Operators", 'A command-line toolkit for manipulating gridded climate files, used via <span class="mono">sellonlatbox</span> to crop global NetCDF files locally.'],
        ["CLI", "Command-Line Interface", 'A text-based terminal interface used to execute tools such as <span class="mono">esgpull</span>, <span class="mono">cdo</span>, and standalone Python scripts.'],
        ["CMIP7", "Coupled Model Intercomparison Project Phase 7", "The seventh phase of the global WCRP framework coordinating standardized climate model experiments and data releases."],
        ["CMIP7-AFT", "CMIP7 Assessment Fast Track", "Priority CMIP7 model simulations released ahead of the full archive to support upcoming international climate assessments."],
        ["CMIP-IPO", "CMIP International Project Office", "The international coordination office supporting CMIP governance, technical standards, and modeling community outreach."],
        ["CMOR", "Climate Model Output Rewriter", "The standard software library and formatting convention traditionally used to structure climate model variables and metadata."],
        ["CORS", "Cross-Origin Resource Sharing", "A browser security mechanism enabled by ESGF-NG STAC endpoints so this client-side page can query live datasets directly."],
        ["cURL", "Client URL", "A command-line utility for transferring data over HTTP/HTTPS, used in Step 03 to send STAC catalog search requests."],
        ["ENSO", "El Niño–Southern Oscillation", "A major coupled ocean–atmosphere climate oscillation in the tropical Pacific, monitored via regions such as the Niño 3.4 box."],
        ["EOX", "EOX IT Services", "The geospatial service provider hosting the open Copernicus Sentinel-2 Cloudless satellite tile mosaic used in the map viewer."],
        ["ESA", "European Space Agency", "The European space organization operating the Copernicus Sentinel-2 satellites that capture the Satellite layer imagery."],
        ["ESGF", "Earth System Grid Federation", "The global federated data infrastructure that stores and distributes CMIP climate simulation outputs worldwide."],
        ["ESGF-NG", "Earth System Grid Federation Next Generation", "The modernized ESGF architecture built around cloud-friendly STAC search APIs and federated single sign-on."],
        ["ESM", "Earth System Model", 'A comprehensive climate model used in runs like <span class="mono">esm-hist</span> that interactively couples physics with the carbon cycle.'],
        ["HPC", "High-Performance Computing", "Supercomputing clusters and institutional workstations commonly used to download and process multi-model NetCDF ensembles."],
        ["IAG/USP", "Institute of Astronomy, Geophysics and Atmospheric Sciences / University of São Paulo", "The academic institute and university in Brazil where CMIP7 Area Explorer was created."],
        ["JSON", "JavaScript Object Notation", "A lightweight text data format used by STAC APIs to return dataset metadata, footprints, and file asset URLs."],
        ["MIP-DRS7", "Model Intercomparison Project Data Reference Syntax for CMIP7", "The official CMIP7 metadata and naming standard defining branded variables, grid labels, realms, and directory layouts."],
        ["MIT", "Massachusetts Institute of Technology (License)", "The permissive open-source software license governing the CMIP7 Area Explorer web application and companion script."],
        ["NetCDF4", "Network Common Data Form (Version 4)", "An HDF5-backed binary scientific file format used across CMIP to store multidimensional gridded climate variables."],
        ["OpenID", "Open Identity (Legacy ESGF Authentication)", "The retired federated login system from legacy ESGF portals, replaced by Institutional SSO and GitHub in ESGF-NG."],
        ["ScenarioMIP", "Scenario Model Intercomparison Project", 'The CMIP activity defining future emissions and socioeconomic projection experiments such as <span class="mono">scen7-vl</span>, <span class="mono">scen7-m</span>, and <span class="mono">scen7-h</span>.'],
        ["SSO", "Single Sign-On", "Modern institutional or GitHub authentication used on ESGF MetaGrid when transferring large ensembles via Globus."],
        ["STAC", "SpatioTemporal Asset Catalog", "An open geospatial catalog specification enabling fast filtering of climate datasets by bounding box, time, and model properties."],
        ["WCRP", "World Climate Research Programme", "The international scientific body coordinating CMIP and global climate variability and projection research."],
        ["WGS84", "World Geodetic System 1984", "The standard geographic latitude/longitude reference system used for bounding boxes and satellite tile layers."],
        ["Zarr", "Zarr Chunked Array Format", 'A cloud-optimized chunked array format supported alongside NetCDF by <span class="mono">xarray</span> and <span class="mono">intake-esgf</span>.']
      ],
      faqTitle: "Frequently Asked Questions",
      btnExpandAll: "Expand All",
      btnCollapseAll: "Collapse All",
      faqs: [
        [
          "01",
          "Does this website crop and download NetCDF files directly inside my browser?",
          'Official ESGF-NG mirrors distribute full-globe (<span class="mono">_glb_</span>) NetCDF4 files that often span hundreds of megabytes to several gigabytes per simulation. Rather than pulling multi-gigabyte arrays into browser memory, <strong>CMIP7 Area Explorer</strong> queries live ESGF-NG STAC catalogs in real time and generates a reproducible <span class="mono">intake-esgf</span> + <span class="mono">xarray</span> Python script (or <span class="mono">wget</span> + <span class="mono">cdo sellonlatbox</span> workflow) that subsets and saves your exact bounding box on your workstation or HPC environment.'
        ],
        [
          "02",
          'Why do CMIP7 variable names look like <span class="mono">tas_tavg-h2m-hxy-u</span> instead of CMIP6\'s <span class="mono">Amon.tas</span>?',
          'Under the <strong>MIP-DRS7</strong> standard, CMIP7 replaces opaque CMOR table names with self-describing <strong>branded variable names</strong> formatted as <span class="mono">&lt;root&gt;_&lt;temporal&gt;-&lt;vertical&gt;-&lt;horizontal&gt;-&lt;area_mask&gt;</span>. For example, daily maximum and minimum 2m air temperature share the physical root <span class="mono">tas</span> and are distinguished explicitly as <span class="mono">tas_tmax-h2m-hxy-u</span> and <span class="mono">tas_tmin-h2m-hxy-u</span>. Step 02 displays both the new CMIP7 branded syntax and legacy CMIP6 equivalents side by side.'
        ],
        [
          "03",
          'How are <span class="mono">0°–360°</span> longitudes and Prime Meridian (<span class="mono">0°</span>) crossings handled?',
          'Climate models store native longitudes on either <span class="mono">0°..360°E</span> or <span class="mono">-180°..180°</span>. To prevent empty slices or coordinate mismatches, the Step 03 Python script automatically checks <span class="mono">ds.lon.max() &gt; 180</span> at runtime and normalizes longitudes to <span class="mono">-180..180</span> before calling <span class="mono">ds.sel(...)</span>, so regions crossing <span class="mono">0°E</span> (such as Europe, Mediterranean, or West Africa) work seamlessly.'
        ],
        [
          "04",
          'What do the <span class="mono">⚠ No ocean in box</span> or <span class="mono">⚠ Low/no sea ice</span> status warnings mean?',
          'When you draw or move a box on the 1:50m map, the portal tests spatial intersection against land polygons, ocean waters, and high-latitude polar zones (<span class="mono">|lat| ≥ 58°</span>). If you select an inland continental box (e.g., central Amazonia), ocean-masked variables (<span class="mono">-sea</span>, such as <span class="mono">tos</span> or <span class="mono">fgco2</span>) will contain only missing/masked grid cells (<span class="mono">NaN</span>). These flags are advisory diagnostics, so you can still click any variable and query the catalog.'
        ],
        [
          "05",
          'Why did a live ESGF-NG scan return <span class="mono">0 live datasets found</span> for a specific combination?',
          'CMIP7 and Assessment Fast Track (CMIP7-AFT) simulations are progressively published across federated STAC endpoints (<span class="mono">discovery.east.esgf.io</span> and <span class="mono">api.stac.esgf.ceda.ac.uk</span>). If a specific scenario or grid label currently returns zero matches, try leaving <span class="mono">grid_label</span> set to <strong>Any</strong>, testing core experiments such as <span class="mono">historical</span>, <span class="mono">esm-hist</span>, <span class="mono">piControl</span>, <span class="mono">scen7-vl</span>, or <span class="mono">scen7-h</span>, or running the standalone CLI script <span class="mono">scripts/cmip7_check_area.py</span>.'
        ],
        [
          "06",
          "Do I need an ESGF OpenID account or API key to use this portal or download files?",
          'No API key or login is required to use CMIP7 Area Explorer or download public HTTPS NetCDF assets. Legacy ESGF OpenID has been retired in ESGF-NG; if you later use bulk transfer services such as Globus on <a href="https://metagrid.esgf-west.org/" target="_blank" rel="noopener noreferrer">ESGF MetaGrid</a>, sign-in uses modern Institutional SSO or GitHub authentication.'
        ],
        [
          "07",
          'How do the <span class="mono">Atlas</span> and <span class="mono">Satellite</span> map views and overlays help area selection?',
          'Click the stacked <strong>Layers</strong> icon beneath the zoom buttons (<span class="mono">+ / − / ⟲</span>) to switch between the fast offline <strong>1:50m Vector Atlas</strong> and <strong>Satellite</strong> (ESA Copernicus Sentinel-2 Cloudless), and toggle <strong>Borders &amp; Labels</strong> or the <strong>Lat/Lon Grid</strong>.'
        ],
        [
          "08",
          "What licenses govern CMIP7 datasets and this web application, and how do I cite it?",
          'All CMIP7 model outputs are released under <strong>Creative Commons Attribution 4.0 (<span class="mono">CC-BY-4.0</span>)</strong>. Please cite the participating modeling groups and WCRP CMIP7 in publications. <strong>CMIP7 Area Explorer</strong> is an open-source utility (<a href="https://github.com/mgpcamargo/cmip7-area-explorer/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>) developed at IAG/USP; formal software citation metadata is available via <a href="https://github.com/mgpcamargo/cmip7-area-explorer/blob/main/CITATION.cff" target="_blank" rel="noopener noreferrer"><span class="mono">CITATION.cff</span></a> on GitHub.'
        ]
      ],
      footerSecondary: 'Developed by <strong>Marcelo G. P. Camargo</strong> · Dept. of Atmospheric Sciences (IAG/USP) · <a href="https://github.com/mgpcamargo/cmip7-area-explorer/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a> · CMIP7 model datasets are licensed under <strong>CC-BY-4.0</strong>.'
    },

    pt: {
      htmlLang: "pt-BR",
      pageTitle: "CMIP7 Area Explorer · Portal ESGF-NG",
      subtitle: "Filtre e baixe conjuntos de dados de projeções climáticas de última geração.",
      navExplorer: "Explorador de Área",
      navGuides: "Guias",
      switchToDark: "Alternar para Modo Escuro",
      switchToLight: "Alternar para Modo Claro",
      step01Title: "Selecionar Área Geográfica",
      projNE: "Natural Earth",
      projEq: "Equiretangular",
      toolDraw: "Desenhar Caixa",
      toolPan: "Mover Mapa",
      btnGlobal: "Global",
      btnGlobalTitle: "Selecionar globo inteiro (-90..90, -180..180)",
      zoomIn: "Aumentar zoom",
      zoomOut: "Diminuir zoom",
      zoomReset: "Redefinir zoom e posição",
      layersTitle: "Camadas do mapa (Atlas e Satélite)",
      mapType: "Tipo de Mapa",
      layerAtlas: "Atlas",
      layerSatellite: "Satélite",
      mapDetails: "Detalhes do Mapa",
      bordersLabels: "Fronteiras e Rótulos",
      latLonGrid: "Grade Lat/Lon",
      attribAtlas: "Natural Earth 1:50m (Domínio Público)",
      attribSatellite: "Imagens: Copernicus Sentinel-2 Cloudless (EOX) · CC-BY-4.0",
      hudDefault: "Lat: — , Lon: —",
      hudOcean: "Oceano",
      hudDoubleClick: "2× clique para selecionar",
      regionsLabel: "Regiões:",
      presetSouthAmerica: "América do Sul",
      presetAmazon: "Bacia Amazônica",
      presetNorthAmerica: "América do Norte",
      presetEurope: "Europa",
      presetMediterranean: "Mediterrâneo",
      presetAfrica: "África",
      presetEastAsia: "Leste Asiático",
      presetAustraliaNZ: "Austrália e NZ",
      presetNino34: "Niño 3.4",
      presetNorthAtlantic: "Atlântico Norte",
      presetArctic: "Ártico",
      boundsHeading: "Limites e Diagnóstico da Área",
      latMin: "Lat Mín (°N)",
      latMax: "Lat Máx (°N)",
      lonMin: "Lon Mín (°E)",
      lonMax: "Lon Máx (°E)",
      eligibilityHeading: "Resumo de Elegibilidade Regional",
      globalAreaPct: "% da Área Global",
      surfaceMask: "Máscara de Superfície",
      surfaceMixed: "Mista (Terra + Oceano)",
      surfaceLand: "Somente Terra",
      surfaceOcean: "Somente Oceano",
      intersectingLabel: "Territórios incluídos: ",
      openOcean: "Oceano Aberto (águas internacionais)",
      moreCount: "+{n} outros",
      twoPathTitle: "Duas formas de obter esta área ({pct}% do globo):",
      twoPathTitleDefault: "Duas formas de obter esta área:",
      pathATitle: 'A. Recorte regional pronto <span class="rec-tag">Recomendado</span>',
      pathADesc: 'Exporte e execute o script Python do Passo 03 em sua máquina para baixar um arquivo <span class="mono">.nc</span> recortado para sua região.',
      pathBTitle: "B. Arquivos NetCDF globais / wget",
      pathBDesc: 'Os servidores oficiais da ESGF hospedam arquivos globais (<span class="mono">_glb_</span>). Baixe diretamente ou via <span class="mono">wget</span> e recorte localmente com <span class="mono">cdo sellonlatbox</span>.',
      step02Title: "Selecionar Variável e Buscar Dados",
      step02Desc: "Escolha uma variável climática e um cenário para encontrar conjuntos de dados disponíveis.",
      domainAll: "Todos os Domínios",
      domainAtmos: "Atmosfera (atmos)",
      domainOcean: "Oceano (ocean)",
      domainLand: "Superfície Terrestre (land)",
      domainSeaIce: "Gelo Marinho (seaIce)",
      domainOcnBgchem: "Biogeoquímica Oceânica (ocnBgchem)",
      expHistorical: "historical (1850–2021)",
      expEsmHist: "esm-hist (Baseado em emissões)",
      expScenVl: "scen7-vl (ScenarioMIP Muito Baixo)",
      expScenM: "scen7-m (ScenarioMIP Médio)",
      expScenH: "scen7-h (ScenarioMIP Alto)",
      expAmip: "amip (Somente atmosfera)",
      expPiControl: "piControl (Pré-industrial)",
      exp1pct: "1pctCO2 (Idealizado)",
      expAbrupt: "abrupt-4xCO2 (Idealizado)",
      gridAny: "Qualquer grid_label CMIP7",
      gridG110: "g110 (Padrão Atmosfera/Terra)",
      gridG126: "g126 (Padrão Oceano)",
      gridG108: "g108 (Vetor/vento atmosférico)",
      gridG124: "g124 (Vetor oceânico)",
      startDateTitle: "Data inicial (AAAA-MM-DD)",
      endDateTitle: "Data final (AAAA-MM-DD)",
      thVarId: "Var ID",
      thBranded: "Nome CMIP7 (Branded)",
      thDesc: "Descrição",
      thRealm: "Domínio (Máscara)",
      thFreq: "Freq.",
      thCmip6: "Legado CMIP6",
      thAreaStatus: "Status na Área",
      varDescs: {
        tas: "Temperatura do Ar Próximo à Superfície (média 2m)",
        tasmax: "Temperatura Máxima Diária do Ar (2m)",
        tasmin: "Temperatura Mínima Diária do Ar (2m)",
        pr: "Fluxo de Precipitação",
        psl: "Pressão ao Nível do Mar",
        uas: "Vento Zonal Próximo à Superfície (10m)",
        rsds: "Radiação de Ondas Curtas Incidente na Superfície",
        tos: "Temperatura da Superfície do Mar",
        zos: "Altura da Superfície do Mar Acima do Geoide",
        sos: "Salinidade da Superfície do Mar",
        mrso: "Conteúdo Total de Umidade do Solo",
        lai: "Índice de Área Foliar",
        siconc: "Percentual de Área de Gelo Marinho",
        fgco2: "Fluxo Descendente de Massa de CO2 na Superfície"
      },
      eligPolarOk: "Disponível (mar polar)",
      eligPolarNo: "Pouco/sem gelo marinho",
      eligLandOk: "Disponível (terra)",
      eligLandNo: "Sem terra na caixa",
      eligOceanOk: "Disponível (oceano)",
      eligOceanNo: "Sem oceano na caixa",
      eligOk: "Disponível",
      btnScanEsgf: "Consultar Datasets ESGF-NG",
      page50: "50 por página",
      page100: "100 por página",
      page200: "200 por página",
      pageAll: "Carregar todos",
      autoQueryLabel: "Consultar automaticamente ao mudar filtros",
      statusReady: 'Pronto para consultar <span class="mono">discovery.east.esgf.io/search</span>',
      statusQuerying: '<span class="muted">Consultando STAC ESGF-NG para <span class="mono">{branded}</span> ({exp})...</span>',
      statusZero: '<span class="warn-text">0 datasets encontrados</span> para <span class="mono">{branded}</span> em <span class="mono">{exp}</span> (tente <span class="mono">scen7-vl</span>, <span class="mono">scen7-h</span>, <span class="mono">historical</span> ou <span class="mono">esm-hist</span>).',
      statusMatched: '<span class="ok-text">{total} datasets encontrados</span> via <span class="mono">{host}</span> (exibindo {shown}).',
      statusLoadingMore: '<span class="muted">Carregando {loaded} / {total} datasets...</span>',
      statusLoadErr: '<span class="warn-text">Erro ao carregar próxima página ({msg}).</span>',
      statusStoppedErr: '<span class="warn-text">Carregamento interrompido ({msg}). Exibindo {shown}.</span>',
      statusFetchUnavail: '<span class="warn-text">Consulta direta indisponível no navegador ({msg}).</span> Use <span class="mono">scripts/cmip7_check_area.py</span> no terminal.',
      allLoaded: "Todos carregados ({n})",
      allFreqs: "Todas as freqs.",
      searchPlaceholder: "Filtrar modelo, variante, grade...",
      thModel: "Modelo (source_id)",
      thExpVar: "Experimento / Variante",
      thBrandedVar: "Variável Padronizada",
      thFreqGrid: "Freq. · Grade",
      thTimeSpan: "Período",
      thSize: "Tamanho",
      thFiles: "Arquivos",
      noMatchFilter: "Nenhum dataset carregado corresponde ao filtro atual.",
      btnHide: "Ocultar",
      btnFiles: "Arquivos",
      drawerNote: '<strong style="color:var(--fg);">Os servidores oficiais da ESGF armazenam apenas arquivos globais (<span class="mono">_glb_</span>).</strong> Para obter somente sua área (<span class="mono">{latMin}°..{latMax}°N, {lonMin}°..{lonMax}°E</span>), exporte e execute o script Python do Passo 03 em sua máquina ou recorte após o download.',
      fullGlobePill: "Globo Inteiro",
      downloadGlobalNc: "Baixar .nc Global ↗",
      cropAfterDownload: "Recortar após o download:",
      btnCopyCdo: "Copiar CDO",
      noHttpAssets: "Nenhum arquivo HTTP listado.",
      paginationSummary: "Carregados {loaded} de {total} datasets correspondentes",
      loadingText: "Carregando...",
      btnLoadNext: "Carregar Próximos {n}",
      btnLoadAllRem: "Carregar Todos os Restantes ({n})",
      cartLabel: "Carrinho de Download:",
      cartSummary: "{n} dataset(s) · {files} arquivo(s) NetCDF global(is) · {size}",
      cartSummaryZero: "0 datasets selecionados",
      btnCartPy: "Recorte Python (.py) · Somente Área ★",
      btnCartWget: "wget (.sh) · Arquivos Globais",
      btnClearCart: "Limpar Carrinho",
      step03Title: "Exportar Script de Download e Recorte Regional",
      selectionLabel: "Seleção:",
      codeTabPython: "Recorte Python ★",
      codeTabStac: "STAC API (cURL)",
      codeTabCli: "ESGpull / CDO CLI",
      codeOtherMethods: "Outros métodos",
      codeOptPyTitle: "Recorte Python ★ (Recomendado)",
      codeOptPyDesc: "Baixa e recorta apenas sua região em um arquivo .nc local. Ideal para a maioria dos pesquisadores e estudantes.",
      codeOptStacTitle: "STAC API (cURL)",
      codeOptStacDesc: "Retorna metadados JSON brutos e URLs do catálogo. Ideal para desenvolvedores e pipelines shell/jq.",
      codeOptCliTitle: "ESGpull / CDO CLI",
      codeOptCliDesc: "Comandos de terminal para download em massa e recorte com CDO. Ideal para clusters Linux/HPC e múltiplos modelos.",
      btnDownloadPy: "Baixar .py",
      btnDownloadSh: "Baixar .sh",
      btnCopy: "Copiar",
      btnCopied: "Copiado!",
      visualGuidePdf: "docs/CMIP7_Area_Explorer_Visual_Guide_PT-BR.pdf",
      visualGuideTitle: "Guia Visual do Usuário",
      visualGuideDesc: "Manual ilustrado em PDF sobre seleção de áreas, variáveis CMIP7, consultas STAC na ESGF-NG e scripts de recorte local.",
      visualGuideCta: "Abrir Guia Visual ↗",
      guide01Title: "Como Funciona o Acesso aos Dados CMIP7",
      guide01Body: `
        <li><strong style="color:var(--fg);">Busca moderna em catálogo STAC:</strong> O CMIP7 substitui os nós legados da ESGF por APIs STAC prontas para nuvem (<span class="mono">discovery.east.esgf.io</span>, <span class="mono">api.stac.esgf.ceda.ac.uk</span>).</li>
        <li><strong style="color:var(--fg);">Login institucional / GitHub (sem OpenID):</strong> Quando necessário no MetaGrid (<span class="mono">metagrid.esgf-west.org</span>), autentique-se via SSO institucional ou GitHub.</li>
        <li><strong style="color:var(--fg);">Arquivos globais + recorte local em Python:</strong> Os servidores oficiais da ESGF hospedam arquivos <span class="mono">.nc</span> globais sob licença <strong>CC-BY-4.0</strong>. Esta ferramenta gera um script <span class="mono">intake-esgf</span> + <span class="mono">xarray</span> que recorta exatamente a sua caixa e salva um arquivo NetCDF4 regional.</li>`,
      guide02Title: "Sintaxe das Variáveis Padronizadas CMIP7",
      guide02Intro: 'Em vez dos prefixos de tabela do CMIP6 como <span class="mono">day.tasmax</span>, o CMIP7 coloca a variável física raiz primeiro, seguida por sufixos estruturados:',
      guide02Body: `
        <li><span class="mono" style="color:var(--fg);">tas</span>: variável raiz (temperatura do ar; <span class="mono">pr</span> = precipitação, <span class="mono">tos</span> = temperatura da superfície do mar)</li>
        <li><span class="mono" style="color:var(--fg);">tmax / tavg</span>: estatística temporal (máxima diária vs. média temporal)</li>
        <li><span class="mono" style="color:var(--fg);">h2m</span>: coordenada vertical (altura de 2 m; <span class="mono">u</span> = superfície/sem nível)</li>
        <li><span class="mono" style="color:var(--fg);">u / sea / lnd</span>: máscara de área horizontal (global sem máscara, somente oceano ou somente terra)</li>`,
      guide03Title: "Grades e Experimentos Padronizados",
      guide03Body: `
        <li><strong style="color:var(--fg);">Rótulos de grade (<span class="mono">grid_label</span>):</strong> Códigos como <span class="mono">g110</span> (atmosfera/terra) ou <span class="mono">g126</span> (oceano) identificam definições de grade MIP-DRS7. Deixe em <strong>Qualquer</strong>, a menos que esteja comparando uma grade específica.</li>
        <li><strong style="color:var(--fg);">Experimentos principais e ScenarioMIP:</strong> Inclui <span class="mono">historical</span>, <span class="mono">esm-hist</span> (guiado por emissões), <span class="mono">piControl</span>, <span class="mono">amip</span>, simulações idealizadas de CO₂ e projeções <span class="mono">scen7-vl</span> / <span class="mono">scen7-m</span> / <span class="mono">scen7-h</span>.</li>`,
      guide04Title: "Escolhendo o Fluxo de Download",
      guide04Body: `
        <li><strong style="color:var(--fg);">Apenas recorte regional:</strong> Clique em <strong style="color:var(--fg);">Baixar .py</strong> (ou <strong style="color:var(--fg);">Copiar</strong>) em <strong style="color:var(--fg);">Recorte Python ★</strong> no Passo 03 e execute localmente em Python para salvar um arquivo <span class="mono">.nc</span> recortado.</li>
        <li><strong style="color:var(--fg);">Arquivos NetCDF globais diretos:</strong> Use <strong style="color:var(--fg);">Baixar .nc Global ↗</strong> ou <strong style="color:var(--fg);">wget (.sh)</strong> e depois recorte localmente com <span class="mono">cdo sellonlatbox,...</span>.</li>
        <li><strong style="color:var(--fg);">Fluxos avançados / HPC:</strong> Abra <strong style="color:var(--fg);">Outros métodos ▾</strong> no Passo 03 para consultas <span class="mono">STAC API (cURL)</span>, CLI <span class="mono">ESGpull</span> (<span class="mono">v0.10.0+</span>) ou <strong>Globus</strong> via <a href="https://metagrid.esgf-west.org/" target="_blank" rel="noopener noreferrer">ESGF MetaGrid</a>.</li>`,
      glossaryTitle: "Glossário",
      thAcronym: "Sigla",
      thMeaning: "Significado",
      thExplanation: "Explicação",
      glossary: [
        ["AMIP", "Projeto de Intercomparação de Modelos Atmosféricos", "Experimento climático padronizado com modelos apenas atmosféricos forçados por temperatura da superfície do mar e gelo marinho observados."],
        ["API", "Interface de Programação de Aplicações", "Interface de software estruturada que permite a scripts e aplicações web consultar catálogos ESGF-NG em tempo real."],
        ["CC-BY-4.0", "Creative Commons Atribuição 4.0 Internacional", "Licença aberta sob a qual os dados dos modelos CMIP7 são publicados, exigindo atribuição aos grupos de modelagem."],
        ["CDO", "Climate Data Operators", 'Conjunto de ferramentas de linha de comando para manipular dados climáticos em grade, usado via <span class="mono">sellonlatbox</span> para recortar arquivos NetCDF globais localmente.'],
        ["CLI", "Interface de Linha de Comando", 'Interface textual de terminal usada para executar ferramentas como <span class="mono">esgpull</span>, <span class="mono">cdo</span> e scripts Python independentes.'],
        ["CMIP7", "Projeto de Intercomparação de Modelos Acoplados — Fase 7", "Sétima fase do programa global do WCRP que coordena experimentos padronizados de modelos climáticos e divulgação de dados."],
        ["CMIP7-AFT", "CMIP7 Assessment Fast Track", "Simulações prioritárias do CMIP7 publicadas antes do acervo completo para subsidiar as próximas avaliações climáticas internacionais."],
        ["CMIP-IPO", "Escritório Internacional de Projetos do CMIP", "Escritório de coordenação internacional que apoia a governança, os padrões técnicos e a comunicação da comunidade CMIP."],
        ["CMOR", "Climate Model Output Rewriter", "Biblioteca de software e convenção de formatação tradicionalmente utilizada para padronizar variáveis e metadados de modelos climáticos."],
        ["CORS", "Compartilhamento de Recursos de Origem Cruzada", "Mecanismo de segurança do navegador habilitado pelos endpoints STAC da ESGF-NG para que esta página consulte dados diretamente."],
        ["cURL", "Client URL", "Utilitário de linha de comando para transferência de dados via HTTP/HTTPS, usado no Passo 03 para enviar consultas ao catálogo STAC."],
        ["ENSO", "El Niño–Oscilação Sul", "Principal oscilação acoplada oceano–atmosfera no Pacífico tropical, monitorada em regiões como a caixa Niño 3.4."],
        ["EOX", "EOX IT Services", "Provedor de serviços geoespaciais que hospeda o mosaico aberto de imagens de satélite Copernicus Sentinel-2 Cloudless usado no mapa."],
        ["ESA", "Agência Espacial Europeia", "Organização espacial europeia que opera os satélites Copernicus Sentinel-2 responsáveis pelas imagens da camada Satélite."],
        ["ESGF", "Earth System Grid Federation", "Infraestrutura federada global de dados que armazena e distribui as simulações climáticas do CMIP em todo o mundo."],
        ["ESGF-NG", "Earth System Grid Federation — Nova Geração", "Arquitetura modernizada da ESGF construída em torno de APIs STAC voltadas para nuvem e autenticação única federada."],
        ["ESM", "Modelo do Sistema Terrestre", 'Modelo climático abrangente usado em simulações como <span class="mono">esm-hist</span>, acoplando a física climática ao ciclo do carbono.'],
        ["HPC", "Computação de Alto Desempenho", "Clusters de supercomputação e estações institucionais usados para baixar e processar grandes conjuntos de arquivos NetCDF."],
        ["IAG/USP", "Instituto de Astronomia, Geofísica e Ciências Atmosféricas / Universidade de São Paulo", "Instituto acadêmico e universidade no Brasil onde o CMIP7 Area Explorer foi desenvolvido."],
        ["JSON", "JavaScript Object Notation", "Formato textual leve usado pelas APIs STAC para retornar metadados de datasets, extensões espaciais e links de arquivos."],
        ["MIP-DRS7", "Sintaxe de Referência de Dados MIP para o CMIP7", "Padrão oficial de metadados e nomenclatura do CMIP7 que define variáveis padronizadas, rótulos de grade, domínios e diretórios."],
        ["MIT", "Licença MIT (Massachusetts Institute of Technology)", "Licença permissiva de software livre que rege a aplicação web CMIP7 Area Explorer e seu script auxiliar."],
        ["NetCDF4", "Network Common Data Form (Versão 4)", "Formato binário científico baseado em HDF5 usado no CMIP para armazenar variáveis climáticas multidimensionais em grade."],
        ["OpenID", "Open Identity (Autenticação Legada da ESGF)", "Antigo sistema de login federado dos portais ESGF legados, substituído por SSO institucional e GitHub na ESGF-NG."],
        ["ScenarioMIP", "Projeto de Intercomparação de Modelos de Cenários", 'Atividade do CMIP que define experimentos futuros de emissões e projeções socioeconômicas como <span class="mono">scen7-vl</span>, <span class="mono">scen7-m</span> e <span class="mono">scen7-h</span>.'],
        ["SSO", "Autenticação Única (Single Sign-On)", "Autenticação moderna institucional ou via GitHub usada no ESGF MetaGrid para transferências em larga escala via Globus."],
        ["STAC", "Catálogo de Ativos Espaço-Temporais", "Especificação aberta de catálogo geoespacial que permite filtrar rapidamente datasets climáticos por área, período e propriedades do modelo."],
        ["WCRP", "Programa Mundial de Pesquisa Climática", "Órgão científico internacional que coordena o CMIP e pesquisas globais sobre variabilidade e projeções climáticas."],
        ["WGS84", "Sistema Geodésico Mundial de 1984", "Sistema padrão de referência geográfica em latitude/longitude usado para caixas delimitadoras e camadas de satélite."],
        ["Zarr", "Formato de Matrizes em Blocos Zarr", 'Formato otimizado para nuvem suportado em conjunto com NetCDF pelas bibliotecas <span class="mono">xarray</span> e <span class="mono">intake-esgf</span>.']
      ],
      faqTitle: "Perguntas Frequentes",
      btnExpandAll: "Expandir Tudo",
      btnCollapseAll: "Recolher Tudo",
      faqs: [
        [
          "01",
          "Este site recorta e baixa arquivos NetCDF diretamente no meu navegador?",
          'Os servidores oficiais da ESGF-NG distribuem arquivos NetCDF4 globais (<span class="mono">_glb_</span>) que frequentemente variam de centenas de megabytes a vários gigabytes por simulação. Em vez de carregar matrizes gigantescas na memória do navegador, o <strong>CMIP7 Area Explorer</strong> consulta catálogos STAC da ESGF-NG em tempo real e gera um script Python reprodutível (<span class="mono">intake-esgf</span> + <span class="mono">xarray</span>) ou fluxo <span class="mono">wget</span> + <span class="mono">cdo sellonlatbox</span> para recortar e salvar sua área exata em sua máquina ou ambiente HPC.'
        ],
        [
          "02",
          'Por que as variáveis do CMIP7 usam nomes como <span class="mono">tas_tavg-h2m-hxy-u</span> em vez de <span class="mono">Amon.tas</span> do CMIP6?',
          'No padrão <strong>MIP-DRS7</strong>, o CMIP7 substitui nomes opacos de tabelas CMOR por <strong>variáveis padronizadas (branded)</strong> no formato <span class="mono">&lt;raiz&gt;_&lt;temporal&gt;-&lt;vertical&gt;-&lt;horizontal&gt;-&lt;máscara&gt;</span>. Por exemplo, temperatura máxima e mínima diária a 2 m compartilham a raiz física <span class="mono">tas</span> e são diferenciadas como <span class="mono">tas_tmax-h2m-hxy-u</span> e <span class="mono">tas_tmin-h2m-hxy-u</span>. O Passo 02 exibe a nova sintaxe CMIP7 lado a lado com o equivalente legado do CMIP6.'
        ],
        [
          "03",
          'Como são tratadas longitudes <span class="mono">0°–360°</span> e áreas que cruzam o Meridiano de Greenwich (<span class="mono">0°</span>)?',
          'Modelos climáticos armazenam longitudes nativas em <span class="mono">0°..360°E</span> ou <span class="mono">-180°..180°</span>. Para evitar recortes vazios ou incompatibilidades, o script Python do Passo 03 verifica automaticamente <span class="mono">ds.lon.max() &gt; 180</span> em tempo de execução e normaliza as longitudes para <span class="mono">-180..180</span> antes de chamar <span class="mono">ds.sel(...)</span>, funcionando automaticamente mesmo em áreas que cruzam <span class="mono">0°E</span> (como Europa, Mediterrâneo ou África Ocidental).'
        ],
        [
          "04",
          'O que significam os avisos <span class="mono">⚠ Sem oceano na caixa</span> ou <span class="mono">⚠ Pouco/sem gelo marinho</span>?',
          'Ao desenhar ou mover uma caixa no mapa 1:50m, o portal verifica a interseção espacial com continentes, oceanos e zonas polares (<span class="mono">|lat| ≥ 58°</span>). Se você selecionar uma caixa inteiramente continental (por exemplo, o interior da Amazônia), variáveis com máscara oceânica (<span class="mono">-sea</span>, como <span class="mono">tos</span> ou <span class="mono">fgco2</span>) conterão apenas valores ausentes (<span class="mono">NaN</span>). Esses avisos são informativos e não impedem você de consultar qualquer variável.'
        ],
        [
          "05",
          'Por que a consulta à ESGF-NG retornou <span class="mono">0 datasets encontrados</span> para determinada combinação?',
          'As simulações do CMIP7 e do Assessment Fast Track (CMIP7-AFT) estão sendo publicadas progressivamente nos servidores STAC federados (<span class="mono">discovery.east.esgf.io</span> e <span class="mono">api.stac.esgf.ceda.ac.uk</span>). Se um cenário ou grade ainda não tiver resultados, deixe <span class="mono">grid_label</span> em <strong>Qualquer</strong>, teste experimentos centrais como <span class="mono">historical</span>, <span class="mono">esm-hist</span>, <span class="mono">piControl</span>, <span class="mono">scen7-vl</span> ou <span class="mono">scen7-h</span>, ou execute o script CLI <span class="mono">scripts/cmip7_check_area.py</span>.'
        ],
        [
          "06",
          "Preciso de uma conta ESGF OpenID ou chave de API para usar o portal ou baixar arquivos?",
          'Não é necessário cadastro nem chave de API para usar o CMIP7 Area Explorer ou baixar arquivos NetCDF públicos via HTTPS. O antigo ESGF OpenID foi descontinuado na ESGF-NG; caso utilize transferências em massa via Globus no <a href="https://metagrid.esgf-west.org/" target="_blank" rel="noopener noreferrer">ESGF MetaGrid</a>, o acesso é feito com SSO institucional ou GitHub.'
        ],
        [
          "07",
          'Como as camadas <span class="mono">Atlas</span> e <span class="mono">Satélite</span> ajudam na seleção da área?',
          'Clique no ícone de <strong>Camadas</strong> abaixo dos botões de zoom (<span class="mono">+ / − / ⟲</span>) para alternar entre o <strong>Atlas Vetorial 1:50m</strong> offline e a camada <strong>Satélite</strong> (ESA Copernicus Sentinel-2 Cloudless), além de ativar ou desativar <strong>Fronteiras e Rótulos</strong> e a <strong>Grade Lat/Lon</strong>.'
        ],
        [
          "08",
          "Quais licenças regem os dados CMIP7 e esta aplicação, e como devo citá-la?",
          'Todos os dados dos modelos CMIP7 são distribuídos sob licença <strong>Creative Commons Atribuição 4.0 (<span class="mono">CC-BY-4.0</span>)</strong>. Cite os grupos de modelagem participantes e o WCRP CMIP7 em suas publicações. O <strong>CMIP7 Area Explorer</strong> é uma ferramenta de código aberto (<a href="https://github.com/mgpcamargo/cmip7-area-explorer/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">Licença MIT</a>) desenvolvida no IAG/USP; os metadados formais de citação estão disponíveis em <a href="https://github.com/mgpcamargo/cmip7-area-explorer/blob/main/CITATION.cff" target="_blank" rel="noopener noreferrer"><span class="mono">CITATION.cff</span></a> no GitHub.'
        ]
      ],
      footerSecondary: 'Desenvolvido por <strong>Marcelo G. P. Camargo</strong> · Depto. de Ciências Atmosféricas (IAG/USP) · <a href="https://github.com/mgpcamargo/cmip7-area-explorer/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">Licença MIT</a> · Os dados dos modelos CMIP7 são licenciados sob <strong>CC-BY-4.0</strong>.'
    },

    es: {
      htmlLang: "es",
      pageTitle: "CMIP7 Area Explorer · Portal ESGF-NG",
      subtitle: "Filtra y descarga conjuntos de datos de proyecciones climáticas de última generación.",
      navExplorer: "Explorador de Áreas",
      navGuides: "Guías",
      switchToDark: "Cambiar a Modo Oscuro",
      switchToLight: "Cambiar a Modo Claro",
      step01Title: "Seleccionar Área Geográfica",
      projNE: "Natural Earth",
      projEq: "Equirrectangular",
      toolDraw: "Dibujar Caja",
      toolPan: "Desplazar",
      btnGlobal: "Global",
      btnGlobalTitle: "Seleccionar todo el globo (-90..90, -180..180)",
      zoomIn: "Acercar",
      zoomOut: "Alejar",
      zoomReset: "Restablecer zoom y vista",
      layersTitle: "Capas del mapa (Atlas y Satélite)",
      mapType: "Tipo de Mapa",
      layerAtlas: "Atlas",
      layerSatellite: "Satélite",
      mapDetails: "Detalles del Mapa",
      bordersLabels: "Fronteras y Etiquetas",
      latLonGrid: "Cuadrícula Lat/Lon",
      attribAtlas: "Natural Earth 1:50m (Dominio Público)",
      attribSatellite: "Imágenes: Copernicus Sentinel-2 Cloudless (EOX) · CC-BY-4.0",
      hudDefault: "Lat: — , Lon: —",
      hudOcean: "Océano",
      hudDoubleClick: "doble clic para seleccionar",
      regionsLabel: "Regiones:",
      presetSouthAmerica: "América del Sur",
      presetAmazon: "Cuenca Amazónica",
      presetNorthAmerica: "América del Norte",
      presetEurope: "Europa",
      presetMediterranean: "Mediterráneo",
      presetAfrica: "África",
      presetEastAsia: "Asia Oriental",
      presetAustraliaNZ: "Australia y NZ",
      presetNino34: "Niño 3.4",
      presetNorthAtlantic: "Atlántico Norte",
      presetArctic: "Ártico",
      boundsHeading: "Límites y Diagnóstico del Área",
      latMin: "Lat Mín (°N)",
      latMax: "Lat Máx (°N)",
      lonMin: "Lon Mín (°E)",
      lonMax: "Lon Máx (°E)",
      eligibilityHeading: "Resumen de Elegibilidad Regional",
      globalAreaPct: "% del Área Global",
      surfaceMask: "Máscara de Superficie",
      surfaceMixed: "Mixta (Tierra + Océano)",
      surfaceLand: "Solo Tierra",
      surfaceOcean: "Solo Océano",
      intersectingLabel: "Territorios incluidos: ",
      openOcean: "Océano Abierto (aguas internacionales)",
      moreCount: "+{n} más",
      twoPathTitle: "Dos formas de obtener esta área ({pct}% del globo):",
      twoPathTitleDefault: "Dos formas de obtener esta área:",
      pathATitle: 'A. Recorte regional listo <span class="rec-tag">Recomendado</span>',
      pathADesc: 'Exporta y ejecuta el script Python del Paso 03 en tu equipo para descargar un archivo <span class="mono">.nc</span> recortado para tu región.',
      pathBTitle: "B. Archivos NetCDF globales / wget",
      pathBDesc: 'Los servidores oficiales de ESGF alojan archivos globales (<span class="mono">_glb_</span>). Descárgalos directamente o mediante <span class="mono">wget</span> y recórtalos localmente con <span class="mono">cdo sellonlatbox</span>.',
      step02Title: "Seleccionar Variable y Buscar Datos",
      step02Desc: "Elige una variable climática y un escenario para encontrar conjuntos de datos disponibles.",
      domainAll: "Todos los Dominios",
      domainAtmos: "Atmósfera (atmos)",
      domainOcean: "Océano (ocean)",
      domainLand: "Superficie Terrestre (land)",
      domainSeaIce: "Hielo Marino (seaIce)",
      domainOcnBgchem: "Biogeoquímica Oceánica (ocnBgchem)",
      expHistorical: "historical (1850–2021)",
      expEsmHist: "esm-hist (Basado en emisiones)",
      expScenVl: "scen7-vl (ScenarioMIP Muy Bajo)",
      expScenM: "scen7-m (ScenarioMIP Medio)",
      expScenH: "scen7-h (ScenarioMIP Alto)",
      expAmip: "amip (Solo atmósfera)",
      expPiControl: "piControl (Preindustrial)",
      exp1pct: "1pctCO2 (Idealizado)",
      expAbrupt: "abrupt-4xCO2 (Idealizado)",
      gridAny: "Cualquier grid_label CMIP7",
      gridG110: "g110 (Estándar Atmósfera/Tierra)",
      gridG126: "g126 (Estándar Océano)",
      gridG108: "g108 (Vector/viento atmosférico)",
      gridG124: "g124 (Vector oceánico)",
      startDateTitle: "Fecha inicial (AAAA-MM-DD)",
      endDateTitle: "Fecha final (AAAA-MM-DD)",
      thVarId: "Var ID",
      thBranded: "Nombre CMIP7 (Branded)",
      thDesc: "Descripción",
      thRealm: "Dominio (Máscara)",
      thFreq: "Frec.",
      thCmip6: "Legado CMIP6",
      thAreaStatus: "Estado en el Área",
      varDescs: {
        tas: "Temperatura del Aire Cerca de la Superficie (media 2m)",
        tasmax: "Temperatura Máxima Diaria del Aire (2m)",
        tasmin: "Temperatura Mínima Diaria del Aire (2m)",
        pr: "Flujo de Precipitación",
        psl: "Presión al Nivel del Mar",
        uas: "Viento Zonal Cerca de la Superficie (10m)",
        rsds: "Radiación de Onda Corta Descendente en Superficie",
        tos: "Temperatura Superficial del Mar",
        zos: "Altura de la Superficie del Mar Sobre el Geoide",
        sos: "Salinidad Superficial del Mar",
        mrso: "Contenido Total de Humedad del Suelo",
        lai: "Índice de Área Foliar",
        siconc: "Porcentaje de Área de Hielo Marino",
        fgco2: "Flujo Descendente de Masa de CO2 en Superficie"
      },
      eligPolarOk: "Disponible (mar polar)",
      eligPolarNo: "Poco/sin hielo marino",
      eligLandOk: "Disponible (tierra)",
      eligLandNo: "Sin tierra en la caja",
      eligOceanOk: "Disponible (océano)",
      eligOceanNo: "Sin océano en la caja",
      eligOk: "Disponible",
      btnScanEsgf: "Consultar Datasets ESGF-NG",
      page50: "50 por página",
      page100: "100 por página",
      page200: "200 por página",
      pageAll: "Cargar todos",
      autoQueryLabel: "Consultar automáticamente al cambiar filtros",
      statusReady: 'Listo para consultar <span class="mono">discovery.east.esgf.io/search</span>',
      statusQuerying: '<span class="muted">Consultando STAC ESGF-NG para <span class="mono">{branded}</span> ({exp})...</span>',
      statusZero: '<span class="warn-text">0 datasets encontrados</span> para <span class="mono">{branded}</span> en <span class="mono">{exp}</span> (prueba <span class="mono">scen7-vl</span>, <span class="mono">scen7-h</span>, <span class="mono">historical</span> o <span class="mono">esm-hist</span>).',
      statusMatched: '<span class="ok-text">{total} datasets encontrados</span> vía <span class="mono">{host}</span> (mostrando {shown}).',
      statusLoadingMore: '<span class="muted">Cargando {loaded} / {total} datasets...</span>',
      statusLoadErr: '<span class="warn-text">Error al cargar la siguiente página ({msg}).</span>',
      statusStoppedErr: '<span class="warn-text">Carga detenida ({msg}). Mostrando {shown}.</span>',
      statusFetchUnavail: '<span class="warn-text">Consulta directa no disponible en el navegador ({msg}).</span> Usa <span class="mono">scripts/cmip7_check_area.py</span> en tu terminal.',
      allLoaded: "Todos cargados ({n})",
      allFreqs: "Todas las frecs.",
      searchPlaceholder: "Filtrar modelo, variante, grilla...",
      thModel: "Modelo (source_id)",
      thExpVar: "Experimento / Variante",
      thBrandedVar: "Variable Estandarizada",
      thFreqGrid: "Frec. · Grilla",
      thTimeSpan: "Período",
      thSize: "Tamaño",
      thFiles: "Archivos",
      noMatchFilter: "Ningún dataset cargado coincide con el filtro actual.",
      btnHide: "Ocultar",
      btnFiles: "Archivos",
      drawerNote: '<strong style="color:var(--fg);">Los servidores oficiales de ESGF solo almacenan archivos globales (<span class="mono">_glb_</span>).</strong> Para obtener únicamente tu área (<span class="mono">{latMin}°..{latMax}°N, {lonMin}°..{lonMax}°E</span>), exporta y ejecuta el script Python del Paso 03 en tu equipo, o recorta los archivos tras descargarlos.',
      fullGlobePill: "Globo Completo",
      downloadGlobalNc: "Descargar .nc Global ↗",
      cropAfterDownload: "Recortar tras descargar:",
      btnCopyCdo: "Copiar CDO",
      noHttpAssets: "No se listan archivos HTTP.",
      paginationSummary: "Cargados {loaded} de {total} datasets coincidentes",
      loadingText: "Cargando...",
      btnLoadNext: "Cargar Siguientes {n}",
      btnLoadAllRem: "Cargar Todos los Restantes ({n})",
      cartLabel: "Carrito de Descarga:",
      cartSummary: "{n} dataset(s) · {files} archivo(s) NetCDF global(es) · {size}",
      cartSummaryZero: "0 datasets seleccionados",
      btnCartPy: "Recorte Python (.py) · Solo Área ★",
      btnCartWget: "wget (.sh) · Archivos Globales",
      btnClearCart: "Vaciar Carrito",
      step03Title: "Exportar Script de Descarga y Recorte Regional",
      selectionLabel: "Selección:",
      codeTabPython: "Recorte Python ★",
      codeTabStac: "STAC API (cURL)",
      codeTabCli: "ESGpull / CDO CLI",
      codeOtherMethods: "Otros métodos",
      codeOptPyTitle: "Recorte Python ★ (Recomendado)",
      codeOptPyDesc: "Descarga y recorta solo tu región en un archivo .nc local. Ideal para la mayoría de investigadores y estudiantes.",
      codeOptStacTitle: "STAC API (cURL)",
      codeOptStacDesc: "Obtiene metadatos JSON sin procesar y URLs del catálogo. Ideal para desarrolladores y pipelines shell/jq.",
      codeOptCliTitle: "ESGpull / CDO CLI",
      codeOptCliDesc: "Comandos de terminal para descarga masiva y recorte con CDO. Ideal para clústeres Linux/HPC y múltiples modelos.",
      btnDownloadPy: "Descargar .py",
      btnDownloadSh: "Descargar .sh",
      btnCopy: "Copiar",
      btnCopied: "¡Copiado!",
      visualGuidePdf: "docs/CMIP7_Area_Explorer_Visual_Guide_ES.pdf",
      visualGuideTitle: "Guía Visual del Usuario",
      visualGuideDesc: "Manual ilustrado en PDF sobre selección de áreas, variables CMIP7, consultas STAC en ESGF-NG y scripts de recorte local.",
      visualGuideCta: "Abrir Guía Visual ↗",
      guide01Title: "Cómo Funciona el Acceso a Datos CMIP7",
      guide01Body: `
        <li><strong style="color:var(--fg);">Búsqueda moderna en catálogo STAC:</strong> CMIP7 reemplaza los nodos heredados de ESGF por APIs STAC preparadas para la nube (<span class="mono">discovery.east.esgf.io</span>, <span class="mono">api.stac.esgf.ceda.ac.uk</span>).</li>
        <li><strong style="color:var(--fg);">Inicio de sesión institucional / GitHub (sin OpenID):</strong> Cuando sea necesario en MetaGrid (<span class="mono">metagrid.esgf-west.org</span>), autentícate mediante SSO institucional o GitHub.</li>
        <li><strong style="color:var(--fg);">Archivos globales + recorte local en Python:</strong> Los servidores oficiales de ESGF alojan archivos <span class="mono">.nc</span> globales bajo licencia <strong>CC-BY-4.0</strong>. Esta herramienta genera un script <span class="mono">intake-esgf</span> + <span class="mono">xarray</span> que recorta tu caja exacta y guarda un archivo NetCDF4 regional.</li>`,
      guide02Title: "Sintaxis de Variables Estandarizadas CMIP7",
      guide02Intro: 'En lugar de los prefijos de tabla de CMIP6 como <span class="mono">day.tasmax</span>, CMIP7 coloca primero la variable física raíz seguida de sufijos estructurados:',
      guide02Body: `
        <li><span class="mono" style="color:var(--fg);">tas</span>: variable raíz (temperatura del aire; <span class="mono">pr</span> = precipitación, <span class="mono">tos</span> = temperatura superficial del mar)</li>
        <li><span class="mono" style="color:var(--fg);">tmax / tavg</span>: estadística temporal (máxima diaria vs. promedio temporal)</li>
        <li><span class="mono" style="color:var(--fg);">h2m</span>: coordenada vertical (altura de 2 m; <span class="mono">u</span> = superficie/sin nivel)</li>
        <li><span class="mono" style="color:var(--fg);">u / sea / lnd</span>: máscara de área horizontal (global sin máscara, solo océano o solo tierra)</li>`,
      guide03Title: "Grillas y Experimentos Estandarizados",
      guide03Body: `
        <li><strong style="color:var(--fg);">Etiquetas de grilla (<span class="mono">grid_label</span>):</strong> Códigos como <span class="mono">g110</span> (atmósfera/tierra) o <span class="mono">g126</span> (océano) identifican definiciones de grilla MIP-DRS7. Déjalo en <strong>Cualquier</strong> salvo que compares una grilla específica.</li>
        <li><strong style="color:var(--fg);">Experimentos principales y ScenarioMIP:</strong> Incluye <span class="mono">historical</span>, <span class="mono">esm-hist</span> (impulsado por emisiones), <span class="mono">piControl</span>, <span class="mono">amip</span>, simulaciones idealizadas de CO₂ y proyecciones <span class="mono">scen7-vl</span> / <span class="mono">scen7-m</span> / <span class="mono">scen7-h</span>.</li>`,
      guide04Title: "Cómo Elegir un Flujo de Descarga",
      guide04Body: `
        <li><strong style="color:var(--fg);">Solo recorte regional:</strong> Haz clic en <strong style="color:var(--fg);">Descargar .py</strong> (o <strong style="color:var(--fg);">Copiar</strong>) en <strong style="color:var(--fg);">Recorte Python ★</strong> en el Paso 03 y ejecútalo localmente en Python para guardar un archivo <span class="mono">.nc</span> recortado.</li>
        <li><strong style="color:var(--fg);">Archivos NetCDF globales directos:</strong> Usa <strong style="color:var(--fg);">Descargar .nc Global ↗</strong> o <strong style="color:var(--fg);">wget (.sh)</strong> y luego recorta localmente con <span class="mono">cdo sellonlatbox,...</span>.</li>
        <li><strong style="color:var(--fg);">Flujos avanzados / HPC:</strong> Abre <strong style="color:var(--fg);">Otros métodos ▾</strong> en el Paso 03 para consultas <span class="mono">STAC API (cURL)</span>, CLI <span class="mono">ESGpull</span> (<span class="mono">v0.10.0+</span>) o <strong>Globus</strong> mediante <a href="https://metagrid.esgf-west.org/" target="_blank" rel="noopener noreferrer">ESGF MetaGrid</a>.</li>`,
      glossaryTitle: "Glosario",
      thAcronym: "Sigla",
      thMeaning: "Significado",
      thExplanation: "Explicación",
      glossary: [
        ["AMIP", "Proyecto de Intercomparación de Modelos Atmosféricos", "Experimento climático estandarizado con modelos solo atmosféricos forzados por temperatura superficial del mar y hielo marino observados."],
        ["API", "Interfaz de Programación de Aplicaciones", "Interfaz de software estructurada que permite a scripts y aplicaciones web consultar catálogos ESGF-NG en tiempo real."],
        ["CC-BY-4.0", "Creative Commons Atribución 4.0 Internacional", "Licencia abierta bajo la cual se publican los datos de los modelos CMIP7, requiriendo atribución a los grupos de modelado."],
        ["CDO", "Climate Data Operators", 'Herramienta de línea de comandos para manipular archivos climáticos en grilla, usada con <span class="mono">sellonlatbox</span> para recortar archivos NetCDF globales localmente.'],
        ["CLI", "Interfaz de Línea de Comandos", 'Interfaz de terminal basada en texto usada para ejecutar herramientas como <span class="mono">esgpull</span>, <span class="mono">cdo</span> y scripts independientes de Python.'],
        ["CMIP7", "Proyecto de Intercomparación de Modelos Acoplados — Fase 7", "Séptima fase del programa global del WCRP que coordina experimentos estandarizados de modelos climáticos y publicación de datos."],
        ["CMIP7-AFT", "CMIP7 Assessment Fast Track", "Simulaciones prioritarias de CMIP7 publicadas antes del archivo completo para respaldar las próximas evaluaciones climáticas internacionales."],
        ["CMIP-IPO", "Oficina Internacional de Proyectos del CMIP", "Oficina de coordinación internacional que apoya la gobernanza, los estándares técnicos y la difusión de la comunidad CMIP."],
        ["CMOR", "Climate Model Output Rewriter", "Biblioteca de software y convención de formato tradicionalmente empleada para estructurar variables y metadatos de modelos climáticos."],
        ["CORS", "Intercambio de Recursos de Origen Cruzado", "Mecanismo de seguridad del navegador habilitado por los endpoints STAC de ESGF-NG para que esta página consulte datos directamente."],
        ["cURL", "Client URL", "Utilidad de línea de comandos para transferir datos por HTTP/HTTPS, utilizada en el Paso 03 para enviar búsquedas al catálogo STAC."],
        ["ENSO", "El Niño–Oscilación del Sur", "Principal oscilación acoplada océano–atmósfera del Pacífico tropical, monitoreada en regiones como la caja Niño 3.4."],
        ["EOX", "EOX IT Services", "Proveedor de servicios geoespaciales que aloja el mosaico abierto de imágenes satelitales Copernicus Sentinel-2 Cloudless usado en el visor."],
        ["ESA", "Agencia Espacial Europea", "Organización espacial europea que opera los satélites Copernicus Sentinel-2 que capturan las imágenes de la capa Satélite."],
        ["ESGF", "Earth System Grid Federation", "Infraestructura federada global que almacena y distribuye las simulaciones climáticas de CMIP en todo el mundo."],
        ["ESGF-NG", "Earth System Grid Federation — Nueva Generación", "Arquitectura modernizada de ESGF basada en APIs de búsqueda STAC preparadas para la nube e inicio de sesión único federado."],
        ["ESM", "Modelo del Sistema Terrestre", 'Modelo climático integral usado en simulaciones como <span class="mono">esm-hist</span>, acoplando interactivamente la física con el ciclo del carbono.'],
        ["HPC", "Computación de Alto Rendimiento", "Clústeres de supercomputación y estaciones institucionales utilizados para descargar y procesar ensambles NetCDF multimodelo."],
        ["IAG/USP", "Instituto de Astronomía, Geofísica y Ciencias Atmosféricas / Universidad de São Paulo", "Instituto académico y universidad en Brasil donde se creó CMIP7 Area Explorer."],
        ["JSON", "JavaScript Object Notation", "Formato de texto ligero usado por las APIs STAC para devolver metadatos de datasets, extensiones espaciales y URLs de archivos."],
        ["MIP-DRS7", "Sintaxis de Referencia de Datos MIP para CMIP7", "Estándar oficial de metadados y nomenclatura de CMIP7 que define variables estandarizadas, etiquetas de grilla, dominios y directorios."],
        ["MIT", "Licencia MIT (Massachusetts Institute of Technology)", "Licencia permisiva de software libre que rige la aplicación web CMIP7 Area Explorer y su script complementario."],
        ["NetCDF4", "Network Common Data Form (Versión 4)", "Formato binario científico basado en HDF5 utilizado en CMIP para almacenar variables climáticas multidimensionales en grilla."],
        ["OpenID", "Open Identity (Autenticación Heredada de ESGF)", "Antiguo sistema federado de inicio de sesión de los portales ESGF heredados, sustituido por SSO institucional y GitHub en ESGF-NG."],
        ["ScenarioMIP", "Proyecto de Intercomparación de Modelos de Escenarios", 'Actividad de CMIP que define experimentos futuros de emisiones y proyecciones socioeconómicas como <span class="mono">scen7-vl</span>, <span class="mono">scen7-m</span> y <span class="mono">scen7-h</span>.'],
        ["SSO", "Inicio de Sesión Único (Single Sign-On)", "Autenticación moderna institucional o mediante GitHub usada en ESGF MetaGrid al transferir grandes ensambles vía Globus."],
        ["STAC", "Catálogo de Activos Espacio-Temporales", "Especificación abierta de catálogo geoespacial que permite filtrar rápidamente datasets climáticos por área, período y propiedades del modelo."],
        ["WCRP", "Programa Mundial de Investigaciones Climáticas", "Organismo científico internacional que coordina CMIP y la investigación global sobre variabilidad y proyecciones climáticas."],
        ["WGS84", "Sistema Geodésico Mundial 1984", "Sistema estándar de referencia geográfica en latitud/longitud empleado para cajas delimitadoras y capas satelitales."],
        ["Zarr", "Formato de Matrices en Bloques Zarr", 'Formato optimizado para la nube compatible junto con NetCDF en <span class="mono">xarray</span> e <span class="mono">intake-esgf</span>.']
      ],
      faqTitle: "Preguntas Frecuentes",
      btnExpandAll: "Expandir Todo",
      btnCollapseAll: "Contraer Todo",
      faqs: [
        [
          "01",
          "¿Este sitio recorta y descarga archivos NetCDF directamente dentro de mi navegador?",
          'Los servidores oficiales de ESGF-NG distribuyen archivos NetCDF4 globales (<span class="mono">_glb_</span>) que suelen ocupar desde cientos de megabytes hasta varios gigabytes por simulación. En lugar de cargar matrices gigantes en la memoria del navegador, <strong>CMIP7 Area Explorer</strong> consulta catálogos STAC de ESGF-NG en tiempo real y genera un script Python reproducible (<span class="mono">intake-esgf</span> + <span class="mono">xarray</span>) o flujo <span class="mono">wget</span> + <span class="mono">cdo sellonlatbox</span> que recorta y guarda tu área exacta en tu equipo o entorno HPC.'
        ],
        [
          "02",
          '¿Por qué las variables de CMIP7 tienen nombres como <span class="mono">tas_tavg-h2m-hxy-u</span> en lugar de <span class="mono">Amon.tas</span> de CMIP6?',
          'Bajo el estándar <strong>MIP-DRS7</strong>, CMIP7 reemplaza los nombres opacos de tablas CMOR por <strong>variables estandarizadas (branded)</strong> con el formato <span class="mono">&lt;raíz&gt;_&lt;temporal&gt;-&lt;vertical&gt;-&lt;horizontal&gt;-&lt;máscara&gt;</span>. Por ejemplo, las temperaturas máxima y mínima diarias a 2 m comparten la raíz física <span class="mono">tas</span> y se distinguen como <span class="mono">tas_tmax-h2m-hxy-u</span> y <span class="mono">tas_tmin-h2m-hxy-u</span>. El Paso 02 muestra la nueva sintaxis CMIP7 junto con su equivalente heredado de CMIP6.'
        ],
        [
          "03",
          '¿Cómo se manejan las longitudes <span class="mono">0°–360°</span> y las áreas que cruzan el Meridiano de Greenwich (<span class="mono">0°</span>)?',
          'Los modelos climáticos almacenan longitudes nativas en <span class="mono">0°..360°E</span> o <span class="mono">-180°..180°</span>. Para evitar recortes vacíos o desajustes, el script Python del Paso 03 comprueba automáticamente <span class="mono">ds.lon.max() &gt; 180</span> en tiempo de ejecución y normaliza las longitudes a <span class="mono">-180..180</span> antes de llamar a <span class="mono">ds.sel(...)</span>, funcionando sin ajustes manuales incluso en áreas que cruzan <span class="mono">0°E</span> (como Europa, el Mediterráneo o África Occidental).'
        ],
        [
          "04",
          '¿Qué significan los avisos <span class="mono">⚠ Sin océano en la caja</span> o <span class="mono">⚠ Poco/sin hielo marino</span>?',
          'Al dibujar o mover una caja en el mapa 1:50m, el portal evalúa la intersección espacial con polígonos terrestres, océanos y zonas polares (<span class="mono">|lat| ≥ 58°</span>). Si seleccionas una caja continental interior (por ejemplo, la Amazonia central), las variables con máscara oceánica (<span class="mono">-sea</span>, como <span class="mono">tos</span> o <span class="mono">fgco2</span>) solo contendrán valores faltantes (<span class="mono">NaN</span>). Estos avisos son diagnósticos orientativos y aún puedes consultar cualquier variable.'
        ],
        [
          "05",
          '¿Por qué una consulta a ESGF-NG devolvió <span class="mono">0 datasets encontrados</span> para una combinación específica?',
          'Las simulaciones de CMIP7 y Assessment Fast Track (CMIP7-AFT) se publican progresivamente en los servidores STAC federados (<span class="mono">discovery.east.esgf.io</span> y <span class="mono">api.stac.esgf.ceda.ac.uk</span>). Si un escenario o etiqueta de grilla aún no tiene resultados, deja <span class="mono">grid_label</span> en <strong>Cualquier</strong>, prueba experimentos centrales como <span class="mono">historical</span>, <span class="mono">esm-hist</span>, <span class="mono">piControl</span>, <span class="mono">scen7-vl</span> o <span class="mono">scen7-h</span>, o ejecuta el script CLI <span class="mono">scripts/cmip7_check_area.py</span>.'
        ],
        [
          "06",
          "¿Necesito una cuenta ESGF OpenID o clave API para usar este portal o descargar archivos?",
          'No se requiere clave API ni inicio de sesión para usar CMIP7 Area Explorer ni para descargar archivos NetCDF públicos por HTTPS. El antiguo ESGF OpenID fue retirado en ESGF-NG; si más adelante utilizas transferencias masivas como Globus en <a href="https://metagrid.esgf-west.org/" target="_blank" rel="noopener noreferrer">ESGF MetaGrid</a>, el acceso utiliza SSO institucional o GitHub.'
        ],
        [
          "07",
          '¿Cómo ayudan las vistas de mapa <span class="mono">Atlas</span> y <span class="mono">Satélite</span> en la selección de áreas?',
          'Haz clic en el icono de <strong>Capas</strong> debajo de los botones de zoom (<span class="mono">+ / − / ⟲</span>) para alternar entre el <strong>Atlas Vectorial 1:50m</strong> sin conexión y la vista <strong>Satélite</strong> (ESA Copernicus Sentinel-2 Cloudless), y activar o desactivar <strong>Fronteras y Etiquetas</strong> o la <strong>Cuadrícula Lat/Lon</strong>.'
        ],
        [
          "08",
          "¿Qué licencias rigen los datos CMIP7 y esta aplicación web, y cómo debo citarla?",
          'Todos los resultados de los modelos CMIP7 se publican bajo <strong>Creative Commons Atribución 4.0 (<span class="mono">CC-BY-4.0</span>)</strong>. Cita siempre a los grupos de modelado participantes y a WCRP CMIP7 en tus publicaciones. <strong>CMIP7 Area Explorer</strong> es una herramienta de código abierto (<a href="https://github.com/mgpcamargo/cmip7-area-explorer/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">Licencia MIT</a>) desarrollada en IAG/USP; los metadatos formales de citación están disponibles en <a href="https://github.com/mgpcamargo/cmip7-area-explorer/blob/main/CITATION.cff" target="_blank" rel="noopener noreferrer"><span class="mono">CITATION.cff</span></a> en GitHub.'
        ]
      ],
      footerSecondary: 'Desarrollado por <strong>Marcelo G. P. Camargo</strong> · Depto. de Ciencias Atmosféricas (IAG/USP) · <a href="https://github.com/mgpcamargo/cmip7-area-explorer/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">Licencia MIT</a> · Los datos de modelos CMIP7 tienen licencia <strong>CC-BY-4.0</strong>.'
    }
  };

  function normalizeLang(raw) {
    const v = String(raw || "").trim().toLowerCase();
    if (v === "pt" || v === "pt-br" || v === "pt_br") return "pt";
    if (v === "es" || v === "es-es" || v === "es-la" || v === "es-419") return "es";
    return "en";
  }

  function detectInitialLang() {
    if (typeof location !== "undefined") {
      const q = new URLSearchParams(location.search || "").get("lang");
      if (q) return normalizeLang(q);
      const rawHash = (location.hash || "").replace(/^#/, "");
      const h = new URLSearchParams(rawHash).get("lang");
      if (h) return normalizeLang(h);
    }
    try { localStorage.removeItem("cmip7_lang"); } catch (_) {}
    return "en";
  }

  let currentLang = detectInitialLang();

  function t(key, vars) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    let val = dict[key];
    if (val === undefined) val = TRANSLATIONS.en[key];
    if (typeof val !== "string") return val;
    if (!vars) return val;
    return val.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : ""));
  }

  function translateRegionName(name) {
    const entry = PRESET_NAMES[name];
    if (!entry) return name;
    return entry[currentLang] || entry.en;
  }

  function translateVarDesc(rowKey, fallback) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return (dict.varDescs && dict.varDescs[rowKey]) || fallback;
  }

  function applyDomTranslations() {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    document.documentElement.lang = dict.htmlLang || "en";
    document.title = dict.pageTitle;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (typeof val === "string") el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      const key = el.getAttribute("data-i18n-html");
      const val = t(key);
      if (typeof val === "string") el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      const val = t(key);
      if (typeof val === "string") {
        el.title = val;
        if (el.hasAttribute("aria-label")) el.setAttribute("aria-label", val);
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = t(key);
      if (typeof val === "string") el.placeholder = val;
    });

    const vgLink = document.getElementById("visual-guide-link");
    if (vgLink) vgLink.setAttribute("href", dict.visualGuidePdf);

    // Render Glossary table rows
    const glossaryBody = document.getElementById("glossary-tbody");
    if (glossaryBody && Array.isArray(dict.glossary)) {
      glossaryBody.innerHTML = dict.glossary.map(([acro, meaning, expl]) => `
        <tr>
          <td class="mono glossary-acronym">${acro}</td>
          <td class="glossary-meaning">${meaning}</td>
          <td class="muted">${expl}</td>
        </tr>
      `).join("");
    }

    // Render FAQ items (preserving collapsed state on language switch)
    const faqList = document.getElementById("faq-list");
    if (faqList && Array.isArray(dict.faqs)) {
      const openStates = Array.from(faqList.querySelectorAll("details.faq-item")).map(d => d.open);
      faqList.innerHTML = dict.faqs.map(([num, q, a], idx) => `
        <details class="faq-item"${openStates[idx] ? " open" : ""}>
          <summary><span class="faq-num mono">${num}</span> ${q}</summary>
          <div class="faq-body muted">${a}</div>
        </details>
      `).join("");
    }

    // Update discrete language switcher active states
    ["en", "pt", "es"].forEach(code => {
      const btn = document.getElementById("lang-btn-" + code);
      if (btn) {
        btn.classList.toggle("active", code === currentLang);
        btn.setAttribute("aria-pressed", code === currentLang ? "true" : "false");
      }
    });
  }

  function setLanguage(lang, persist) {
    const next = normalizeLang(lang);
    currentLang = next;
    if (persist !== false) {
      try {
        const url = new URL(window.location.href);
        if (next === "en") url.searchParams.delete("lang");
        else url.searchParams.set("lang", next);
        window.history.replaceState({}, "", url.toString());
      } catch (_) {}
    }
    applyDomTranslations();
    if (typeof window.__onLanguageChanged === "function") {
      window.__onLanguageChanged(next);
    }
  }

  window.CMIP7_I18N = {
    getLang: () => currentLang,
    setLanguage,
    t,
    translateRegionName,
    translateVarDesc,
    applyDomTranslations
  };

  window.setLanguage = (lang) => setLanguage(lang, true);
})();
