# BL-009 / STORY-0013 — Challan Book Registration Test Catalogue

- Source Story: `BL-002/stories/STORY-0013.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`
- Test data: `BL-009/test-data/STORY-0013.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0013/Story0013TestDataDrivenTest.java`

## Test intent
Validate the approved current-source contract for `POST /logistics/challan-books/save`, while preserving the documented current-state gaps rather than treating them as implemented behavior.

## Cases

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0013-01 | Valid delivery challan book | Registry is mapped, timestamps assigned, `saveAndFlush` invoked, SUCCESS returned. |
| TC-0013-02 | Valid optional serial prefix omitted | Registry may persist with null/blank optional prefix. |
| TC-0013-03 | Null request/book | Controlled service exception is **not currently proven** because intended throw is commented; test must expose current defect rather than expect target behavior. |
| TC-0013-04 | Start sheet greater than end sheet | Service detects condition but intended controlled exception throw is commented; current gap must be exposed. |
| TC-0013-05 | Duplicate book code | No service `findByBookCode` pre-check is executed; database uniqueness remains the effective guard. |
| TC-0013-06 | Timestamp derivation | `createdAt` and `updatedAt` are assigned by ingestion service during save. |
| TC-0013-07 | Persistence identity | Saved entity targets `public.tbl_challan_book_registry`, generated `pk_book_id`, unique `book_code`. |
| TC-0013-08 | Per-sheet ledger expectation | Registration does not create per-sheet audit-ledger rows because generation code is commented out. |
| TC-0013-09 | Controller success outcome | Successful service result redirects and exposes `Challan Book registered successfully!`. |
| TC-0013-10 | Controlled application exception outcome | A `CylinderManagementApplicationException` reaching controller redisplays add form with `errorMessage`. |

## Execution mapping
All ten cases and every CSV row are explicitly mapped by case ID in `Story0013TestDataDrivenTest`. Generated code is not PASS. Application-behavior PASS requires faithful JUnit execution against the frozen source; database-specific duplicate/persistence cases require PostgreSQL/Testcontainers/Flyway/JPA behavior rather than H2 or manual SQL.
