# Current Code-Drift User Review Index — 03 Sep 2026

No item in this index authorizes application-code mutation. Every exact manifest remains fail-closed until explicit user approval of that manifest.

| Scope | Story | Current behavior / impact | Exact review artifact | DB impact | State |
|---|---|---|---|---|---|
| State search service identity | STORY-0101 | State search validates under Product UOM identity; diagnostics are misleading, and a naive state-code replacement would trigger incorrect state-filter validation. | `BL-002/evidence/STORY-0101-state-search-service-code-drift-review-20260902-2205.yaml` | NONE | WAITING_EXPLICIT_APPROVAL |
| Vehicle search service identity | STORY-0103 | Vehicle search validates under Product UOM identity; traceability/error classification is wrong although the vehicle DAO read path remains correct. | `BL-002/review-packets/STORY-0103-VEHICLE-SEARCH-SERVICE-CODE-DRIFT-20260903.md` | NONE | WAITING_EXPLICIT_APPROVAL |
| Null request/null book service guard | STORY-0013 / DEV-0002 | Intended controlled exception is commented; null input can reach uncontrolled dereference. | `BL-010/evidence/DEV-0002-STORY-0013-null-request-drift-review-20260902-2301.yaml` | NONE | WAITING_EXPLICIT_APPROVAL |
| Sheet-range service validation | STORY-0013 / DEV-0003 | Invalid/missing bounds are detected but not rejected; invalid range can continue toward persistence. | `BL-010/evidence/DEV-0003-STORY-0013-sheet-range-drift-review-20260902-2301.yaml` | NONE | WAITING_EXPLICIT_APPROVAL |
| Duplicate Book Code pre-check | STORY-0013 / DEV-0004 | Service has no explicit DAO pre-check; duplicate handling is deferred to persistence uniqueness failure. | `BL-010/evidence/DEV-0004-STORY-0013-duplicate-book-code-drift-review-20260902-2302.yaml` | READ_ONLY_PRECHECK_ONLY | WAITING_EXPLICIT_APPROVAL |

## Governance

- STORY approval and code-change approval are separate gates.
- No BL-010 item may be created or executed from STORY-0101 or STORY-0103 until its exact manifest is explicitly approved.
- DEV-0002/0003/0004 remain NOT_STARTED until their exact manifests are explicitly approved.
- Any implementation expansion beyond the locations in the relevant packet requires new user approval.
