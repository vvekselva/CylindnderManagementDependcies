# STORY-0128 — Lookup Management Screen

- Release: R1
- Endpoint: `GET /lookupManagement`
- Controller: `LookupManagementController.showLookupPage`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Strict GET contract
The frozen handler `showLookupPage` is mapped by `@GetMapping("/lookupManagement")`. It accepts query parameter `tab` as String; the parameter is optional because `defaultValue="addressType"` supplies `addressType` when absent. The controller creates view `final-version-1/LookupManagement` and exposes the exact model attributes `activeTab`, `addressTypes`, `countries`, `states`, and `cities`.

The visible lookup collections are read through `LookupDataCache.getAddressTypes()`, `getCountries()`, `getStates()`, and `getCities()`. This GET does not construct an ingestion DTO and performs no write. The `tab` value controls which lookup category is presented as active; no minimum length, debounce, typing API, hidden selection ID, or local validation is applicable to this page-load endpoint.

## Outcome / branch boundary
Normal outcome is rendering the Lookup Management view with the requested/default active tab and all four cached collections. The handler contains no explicit exception branch, redirect, mutation, reset or invalidation. Cache refreshes belong to separate POST save handlers and are not attributed to this GET.

## Approval boundary
No approval occurred. Strict enrichment completion is not business approval.
