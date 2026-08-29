# STORY-0068 — Customer Ownership Detail

- Release: R1
- Endpoint: `GET /ownership-dashboard/customer`
- Controller: `OwnershipDashboardController.showCustomerOwnership`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved behavior

`OwnershipDashboardController.showCustomerOwnership` invokes `OwnershipDashboardFetchService.fetchByLocation(CUSTOMER)`, reading current ownership/location rows through `OwnershipCurrentCylinderLocationViewJpaDao` from `public.vw_ownership_current_cylinder_location`. The terminal view is `with-menu/OwnershipLocationDetail`.

## Strict field/UI enrichment gate

Not strict-field/UI complete. Remaining proof includes exact customer/filter identifiers, search/pagination/sort parameters, row actions, cylinder status/location rendering, and empty/error behavior.

No missing behavior is inferred.
