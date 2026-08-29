# STORY-0067 — Yard Ownership Detail

- Release: R1
- Endpoint: `GET /ownership-dashboard/yard`
- Controller: `OwnershipDashboardController.showYardOwnership`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved behavior

`OwnershipDashboardController.showYardOwnership` invokes `OwnershipDashboardFetchService.fetchByLocation(YARD)`. It reads current ownership/location rows through `OwnershipCurrentCylinderLocationViewJpaDao` / `OwnershipCurrentCylinderLocationViewDo` from `public.vw_ownership_current_cylinder_location` and renders `with-menu/OwnershipLocationDetail`.

## Strict field/UI enrichment gate

Not strict-field/UI complete. Remaining proof includes exact filter/query fields, cylinder/yard identifiers, pagination/sort defaults, detail actions, state/status rendering and exact empty/error behavior.

No missing behavior is inferred.
