# BL-004 / STORY-0041 — Customer Registration Page Unit-Test Plan

Source contract: `BL-002/stories/STORY-0041.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Unit scenarios
1. GET /registerCustomer creates a fresh request DTO with empty address and phone collections.
2. Controller binds model key `customer`, loads Address Types from LookupDataCache, and renders the registration view.
3. Country/State/City selector behavior uses the governed search endpoints and clears stale child IDs when parent selection changes.
4. Embedded POST companion mapping to STORY-0042 remains explicit and no GET-side persistence is inferred.
5. Invalid POST input restores entered DTOs and validation feedback to the same registration screen.
6. Success path redirects to /ownership-dashboard.
7. The documented current-source omission of Address Type assignment during persistence is treated as a known gap; tests must not falsely assert it is implemented.

## Execution
Plan created by fan-out. Runtime execution and JaCoCo coverage remain NOT_EXECUTED until faithful Maven/JUnit/Spring test runtime is available.
