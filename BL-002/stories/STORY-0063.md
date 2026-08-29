# STORY-0063 — Party Custody Traceability

- Release: R1
- Endpoint: `GET /party-custody-traceability`
- Controller: `PartyCustodyTraceabilityController.showTraceability`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved behavior

`PartyCustodyTraceabilityController.showTraceability` invokes `OwnershipObligationDashboardService.fetchDashboard`. Custody-detail data is backed by `OwnershipObligationDetailJpaDao` and `public.tbl_cylinder_party_custody` with cylinder/customer/supplier records. Party summaries use `OwnershipObligationPartySummaryJpaDao`, also backed by custody/customer/supplier data. The terminal is `final-version-1/PartyCustodyTraceabilityDashboard`.

## Strict field/UI enrichment gate

Not strict-field/UI complete. Remaining exact proof includes filter/query fields, customer/supplier identifiers and switching rules, aging/status values, pagination/sorting, row drill-down actions, button/link states, and exact empty/error model behavior.

No missing behavior is inferred.
