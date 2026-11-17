# CMIP7 Area Explorer & Download Guide

Interactive cartographic tool and CLI helper to select a geographic bounding box, inspect eligible **CMIP7** branded variables and realms for that region, query live **ESGF-NG STAC** availability, and generate ready-to-run download scripts.

## Features

- **Natural Earth 110m Vector Atlas** (`data/world-110m.js`):
  - Toggle between **Natural Earth** and **Equirectangular** projections.
  - Drag to draw a bounding box, drag inside to move it, drag any of the 8 corner/edge handles to resize, and scroll/click to zoom & pan.
  - Hover over any country to highlight its borders and view live coordinates.
- **Area-Aware Eligibility Diagnostics**:
  - Calculates spherical global area fraction, detects **Land / Ocean / Polar** coverage, and lists intersecting countries.
  - Flags CMIP7 realms (`atmos`, `land`, `ocean`, `ocnBgchem`, `seaIce`) and branded variables (`tas_tavg-h2m-hxy-u`, `tas_tmax-h2m-hxy-u`, `pr_tavg-u-hxy-u`, `tos_tavg-u-hxy-sea`, `mrso_tavg-u-hxy-lnd`, etc.) compatible with your region.
- **Live ESGF-NG STAC Checker**:
  - Directly queries `https://discovery.east.esgf.io/search` (via browser `fetch` or `scripts/cmip7_check_area.py`) for real CMIP7 `MIP-DRS7` holdings.
- **Dynamic Download Code Generator**:
  - **Python (`intake-esgf` + `xarray`)** with `-180..180` / `0..360` longitude handling and NetCDF4 subset export.
  - **ESGF-NG STAC API (`curl` + `jq`)** using `cmip7:*` CQL2 queryables.
  - **ESGpull / MetaGrid / Globus** CLI and portal workflows.

## Quick Start

### 1. Web UI (Zero Build Step)

Open `index.html` directly in your browser or serve locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

### 2. Python Area Checker CLI (Standard Library Only)

```bash
python3 scripts/cmip7_check_area.py \
  --bbox -82 -56 -34 13 \
  --experiment scen7-vl \
  --variable tas \
  --branded tas_tavg-h2m-hxy-u
```

Print a ready-to-run `intake-esgf` + `xarray` script for a bounding box:

```bash
python3 scripts/cmip7_check_area.py \
  --bbox -12 35 40 71 \
  --experiment historical \
  --variable pr \
  --print-python
```

## CMIP7 References

- [WCRP CMIP7 Guidance](https://wcrp-cmip.github.io/cmip7-guidance/)
- [ESGF MetaGrid Portal](https://metagrid.esgf-west.org/)
- Natural Earth 110m vector boundaries (public domain)
