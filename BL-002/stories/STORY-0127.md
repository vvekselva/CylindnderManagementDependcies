# STORY-0127 — Legacy Lookup Redirect

- Release: R1
- Endpoint: `GET /lookup`
- Controller: `LookupManagementController.legacyRedirect`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Strict contract
The exact frozen handler is the parameterless `LookupManagementController.legacyRedirect`, mapped by `@GetMapping("/lookup")`. There are no request parameters, form fields, DTOs, service/DAO calls, local validation, browser debounce/minimum-length behavior, or persistence operations applicable to this endpoint. The handler logs the legacy navigation and returns `redirect:/lookupManagement`.

The redirect target is proved in the same frozen controller: `GET /lookupManagement` accepts optional query parameter `tab` with default `addressType`, creates view `final-version-1/LookupManagement`, exposes `activeTab`, and reads cached address types, countries, states and cities through `LookupDataCache`. Those target-screen reads are context for the visible redirect outcome; `/lookup` itself does not mutate them.

## Visible outcome and error/reset boundary
A browser requesting the legacy `/lookup` route is redirected to the managed Lookup screen. There is no branch or error handler in `legacyRedirect`, no hidden field propagation, and no endpoint-specific reset/invalidation behavior. Because this story is a redirect-only GET, the applicable strict field/UI contract is fully proved without inventing non-applicable input or persistence behavior.

## Approval boundary
No approval occurred. Strict enrichment completion is not business approval.
