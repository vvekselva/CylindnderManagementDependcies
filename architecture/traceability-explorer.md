# Traceability Explorer Architecture

## Purpose

Provide a human-readable, browser-based view of BL-001 traceability without making the browser a source of truth.

The explorer displays the entire source-proved chain for an endpoint where available:

`HTTP method/path -> Controller.method -> Service/Mediator -> additional service(s) -> DAO/Repository -> Entity/View -> DB/File/API/terminal dependency`.

If any intermediate hop is not proved, the chain must show it as incomplete rather than jumping directly from Controller to a final table.

## Files

- `traceability/explorer/index.html` - standalone browser shell
- `traceability/explorer/styles.css` - presentation
- `traceability/explorer/app.js` - matrix rendering, sorting/filtering, reverse indexes and Markdown log parser
- `traceability/explorer/traceability-matrix.json` - structured full-chain viewer model
- `traceability/explorer/matrix-data.js` - browser-friendly generated copy for direct local opening
- `traceability/explorer/README.md` - operating instructions

## Viewer tabs

1. **Endpoints** - sortable/filterable endpoint table; expand a row to view each complete/branching chain.
2. **Components** - list Controller/Service/DAO/Entity/etc. components and the endpoints using them.
3. **DB / Final Dependencies** - reverse index from table/view/file/config/API/terminal dependency back to endpoints/controllers.
4. **Unresolved** - source-proved facts, missing proof and exact next action.
5. **Execution Logs** - local browser parser for durable Markdown invocation logs, grouped by lane/task/findings/evidence.

## Matrix data contract

Each endpoint record contains:

- `method`
- `path`
- `controller`
- `controllerMethod`
- `state`
- `chainCompleteness`
- one or more `paths`
- each path contains ordered `nodes`
- `finalDependencies`
- `evidence`

Node types may include CONTROLLER, SERVICE, SERVICE_GROUP, MEDIATOR, DAO, REPOSITORY, ENTITY, VIEW_ENTITY, POSTGRES_TABLE, DATABASE_VIEW, SQLITE_TABLE, FILE, CONFIGURATION, EXTERNAL_API, TERMINAL_VIEW or TERMINAL_JSON.

Branching persistence paths are represented as multiple paths for the same endpoint.

## Orchestrator integration

After the Primary Orchestrator accepts an endpoint trace:

1. upsert the canonical Markdown matrix row;
2. upsert the structured endpoint record with the full proved chain;
3. regenerate `traceability-matrix.json` and `matrix-data.js` from the same accepted model;
4. synchronize unresolved accounting;
5. update matrix progress;
6. persist all accepted artifacts to GitHub.

Raw worker output never writes viewer data directly.

## Log parser

The browser may load one or more durable `logs/runs/*.md` files selected by the user. Parsing is performed locally in JavaScript and extracts invocation/lane/task/run/result/findings/evidence sections. The log parser is a presentation aid only; it does not modify the matrix or runtime SSOT.

## Trust boundary

The HTML component is read-only and non-authoritative. Canonical truth remains the Orchestrator-accepted traceability artifacts, frozen-source evidence and Level-3 runtime. The viewer must never be used to infer a missing intermediate component or to promote raw worker candidates.
