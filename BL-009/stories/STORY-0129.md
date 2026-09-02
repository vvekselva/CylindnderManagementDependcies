# BL-009 / STORY-0129 — Save Address Type Test Catalogue

Approved current contract for `POST /lookupManagement/addressType/save`. Tests cover normalization, delegation, cache refresh, PRG success, current contains/ignore-case duplicate rejection, and current update behavior. Existing 320 ms STORY-0087-backed database type-ahead remains unchanged. The exact duplicate/update remediation packet remains separately user-approval gated and is not implemented by this fan-out.

| ID | Scenario | Expected |
|---|---|---|
| TC-0129-01 | Create HOME | Uppercase/trim, delegate, refresh Address Type cache, redirect |
| TC-0129-02 | Update with id | Preserve id and current service semantics |
| TC-0129-03 | Existing contains match | Current service rejects as duplicate |
| TC-0129-04 | No duplicate | Save succeeds through current mapper/JPA path |
