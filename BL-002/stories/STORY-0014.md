# STORY-0014 — Challan Entry Aging Dashboard

- Release: R1
- Endpoint: `GET /challan-entry-aging-dashboard`
- Functional area: Challan Monitoring
- Controller: `ChallanEntryAgingDashboardController.showChallanEntryAgingDashboard(...)`
- View: `final-version-1/ChallanEntryAgingDashboard`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Business-behavior rework: APPROVED_AFTER_REWORK
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

This dashboard lets an operator monitor whether challan entry for vehicle loads is still pending, partially entered, completed, aging beyond the expected entry window, or escalated. It gives both a current tracker view and an audit trail so delayed or incomplete challan entry can be followed back to a trip/load and its status changes.

The page is read-only. Opening or filtering it does not create/update tracker records.

## How the user enters and filters the dashboard

`GET /challan-entry-aging-dashboard` accepts two optional filters:

| Control | Request parameter | Business meaning |
|---|---|---|
| Status | `trackerStatus` | Restricts tracker rows to one of `PENDING`, `PARTIAL`, `COMPLETED`, `AGING`, or `ESCALATED`; blank means all statuses. |
| Trip Id | `tripId` | Restricts current tracker rows and audit rows to one vehicle trip; blank means all trips. |
| Apply | GET submit | Reloads the same dashboard with the selected filters. |

These are status/scalar filters rather than large reference-master selectors, so no Customer/Product/Supplier/Vehicle/Driver/Address search-box conversion is applicable to this Story.

## What the system reads

The controller calls `ChallanEntryAgingDashboardService.fetchDashboard(trackerStatus, tripId)`.

The service always calculates five headline counts from `TripChallanEntryTrackerJpaDao`:

- PENDING
- PARTIAL
- COMPLETED
- AGING
- ESCALATED

Those KPI counts are global counts by status; the frozen service does not apply the page's `trackerStatus` or `tripId` filters to the KPI count calls.

For detailed tracker rows it calls `findDashboardRows(trackerStatus, tripId, PageRequest.of(0, 200))`. Blank/null status means all statuses; null trip means all trips. Rows are ordered by `challanDueAt` ascending, then tracker ID descending.

For audit history it calls `TripChallanEntryTrackerAuditJpaDao.findDashboardRows(tripId, PageRequest.of(0, 50))`. Audit rows can be restricted by Trip Id and are ordered newest first by `createdAt`, then audit ID descending.

## Exact database read identities

Current tracker data is read through immutable entity `TripChallanEntryTrackerDo` mapped to `public.tbl_trip_challan_entry_tracker`, primary key `pk_challan_entry_tracker_id`.

The tracker rows expose business-operational identities and timing including vehicle trip, vehicle load, tracker status, load-created time, challan-due time, first challan entered time, completion time, entered stop count, entered challan count and remarks. fileciteturn99file0L2-L2

Audit data is read through immutable entity `TripChallanEntryTrackerAuditDo` mapped to `public.tbl_trip_challan_entry_tracker_audit`, primary key `pk_challan_entry_tracker_audit_id`. It records tracker/trip/load identity, old/new status, event type, source entity identity, event message and creation time. fileciteturn100file0L2-L2

## What the user sees

The rendered page shows:

- five KPI cards: Pending, Partial, Completed, Aging and Escalated;
- a Trackers table with Tracker, Trip, Load, Status, Load Created, Due, First Entry, Completed and `stops / challans` counts;
- a Tracker Audit table with Time, Tracker, Old status, New status, Event, Source and Message.

The template labels the purpose as the challan-entry 24-hour SLA tracker. It renders the collections directly; when a collection is empty there are simply no data rows. The frozen controller/service does not define a dedicated empty-state or exception message for this GET flow. fileciteturn101file0L2-L2

## Business impact and important limits

The dashboard helps operations identify loads whose challan entry is incomplete or overdue and inspect the status-change history before follow-up or escalation.

Source-proved limits that must remain visible in testing are:

- KPI counts remain global even when row filters are applied.
- At most 200 tracker rows are requested.
- At most 50 audit rows are requested.
- Status values are fixed choices in the page, while Trip Id is a numeric scalar input rather than a searchable trip selector.
- The GET path is read-only; no persistence mutation is performed by this dashboard service.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Post-approval gate: mandatory source/code conformance must pass before downstream executable generation/execution is treated as eligible
- Fan-out targets after conformance: BL-004, BL-005, BL-009, BL-011
- Runtime/coverage rule: do not infer execution or coverage without durable evidence

This approval does not authorize application-code mutation. If post-approval conformance detects drift, prepare the governed exact drift/code-change manifest for explicit user approval before any BL-010 or application-source change.
