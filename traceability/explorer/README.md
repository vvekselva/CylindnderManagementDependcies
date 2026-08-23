# Cylinder Traceability Explorer

Standalone, read-only HTML viewer for BL-001 traceability and durable invocation logs.

## What it shows

- sortable/filterable endpoint list;
- expandable full Controller -> Service -> DAO/Repository -> Entity/View -> DB/File/API chains;
- component index with reverse endpoint usage;
- final-dependency / database-object reverse index;
- unresolved paths with proved facts and missing proof;
- Markdown invocation-log parser for lane task/findings/evidence drill-down.

## Open it

Open `index.html` in a modern browser. The checked-in `matrix-data.js` provides a default snapshot without requiring a web server.

Use **Load Matrix** to import either:

- a structured JSON matrix; or
- the legacy Markdown `controller-traceability.md` table (legacy rows are marked `LEGACY_COMPRESSED`).

Use **Load Logs** to select one or more durable `logs/runs/*.md` files. Parsing is local in the browser; files are not uploaded anywhere.

## Data contract

`traceability-matrix.json` is the structured viewer model. Each endpoint may contain one or more `paths`, and each path contains ordered `nodes` such as CONTROLLER, SERVICE, DAO, ENTITY, POSTGRES_TABLE, SQLITE_TABLE, FILE, CONFIGURATION, API or terminal response. Branching database paths are represented as multiple paths on the same endpoint.

`matrix-data.js` is the browser-friendly generated representation of the same accepted matrix data for direct `file://` opening. Future Orchestrator matrix projection should regenerate both files from the same accepted trace model.

## Trust boundary

This viewer is not SSOT. It never edits GitHub, never accepts worker evidence, and never promotes endpoint state. Canonical state remains the Orchestrator-accepted traceability artifacts and Level-3 runtime.
