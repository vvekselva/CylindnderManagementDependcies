# BL-009 / STORY-0131 — Save State Test Catalogue

Approved current contract for `POST /lookupManagement/state/save`. Tests cover controller delegation/cache refresh/PRG plus the two source-proved current defects: invalid State input can carry the wrong Country request DTO type, and duplicate validation is contains/ignore-case without same-row exclusion. The exact repair packet remains separately user-approval gated.

| ID | Scenario | Expected current behavior |
|---|---|---|
| TC-0131-01 | Create Tamil Nadu | Trim state name, delegate, refresh State cache, redirect |
| TC-0131-02 | Update with id | Preserve id under current semantics |
| TC-0131-03 | Invalid input | Current service defect may emit CountryIngestionRequestDto validation evidence |
| TC-0131-04 | Contains duplicate | Current service rejects |
