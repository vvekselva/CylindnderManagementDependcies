# STORY-0128 — Lookup Management Screen

- Release: R1
- Endpoint: `GET /lookupManagement`
- Controller: `LookupManagementController.showLookupPage`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_ANALYZED_WAITING_EARLIEST_STRICT_CURSOR
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The GET accepts optional query parameter `tab`, default `addressType`, renders `final-version-1/LookupManagement`, and places `activeTab`, `addressTypes`, `countries`, `states`, and `cities` in the model. All four visible collections are read from `LookupDataCache`; the controller performs no database write. This evidence is complete for the GET contract but strict promotion is withheld behind earliest incomplete R1 STORY-0126. Approval remains pending.
