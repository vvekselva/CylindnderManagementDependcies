# BL-001 Unique-Key Consolidation Checkpoint

- Invocation: `UNIQUE-KEY-CONSOLIDATION-20260825-0906Z`
- Owner: `PRIMARY_ORCHESTRATOR`
- Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`
- Prior worker generation: `E2E-STAGED-20260823-161214` = `CLOSED_SYNCHRONIZED`
- Worker replay this invocation: `0`
- Transient lane logs created: `0`
- Residual transient lane logs: `0`

## Idempotency decision

The prior worker generation is already synchronized and was not replayed. Eligible work was restricted to the targeted unique-key recovery/consolidation path.

## Source-proof correction

The pending 11-row projection contained four Lookup Management POST records with abbreviated service/table summaries rather than the ordered/branching component paths required by WF-002. The Primary Orchestrator re-read the exact frozen-source blobs and proved the missing persistence hops:

- `AddressTypeIngestionService -> AddressTypeJpaDao -> AddressTypeDo -> public.tbl_address_type`
- `CountryIngestionService -> CountryJpaDao -> CountryDo -> public.tbl_country`
- `StateIngestionService -> StateJpaDao -> StateDo -> public.tbl_state`
- `CityIngestionService -> CityJpaDao -> CityDo -> public.tbl_city`

The corrected records also preserve the cache-refresh and validation-error model-rebuild branches and are persisted in:

`backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z-corrections.yaml`

## Consolidation executor

Added fail-closed utility:

`automation/consolidate-traceability-explorer.py`

The utility reconstructs the existing Explorer by executing `matrix-data.js` plus the delta files in the exact order declared by `index.html`, applies `apply-deltas.js`, and requires exactly 123 unique pre-projection endpoint keys. It then overlays the four corrected records onto the 11-row recovery candidate and refuses any row without ordered/branching paths. It fails on overlap, duplicates, or a post-projection count other than exactly 134 unique keys.

On PASS it regenerates the canonical `traceability-matrix.json` and `matrix-data.js`, removes obsolete delta loaders from `index.html`, appends the eleven canonical Markdown rows, keeps unresolved accounting at zero, and advances matrix/runtime state to final reconciliation readiness.

## Current canonical state

- Unique target: `134`
- Materialized unique keys: `123`
- Source-proved recovery keys pending atomic projection: `11`
- Unresolved: `0`
- Canonical rows added in this checkpoint: `0`
- WU-BL001-001: `IN_PROGRESS_TARGETED_UNIQUE_KEY_RECOVERY_ATOMIC_PROJECTION_PENDING`
- WU-BL001-002: `BLOCKED_WAITING_FOR_TRUE_UNIQUE_SOURCE_CHECK_COMPLETION`
- BL-001 close allowed: `false`

## Next action

Execute the consolidator on an authoritative control-repository filesystem checkout. Only a successful 123 -> 134 zero-duplicate reconciliation may advance the canonical matrix and hand off to WU-BL001-002. Until then the system remains fail-closed at 123 unique rows.
