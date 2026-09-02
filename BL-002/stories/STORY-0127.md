# STORY-0127 — Legacy Lookup Redirect

- Release: R1
- Endpoint: `GET /lookup`
- Controller: `LookupManagementController.legacyRedirect`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This route exists only to preserve legacy navigation. `LookupManagementController.legacyRedirect()` is parameterless and maps exact `GET /lookup`. A browser requesting the legacy URL is immediately redirected to `/lookupManagement`; no form value, persistent identity or filter is carried by this redirect.

The destination handler is source-proved in the same controller. `GET /lookupManagement` accepts optional `tab`, defaulting to `addressType`, renders `final-version-1/LookupManagement`, exposes `activeTab`, and supplies Address Type, Country, State and City reference collections from `LookupDataCache`. That destination context explains what the user sees after redirect; it is not a write performed by `/lookup`.

There is no request DTO, application-service invocation, DAO call, database mutation, validation branch, debounce/minimum-length rule, hidden-ID propagation or endpoint-specific error handling in `legacyRedirect` itself.

## Business impact and visible outcome

The business purpose is backward-compatible navigation: old links/bookmarks targeting `/lookup` continue to land on the current Lookup Management screen instead of returning a missing-page result. The operation is read/navigation-only and changes no lookup data.

## Completion and approval gate

The recovered ZIP directly confirms the legacy route, exact redirect target and the destination screen context. STORY-0127 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains `PENDING_USER_APPROVAL`. No application code was changed and no BL-010 work was created or executed.
