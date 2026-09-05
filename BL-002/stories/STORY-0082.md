# STORY-0082 — Yard Stock Check Form

- Release: R1
- Endpoint: `GET /ingestYardStockCheck`
- Controller: `YardStockCheckIngestionController.doGet`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Review state: READY_FOR_USER_REVIEW
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- POST companion drift packet: `BL-002/evidence/STORY-0083-yard-stock-check-drift-review-20260902.yaml`

## Business behavior

As a yard operator, I can open a new Yard Stock Check, with today's audit date prefilled and configured cylinder states available, search a cylinder by serial text, inspect its current system state, choose the observed physical state, add it to the audit list with optional notes, remove/re-index lines, and submit the assembled stock-check request.

`GET /ingestYardStockCheck` accepts no request parameters. The controller creates `YardStockCheckIngestionRequestDto` plus `YardStockCheckDto`, sets `checkDate = LocalDate.now()`, renders `final-version-1/YardStockCheckIngestion`, and exposes `yardStockCheck`, `backLink`, and `CYLINDER_STATES = lookupDataCache.getCylinderStates()`.

The form targets `POST /ingestYardStockCheck`. Header fields bind check date, checked-by, created/completed timestamps and remarks. The cylinder search input sends `GET /search/cylinder/{query}` for any non-empty trimmed text and displays returned serial/current-state values. Selecting a cylinder stores the selected cylinder object in browser state, displays the current system state, and attempts to preselect the matching physical-state option. `Add to Audit List` requires a selected cylinder and physical state, otherwise displays `Please select a cylinder and its physical state.` Added lines retain cylinder ID, selected state and auditor notes; removal rewrites indexes so Spring can bind the remaining list.

This GET performs no persistence. Its exact business role is browser-side construction of the audit request. The recovered ZIP also proves a POST-companion binding/mapping defect: the final template names the selected state as `checkLines[i].cylinderState.cylinderStateId`, while the DTO consumed by validation/service code exposes `observedCylinderState`. That defect is not silently corrected here; it is isolated in the referenced approval-gated STORY-0083 drift packet.

## Completion and approval gate

The GET initialization, search, browser selection, add/remove/reindex behavior, submitted identities and read-only effect are fully source-bound. STORY-0082 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending. No application code or BL-010 mutation occurred.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Fan-out: BL-004, BL-005, BL-009 and BL-011, subject to post-approval conformance.
- No test execution or coverage is inferred.
