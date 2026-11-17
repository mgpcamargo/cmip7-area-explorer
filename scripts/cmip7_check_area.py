#!/usr/bin/env python3
"""CMIP7 Area Checker & Regional Subset Downloader.

Queries the live ESGF-NG STAC API (discovery.east.esgf.io by default) for CMIP7
datasets intersecting a geographic bounding box, prints available models, grids,
and branded variables, and optionally generates or runs an intake-esgf + xarray
regional subset download.
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from typing import Any

DEFAULT_STAC_URL = "https://discovery.east.esgf.io/search"


def query_stac(
    stac_url: str,
    bbox: list[float],
    experiment: str | None = None,
    variable: str | None = None,
    branded_variable: str | None = None,
    frequency: str | None = None,
    limit: int = 25,
) -> dict[str, Any]:
    """Query ESGF-NG STAC API for CMIP7 items intersecting bbox."""
    clauses: list[dict[str, Any]] = [
        {"op": "=", "args": [{"property": "latest"}, "true"]}
    ]
    if experiment:
        clauses.append({"op": "=", "args": [{"property": "cmip7:experiment_id"}, experiment]})
    if variable:
        clauses.append({"op": "=", "args": [{"property": "cmip7:variable_id"}, variable]})
    if branded_variable:
        clauses.append({"op": "=", "args": [{"property": "cmip7:variable_branded_name"}, branded_variable]})
    if frequency:
        clauses.append({"op": "=", "args": [{"property": "cmip7:frequency"}, frequency]})

    payload: dict[str, Any] = {
        "collections": ["CMIP7"],
        "bbox": bbox,
        "limit": limit,
        "filter": clauses[0] if len(clauses) == 1 else {"op": "and", "args": clauses},
    }

    req = urllib.request.Request(
        stac_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def build_python_snippet(
    bbox: list[float],
    experiment: str,
    variable: str,
    branded_variable: str | None,
    frequency: str | None,
    time_range: tuple[str, str],
) -> str:
    """Return an intake-esgf + xarray regional subsetting snippet."""
    lon_min, lat_min, lon_max, lat_max = bbox
    lines = [
        "import intake_esgf",
        "import xarray as xr",
        "",
        "cat = intake_esgf.ESGFCatalog().search(",
        '    project="CMIP7",',
        f'    experiment_id="{experiment}",',
        f'    variable_id="{variable}",',
    ]
    if branded_variable:
        lines.append(f'    variable_branded_name="{branded_variable}",')
    if frequency:
        lines.append(f'    frequency="{frequency}",')
    lines.extend([
        ")",
        "datasets = cat.to_dataset_dict(progressbar=True)",
        "ds = next(iter(datasets.values()))",
        'ds = ds.assign_coords(lon=((ds.lon + 180) % 360) - 180).sortby("lon")',
        f'subset = ds.sel(lat=slice({lat_min}, {lat_max}), lon=slice({lon_min}, {lon_max}), time=slice("{time_range[0]}", "{time_range[1]}"))',
        f'subset.to_netcdf("cmip7_{variable}_{experiment}_subset.nc")',
    ])
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Check CMIP7 ESGF-NG holdings for a geographic bounding box.")
    parser.add_argument(
        "--bbox",
        nargs=4,
        type=float,
        metavar=("LON_MIN", "LAT_MIN", "LON_MAX", "LAT_MAX"),
        default=[-82.0, -56.0, -34.0, 13.0],
        help="Bounding box in degrees (-180..180, -90..90). Default: South America",
    )
    parser.add_argument("--experiment", "-e", default="historical", help="CMIP7 experiment_id (e.g. historical, esm-hist, scen7-vl, scen7-m)")
    parser.add_argument("--variable", "-v", default="tas", help="CMIP7 variable_id (e.g. tas, pr, tos, zos, mrso)")
    parser.add_argument("--branded", "-b", default=None, help="Optional CMIP7 variable_branded_name (e.g. tas_tmax-h2m-hxy-u)")
    parser.add_argument("--frequency", "-f", default=None, help="Optional frequency (e.g. mon, day)")
    parser.add_argument("--limit", "-n", type=int, default=15, help="Max STAC items to inspect (default: 15)")
    parser.add_argument("--stac-url", default=DEFAULT_STAC_URL, help="ESGF-NG STAC /search endpoint")
    parser.add_argument("--json", action="store_true", help="Print raw summary JSON")
    parser.add_argument("--print-python", action="store_true", help="Print ready-to-run intake-esgf + xarray script")
    args = parser.parse_args()

    lon_min, lat_min, lon_max, lat_max = args.bbox
    if not (-180 <= lon_min <= lon_max <= 180 and -90 <= lat_min <= lat_max <= 90):
        print("Error: invalid bbox. Expected -180 <= LON_MIN <= LON_MAX <= 180 and -90 <= LAT_MIN <= LAT_MAX <= 90.", file=sys.stderr)
        return 2

    if args.print_python:
        print(build_python_snippet(args.bbox, args.experiment, args.variable, args.branded, args.frequency, ("1980-01-01", "2020-12-31")))
        return 0

    try:
        data = query_stac(
            args.stac_url,
            args.bbox,
            experiment=args.experiment,
            variable=args.variable,
            branded_variable=args.branded,
            frequency=args.frequency,
            limit=args.limit,
        )
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"Error querying {args.stac_url}: {exc}", file=sys.stderr)
        return 1

    features = data.get("features", [])
    summary = {
        "stac_url": args.stac_url,
        "bbox": args.bbox,
        "numberMatched": data.get("numberMatched", len(features)),
        "returned": len(features),
        "items": [
            {
                "id": item.get("id"),
                "source_id": item.get("properties", {}).get("cmip7:source_id"),
                "experiment_id": item.get("properties", {}).get("cmip7:experiment_id"),
                "branded_name": item.get("properties", {}).get("cmip7:variable_branded_name"),
                "frequency": item.get("properties", {}).get("cmip7:frequency"),
                "grid_label": item.get("properties", {}).get("cmip7:grid_label"),
                "realm": item.get("properties", {}).get("cmip7:realm"),
                "area_label": item.get("properties", {}).get("cmip7:area_label"),
                "size_mb": round((item.get("properties", {}).get("size") or 0) / (1024 * 1024), 2),
                "assets_count": len(item.get("assets", {})),
            }
            for item in features
        ],
    }

    if args.json:
        print(json.dumps(summary, indent=2))
        return 0

    print(f"CMIP7 STAC matches for bbox={args.bbox}: {summary['numberMatched']} total (showing {summary['returned']})")
    print("-" * 92)
    for row in summary["items"]:
        print(
            f"{str(row['source_id']):16s} | {str(row['experiment_id']):12s} | "
            f"{str(row['branded_name']):24s} | {str(row['frequency']):4s} | "
            f"{str(row['grid_label']):5s} | {row['size_mb']:7.1f} MB | {row['assets_count']} files"
        )
    if not features:
        print("No matching datasets found for this filter combination.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
