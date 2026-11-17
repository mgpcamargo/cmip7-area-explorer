# CMIP7 Area Explorer & ESGF-NG Web Portal

Live Web App (GitHub Pages): **https://mgpcamargo.github.io/cmip7-area-explorer/**

Interactive cartographic web application and CLI helper to select a geographic bounding box, inspect eligible **CMIP7** branded variables and realms for that region, browse live **ESGF-NG STAC** datasets and NetCDF assets, and export ready-to-run download scripts.

## Features

- **Natural Earth 110m Vector Atlas** (`data/world-110m.js`):
  - Toggle between **Natural Earth** and **Equirectangular** projections.
  - Drag to draw a bounding box, drag inside to move it, drag any of the 8 corner/edge handles to resize, and scroll/click to zoom & pan (with country labels at zoom `>= 1.8x`).
  - Hover over any country to highlight its borders and view live coordinates.
- **Area-Aware Eligibility Diagnostics**:
  - Calculates spherical global area fraction, detects **Land / Ocean / Polar** coverage, and lists intersecting countries.
  - Flags CMIP7 realms (`atmos`, `land`, `ocean`, `ocnBgchem`, `seaIce`) and branded variables (`tas_tavg-h2m-hxy-u`, `tas_tmax-h2m-hxy-u`, `pr_tavg-u-hxy-u`, `tos_tavg-u-hxy-sea`, `mrso_tavg-u-hxy-lnd`, etc.) compatible with your region.
- **Live ESGF-NG STAC Dataset Explorer & Download Cart**:
  - Directly queries `https://discovery.east.esgf.io/search` (with fallback to `https://api.stac.esgf.ceda.ac.uk/search`) for real CMIP7 `MIP-DRS7` holdings.
  - Inspect available models (`source_id`), variants, grids, time spans, and direct HTTPS `.nc` file links.
  - Add datasets to the **Download Cart** and export `download_cmip7.sh` (`wget`) or `subset_cmip7.py` (`intake-esgf` + `xarray`) directly from the browser.
- **Shareable URL State**:
  - Bounding box, variable, experiment, grid, and projection sync to the URL hash (`Share Link`).

## Local Usage

### Web App

Serve locally with Python (or open `index.html` directly):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

### Python Area Checker CLI (Standard Library Only)

```bash
python3 scripts/cmip7_check_area.py \
  --bbox -82 -56 -34 13 \
  --experiment scen7-vl \
  --variable tas \
  --branded tas_tavg-h2m-hxy-u
```

## CMIP7 References

- [WCRP CMIP7 Guidance](https://wcrp-cmip.github.io/cmip7-guidance/)
- [ESGF MetaGrid Portal](https://metagrid.esgf-west.org/)
- Natural Earth 110m vector boundaries (public domain)
