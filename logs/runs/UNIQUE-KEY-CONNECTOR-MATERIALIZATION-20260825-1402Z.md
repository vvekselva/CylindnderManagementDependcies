# BL-001 Connector-Native Explorer Materialization

Invocation: `UNIQUE-KEY-CONNECTOR-MATERIALIZATION-20260825-1402Z`

## Idempotency

- Prior worker generation `E2E-STAGED-20260823-161214`: **CLOSED / SYNCHRONIZED**.
- Worker replay: **0**.
- New workers started: **0**.
- Transient lane logs created: **0**.

## Recovery finding

The previous blocker classified the large minified `traceability/explorer/matrix-data.js` as unreadable through the connector because normal file responses were truncated. Direct Git blob retrieval now returns the complete blob content, so that blocker is obsolete.

The base Explorer model was fully read from blob `3934eea5c72a9996aa555ad9b020ac683c01c827` and contains 11 base endpoint rows. `index.html` proves 42 ordered delta scripts, and `apply-deltas.js` proves the stable upsert key is HTTP method plus path.

The first five ordered deltas were then read completely and structurally checked for preserved endpoint paths/nodes:

1. `matrix-delta-20260824-003111.js`
2. `matrix-delta-20260824-005711.js`
3. `matrix-delta-20260824-013336.js`
4. `matrix-delta-20260824-013546.js`
5. `matrix-delta-20260824-020143.js`

Each contains source-proved ordered/branching endpoint records rather than raw worker candidates.

## Canonical state

No canonical endpoint count was changed. The safe state remains **123 unique materialized keys + 11 fully source-proved recovery keys awaiting atomic projection**. `QG-TRC-012` remains blocked until all 42 ordered deltas are reconstructed, the existing model is proved to contain exactly 123 unique keys, the 11 recovery rows are merged with zero overlap/duplicates, and Markdown/JSON/browser/progress/runtime artifacts are regenerated together.

## Next action

Continue connector-native materialization from `matrix-delta-20260824-023321.js` in the exact `index.html` order. Do not replay the closed worker generation and do not promote the 11 recovery rows independently.
