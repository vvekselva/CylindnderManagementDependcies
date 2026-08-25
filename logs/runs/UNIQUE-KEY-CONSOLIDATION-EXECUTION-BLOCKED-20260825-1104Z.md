# BL-001 Unique-Key Consolidation Execution Checkpoint

- Invocation: UNIQUE-KEY-CONSOLIDATION-20260825-1104Z
- Owner: PRIMARY_ORCHESTRATOR
- Authoritative branch: chore/rename-dependency-files
- Frozen source baseline: 3ae6e61442132d94a307275b08dd65fcef228d89
- Work unit: WU-BL001-001 targeted unique-key recovery / atomic projection

## Idempotency

- Prior worker generation `E2E-STAGED-20260823-161214`: CLOSED / SYNCHRONIZED.
- Worker replay: 0.
- Transient lane logs created: 0.
- Raw worker evidence auto-accepted: false.

## Canonical state preserved

- Target unique endpoint keys: 134.
- Materialized unique endpoint keys: 123.
- Fully source-proved recovery keys pending atomic projection: 11.
- Unresolved endpoint traces: 0.

## Consolidation executor

The checked-in `automation/consolidate-traceability-explorer.py` was re-read and validated as the only eligible atomic projection path. It requires exactly 123 unique pre-projection rows, merges 11 source-proved recovery rows, requires exactly 134 unique rows with zero duplicates, and regenerates Markdown, structured JSON, browser data, unresolved ledger, matrix progress, index and Level-3 runtime together.

## Execution-host materialization attempts

1. Direct `git ls-remote` from the execution container failed because the host could not resolve `github.com`.
2. The alternate container download path cannot consume repository URLs supplied only through the connected GitHub control-plane interface; its security boundary requires a web-viewable URL, while GitHub/raw download access is disabled from that network path.
3. The GitHub connector can read and update individual repository files but does not expose the entire authoritative branch as a local filesystem checkout usable by the consolidator.

## Fail-closed decision

Do not report 134/134 and do not hand off to WU-BL001-002. Preserve 123 canonical + 11 fully source-proved pending rows until the consolidator can execute against an authoritative filesystem materialization and all required artifacts can be regenerated as one consistent checkpoint.

## Next action

Materialize `chore/rename-dependency-files` on an approved execution filesystem, run `automation/consolidate-traceability-explorer.py`, require PASS on 123 -> 134 unique rows with zero duplicates, synchronize every generated matrix/Explorer/runtime artifact together, then resume WU-BL001-002 final reconciliation.
