# BL-009 / STORY-0132 — Save City Test Catalogue

Approved current contract for `POST /lookupManagement/city/save`. Tests cover controller delegation/cache refresh/PRG plus the two source-proved current defects: invalid City input can carry the wrong Country request DTO type, and duplicate validation is contains/ignore-case without same-row exclusion. The exact repair packet remains separately user-approval gated.

| ID | Scenario | Expected current behavior |
|---|---|---|
| TC-0132-01 | Create Coimbatore | Trim city name, delegate, refresh City cache, redirect |
| TC-0132-02 | Update with id | Preserve id under current semantics |
| TC-0132-03 | Invalid input | Current service defect may emit CountryIngestionRequestDto validation evidence |
| TC-0132-04 | Contains duplicate | Current service rejects |
