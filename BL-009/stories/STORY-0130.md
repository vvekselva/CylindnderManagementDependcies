# BL-009 / STORY-0130 — Save Country Test Catalogue

Approved current contract for `POST /lookupManagement/country/save`. Tests cover trimmed country name, uppercased trimmed description, service delegation, Country cache refresh, PRG success, and the current contains/ignore-case duplicate behavior. The separately documented exact duplicate/update remediation remains user-approval gated.

| ID | Scenario | Expected |
|---|---|---|
| TC-0130-01 | Create India | Normalize fields, delegate, refresh Country cache, redirect |
| TC-0130-02 | Update with id | Preserve id under current update semantics |
| TC-0130-03 | Contains duplicate match | Current service rejects |
| TC-0130-04 | Unique country | Current save path succeeds |
