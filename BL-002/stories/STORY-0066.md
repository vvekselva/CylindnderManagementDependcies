# STORY-0066 — Ownership Dashboard

- Release: R2
- Endpoint: `GET /ownership-dashboard`
- Controller: `OwnershipDashboardController.showOwnershipDashboard`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

Optional filters are `location`, `productName`, `state`, and `searchTerm`; page defaults 0 and size defaults 50. Server clamps page to >=0 and size to 10..200, builds `PageRequest`, then calls `OwnershipDashboardFetchService.fetchDashboard(...)` and `fetchOwnershipPage(...)`. Page content is copied into `dashboardDto.ownershipRows`. Maximum summary cylinder count is null-safely computed.

The view is `final-version-2/OwnershipDashboard_PremiumEnterprise_Fixed`. It receives dashboard/page objects, page number/size/total pages/total elements, previous/next flags and indices, max summary count, and all selected filters. This is read-only; no mutation or local exception branch exists. Approval remains pending.
