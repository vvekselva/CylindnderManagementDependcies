# STORY-0127 — Legacy Lookup Redirect

- Release: R1
- Endpoint: `GET /lookup`
- Controller: `LookupManagementController.legacyRedirect`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_ANALYZED_WAITING_EARLIEST_STRICT_CURSOR
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The frozen controller maps `/lookup` to a parameterless legacy redirect. It logs the redirect and returns `redirect:/lookupManagement`; it does not read or persist domain data. The visible outcome is navigation to the managed Lookup screen. This source evidence is materialized for reuse, but strict completion is deliberately withheld because STORY-0126 remains the earliest incomplete R1 strict unit. Approval remains pending.
