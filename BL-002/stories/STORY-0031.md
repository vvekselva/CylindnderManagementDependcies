# STORY-0031 — Ownership Obligation Dashboard

- Release: R1
- Endpoint: `GET /ownership-obligation-dashboard`
- Functional area: Ownership Obligation
- Controller: `OwnershipObligationDashboardController.showOwnershipObligationDashboard(...)`
- View: `final-version-1/OwnershipObligationDashboard`
- Approval: NOT_APPROVED
- Business-behavior rework: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

This dashboard lets operations see cylinders currently held as customer or supplier obligations, identify which obligations are aging, review recently closed custody, and trace each obligation back to the trip/load/stop where custody entered or exited. It is a monitoring and follow-up page; this GET does not create, close or modify custody.

## User filters and actions

The page accepts four optional filters:

| Control | Request parameter | Business meaning |
|---|---|---|
| Party Type | `partyType` | `CUSTOMER`, `SUPPLIER`, or all parties. |
| Status | `custodyStatus` | `ACTIVE`, `CLOSED`, or all custody states. |
| Trip Id | `tripId` | Shows obligations where that trip is either the entry trip or exit trip. |
| Serial / Party | `searchTerm` | Case-insensitive contains search against cylinder serial or party name. |
| Apply | GET submit | Reloads the dashboard with the chosen filters. |
| Traceability | link | Opens `/party-custody-traceability` for a separate traceability view. |

Party Type and Status are small governed value sets, Trip Id is a scalar numeric filter, and Serial / Party is already a free-text search. The page does not render a large Customer/Supplier static selector, so no Customer/Supplier search-box conversion is required for this Story.

## System read flow

1. `OwnershipObligationDashboardController.showOwnershipObligationDashboard(...)` receives the four optional parameters.
2. It calls `OwnershipObligationDashboardService.fetchDashboard(partyType, custodyStatus, tripId, searchTerm)`.
3. The service calculates global headline metrics from custody data.
4. It loads the top 50 party summaries ordered by active obligation count descending.
5. It loads up to 200 detailed obligation rows using the page filters; `searchTerm` is trimmed before use.
6. The controller renders `final-version-1/OwnershipObligationDashboard` and returns the selected filter values with the dashboard DTO.

## Headline metrics

The service calculates:

- **Active Obligations** — all custody rows with `custody_status = ACTIVE`.
- **Customer Active** — CUSTOMER custody rows with ACTIVE status.
- **Supplier Active** — SUPPLIER custody rows with ACTIVE status.
- **Aging** — ACTIVE obligations with an `aging_due_at` value earlier than the current database/application query time.
- **Closed Today** — rows in `public.tbl_cylinder_party_custody` with `custody_status = CLOSED` and `exited_at` on the current database date.

These KPI counts are global; the frozen service does not apply the page's party/status/trip/search filters to those count calls. fileciteturn132file0L2-L2

## Exact data identities

Detailed obligations are represented by immutable `OwnershipObligationDetailViewDo`, an application `@Subselect` joining:

- `public.tbl_cylinder_party_custody`
- `public.tbl_cylinder`
- `public.tbl_customer`
- `public.tbl_supplier`

The custody primary identity is `pk_custody_id`. The projection includes logical cylinder ID/serial, party type/customer/supplier/name, entry and exit event types, custody status, entry and exit trip/load/stop identities, entered/exited timestamps, aging due time and escalation time. fileciteturn135file0L2-L2

`OwnershipObligationDetailJpaDao.findDashboardRows(...)` applies optional party type and custody status equality, matches Trip Id against either entry or exit trip, and performs case-insensitive contains search against cylinder serial or party name. Rows are ordered by custody ID descending and the service requests at most 200. fileciteturn133file0L2-L2

Party summaries are produced by immutable `OwnershipObligationPartySummaryViewDo`, grouped from party-custody rows joined to customer/supplier names. It calculates active and aging counts per party. The service requests the first 50 summaries ordered by active count descending. fileciteturn136file0L2-L2

## What the user sees

The page shows five KPI cards, followed by:

- **Party Summary** — Party type/id, Name, Active count and Aging count.
- **Cylinder Obligations** — Custody ID, Cylinder serial and logical ID, Party type/name, Status, entry event with Trip/Load/Stop, exit event with Trip/Load/Stop, and Aging Due time.

The template does not define a dedicated empty-state message or a page-local exception message. Empty collections therefore render tables with no data rows. fileciteturn137file0L2-L2

## Business impact and boundaries

This dashboard makes party custody visible as an operational obligation, allowing staff to find aging holdings and correlate them with the trip events that created or closed custody. Because it is read-only, any custody creation, transfer, closure or correction belongs to other operations and must not be inferred from this GET.

Important testing boundaries are that headline metrics and top-party summaries are global while only the detailed obligation rows use the page filters; detail results are capped at 200 and party summaries at 50.

## Rework gate

**BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW**. Controller, template, service calculations, DAO filters and underlying custody/customer/supplier/cylinder reads are frozen-source bound. No automatic approval and no revised BL-004/BL-005/BL-009 fan-out is authorized until explicit user approval/reapproval.
