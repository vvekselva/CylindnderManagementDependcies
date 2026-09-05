# STORY-0015 — Challan Heatmap

- Release: R1
- Endpoint: `GET /challan-heatmap`
- Functional area: Challan Monitoring
- Controller: `ChallanHeatmapController.showHeatmap(...)`
- View: `final-version-1/ChallanHeatmapDashboard`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Business-behavior rework: APPROVED_AFTER_REWORK
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

The Challan Heatmap gives operations a visual picture of Challan Book page usage. It shows how many pages are consumed, unused, missing or spoiled, distinguishes used pages whose photo is uploaded from those still awaiting a photo, and groups page ranges by Challan Book and series. This helps the user identify usable stock and paperwork gaps without opening each book individually.

This GET operation is read-only.

## Filters and user actions

The page accepts three optional filters: `bookType`, `bookCode`, and `seriesPrefix`. Blank values mean no restriction. The Book Type list is populated from distinct values in the heatmap view; Book Code values are populated according to the selected Book Type; Series Prefix values are populated according to selected Book Type and Book Code. Changing Book Type submits the form immediately, while Apply submits all current filters and Reset reloads `/challan-heatmap` without filters.

Book Type/Book Code/Series Prefix are Challan-specific filter controls, not Customer/Product/Supplier/Vehicle/Driver/Address selectors. Book Code is currently rendered as a list. No established reusable search REST pattern for this control was proven in this frozen trace, so no search-box conversion is invented.

## System read flow

1. `ChallanHeatmapController.showHeatmap(...)` creates `ChallanHeatmapFetchRequestDto` from the three request parameters.
2. It calls `ChallanHeatmapFetchService.processRequest(...)`.
3. For this normal dashboard request, the service normalizes blank filter strings to null and calls `ChallanHeatmapMetricsViewJpaDao.findHeatmapMetrics(bookType, bookCode, seriesPrefix)`.
4. The DAO reads `public.vw_challan_heatmap_metrics` using case-insensitive Book Type/Book Code equality and case-insensitive contains matching for Series Prefix.
5. The service also reads distinct Book Types, Book Codes and Series Prefixes from the same view to repopulate filter controls.
6. The service maps view rows to `ChallanHeatmapMetricDto` and returns them with application response code SUCCESS. Its transaction is `readOnly = true`.

The view query returns book type, book code, series prefix, sheet-range bucket, used, unused, spoiled, missing, uploaded-used, and used-without-photo counts. fileciteturn114file0L2-L2

## Dashboard calculations

The controller sums the returned rows to calculate:

- `totalUsed` from clean-used counts;
- `totalUnused` from remaining-unused counts;
- `totalMissing` from missing-page counts;
- `totalSpoiled` from spoiled-page counts;
- `totalPages` as the sum of those four totals.

Null metric counts contribute zero. Rows are also grouped using `bookCode + seriesPrefix` so each book/series becomes one visual heatmap group. fileciteturn111file0L2-L2

## What the user sees

The template shows filter controls, five metric cards (Total Pages, Consumed, Unused, Missing, Spoiled), a Consumed-vs-Unused chart, a page heatmap, and a detailed metrics table. The heatmap legend distinguishes Used + Photo, Used/Photo Pending, Unused, Missing and Spoiled. Each 10-page range is rendered as individual colored squares from the counts returned for that range. The detailed table shows Book Type, Book Code, Series Prefix, Range, Used, Photo Uploaded, Photo Pending, Unused, Missing and Spoiled.

If no rows are returned, the page explicitly displays `No challan heatmap data found.` in both the visual heatmap area and table fallback. fileciteturn113file0L2-L2

## Business impact and boundaries

This page is a monitoring/read capability. It does not itself mark pages used/missing/spoiled, upload photos, or assign books. The same service contains a separate assigned-book-window branch used by other flows when special search-query flags are supplied, but the `/challan-heatmap` controller does not set those flags; this Story therefore does not claim that separate mutation/selection workflow.

No controller-specific friendly error state is defined here; `CylinderManagementApplicationException` is declared by the controller and is allowed to propagate rather than being converted into a page-local error message.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Post-approval gate: mandatory source/code conformance must pass before downstream executable generation/execution is treated as eligible
- Fan-out targets after conformance: BL-004, BL-005, BL-009, BL-011
- Runtime/coverage rule: do not infer execution or coverage without durable evidence

This approval does not authorize application-code mutation. If post-approval conformance detects drift, prepare the governed exact drift/code-change manifest for explicit user approval before any BL-010 or application-source change.
