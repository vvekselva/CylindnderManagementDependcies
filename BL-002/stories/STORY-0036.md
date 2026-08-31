# STORY-0036 — Yard Audit Dashboard

- Release: R1
- Endpoint: `GET /yard-audit-dashboard`
- Functional area: Yard Audit
- Controller: `YardAuditDashboardController.doGet(...)`
- Service: `YardAuditDashboardFetchService.processRequest(...)`
- Approval: NOT_APPROVED
- Business-behavior rework: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

The Yard Audit Dashboard lets yard/operations staff review daily physical cylinder checks against system records. The user can select an audit date or a specific Yard Stock Check, see what was scanned, compare observed cylinder state with the system state, inspect the associated quality-gate result, identify third-party cylinders, and follow the audit event timeline. This page is a read/reporting capability; starting a new Yard Audit is a separate navigation/action.

## How the user enters and filters the page

`GET /yard-audit-dashboard` accepts two optional filters:

- **Audit Date (`gateDate`)** — the calendar date whose Yard Audits should be reviewed.
- **Audit ID (`stockCheckId`)** — the exact Yard Stock Check to display in detail.
- **Apply Filter** — reloads the same dashboard with the selected values.
- **Reset** — reloads the dashboard without the filters.
- **New Yard Audit** — navigates to `/ingestYardStockCheck`; it does not create an audit inside this GET request.

Audit Date and Audit ID are date/scalar filters rather than large reference-master selectors, so Customer/Product/Supplier/Vehicle/Driver/Address search conversion is not applicable.

## What the system reads

The controller copies `stockCheckId` into `YardAuditDashboardFetchRequestDto`. A nonblank `gateDate` is parsed as `LocalDate`. The request is passed to `YardAuditDashboardFetchService`.

The service:

1. resolves the explicitly selected or latest audit with `fetchLatestAuditSummary(stockCheckId)`;
2. determines the reporting date from the supplied `gateDate`, or from the selected audit when no date was supplied;
3. loads that date's audit summaries and count;
4. if no explicit selected audit was resolved, can use the first audit from the selected date as the displayed audit;
5. loads quality-gate rows for the selected Yard Stock Check;
6. loads line-level scanned-cylinder details;
7. loads the selected audit's event timeline; and
8. loads recent third-party-cylinder alerts.

The applicable DAO is `YardQualityGateJpaDao`.

## Exact database read identities

The frozen read path uses:

- `public.tbl_yard_stock_check` — Yard Audit identity, date, operator, status/context and created/completed times;
- `public.tbl_yard_stock_check_line` — scanned/observed cylinder, observed/system state, match result, scan time and auditor notes;
- `public.tbl_yard_quality_gate` — quality-gate status/reason for the audit;
- `public.tbl_cylinder_states` — state names used when presenting observed/system cylinder state;
- `public.tbl_yard_check_event` — event timeline including event type/time/operator/cylinder/variance/remarks and cumulative scanned count.

This GET does not write to those objects.

## What the user sees

The page presents the selected reporting context and, where available:

- number of audits for the day;
- selected Audit ID and status;
- who checked the yard;
- known-cylinder and third-party-cylinder counts;
- the list of audits for the selected date, with View links back to the same dashboard;
- selected audit's quality-gate status;
- third-party-cylinder alerts;
- each scanned audit line, including observed state, system state and whether they match; and
- the selected audit's event timeline.

The page has explicit empty outcomes including `No yard audits found.` and `No audits for selected date.`. If the application service raises `CylinderManagementApplicationException`, the controller renders the same dashboard and exposes `dashboardLoadError` rather than claiming a successful load.

## Business meaning and impact

The dashboard allows staff to answer operational questions such as: Was the yard actually checked? Which audit is being reviewed? Which physical cylinders disagree with the system? Were third-party cylinders found? Did the audit pass its quality gate? What events occurred during the check? Because the view is read-only, corrections, new scans, audit completion and any cylinder-state changes belong to their respective write operations and must not be inferred from viewing this page.

## Related operation

`/ingestYardStockCheck` is the separate entry point used when the user chooses **New Yard Audit**. This Story does not claim the behavior of that creation workflow.

## Rework gate

**BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW**. The page purpose, filters, service/DAO read chain, exact database objects, visible metrics/details, empty/error outcomes and read-only boundary are frozen-source bound. No automatic approval and no revised BL-004/BL-005/BL-009 fan-out is authorized until explicit user approval/reapproval.
