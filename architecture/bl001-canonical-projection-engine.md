# BL-001 Canonical Projection Engine

## Purpose

BL-001 has one logical Controller Traceability dataset but several physical projections. The final projection step previously allowed the Explorer representation to be handled separately from the Markdown matrix and progress/runtime state. That made the last 123 + 11 -> 134 reconciliation unsafe: updating only some projections would create two different answers for the same backlog.

The canonical projection engine fixes that architectural problem. It treats the 134-key endpoint set as one logical model and validates every authoritative projection against the same `HTTP_METHOD_PLUS_PATH` keyset before anything is published.

## Inputs

- Effective accepted Explorer model assembled from `matrix-data.js` plus the ordered delta files referenced by `index.html`.
- `backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z.yaml`.
- `backlog/runtime/BL-001/pending-atomic-projection-20260825-0811Z-corrections.yaml`.
- Frozen source baseline `3ae6e61442132d94a307275b08dd65fcef228d89`.

The engine fails closed if the effective pre-projection state is neither 123 unique keys nor an already projected valid 134-key state.

## Transaction

1. Assemble the effective accepted Explorer model.
2. Prove the current unique-key count.
3. Copy the control repository into a temporary staging workspace.
4. Run the deterministic 123 + 11 transformer only inside that staging copy.
5. Validate exactly 134 unique keys and zero duplicates.
6. Cross-check Markdown, Explorer JSON, browser JavaScript, progress YAML, unresolved state and Level-3 runtime against the same canonical keyset.
7. Create a SHA-256 manifest for the canonical keyset and all generated artifacts.
8. Publish the staged outputs only after every validation passes.
9. Restore the previous authoritative files if publication fails.
10. Remove all transient staging files.

## Authoritative projections

The transaction governs:

- `traceability/controller-traceability.md`
- `traceability/unresolved-traceability.md`
- `traceability/matrix-progress.yaml`
- `traceability/explorer/traceability-matrix.json`
- `traceability/explorer/matrix-data.js`
- `traceability/explorer/index.html`
- `backlog/runtime/BL-001/local-execution.yaml`
- `backlog/runtime/BL-001/canonical-projection-manifest.yaml`

The manifest records the canonical keyset SHA-256 and the SHA-256 of every generated projection so later invocations can detect a split state immediately.

## Idempotency

If a later invocation sees a valid 134-key state, the engine validates it and returns `NOOP_ALREADY_VALID_134`. It does not append the 11 recovery rows again.

## Execution

Validation only:

```bash
python automation/bl001-canonical-projection-engine.py --repo-root . --dry-run
```

Governed projection:

```bash
python automation/bl001-canonical-projection-engine.py --repo-root .
```

A successful projection does not close BL-001. It hands control to WU-BL001-002 for final consistency reconciliation and then WU-BL001-003 for final traceability gates.
