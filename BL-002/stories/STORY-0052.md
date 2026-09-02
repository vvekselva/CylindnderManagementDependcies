# STORY-0052 — Open Trip Return Page

## Status

- Release: R1
- Endpoint: `GET /trip-return`
- Approval: `PENDING_USER_APPROVAL`
- Review state: `READY_FOR_USER_REVIEW`
- Rework state: `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`
- Enrichment state: `BUSINESS_BEHAVIOR_COMPLETE`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user handling a returning vehicle trip, I want to open the Trip Return page for a selected vehicle load so that I can review the trip, vehicle and driver context, inspect all assigned challan books and physical leaf states, see which leaves have active photo evidence, and prepare the physical-return information before confirming the return operation.

## Exact request and controller contract

`TripReturnController` is rooted at `@RequestMapping("/trip-return")`. Its GET handler is `showReturnPage(@RequestParam("vehicleLoadId") Long vehicleLoadId)`.

The request therefore requires a `vehicleLoadId` parameter that Spring binds as `Long`. The controller creates view `final-version-1/TripReturnChallanBookReview`, invokes `loadPageModel(...)`, and returns the populated view.

`loadPageModel(...)` calls `TripReturnWorkflowService.loadReturnPage(vehicleLoadId)` and exposes exactly:

- `header` — `TripReturnHeaderDto`;
- `books` — the list of `TripReturnBookDto` values;
- `vehicleLoadId` — the original load identity used by the page and later POST.

The GET handler itself contains no catch/redirect branch. Consequently an invalid identifier or source-state exception raised by the service is not converted by this GET method into a special local error view; normal application exception handling outside this method applies.

## Vehicle-load, trip and header guards

`TripReturnWorkflowService.loadReturnPage(...)` is `@Transactional(readOnly = true)` and builds the page DTO from `findHeader(vehicleLoadId)` plus `findBooks(vehicleLoadId)`.

`findVehicleLoad(...)` executes `VehicleLoadJpaDao.findById(vehicleLoadId)`. A missing row raises:

`Vehicle load {vehicleLoadId} was not found.`

`findHeader(...)` then requires the load to be linked to a vehicle trip. A missing trip raises:

`Vehicle load {vehicleLoadId} is not linked to a vehicle trip.`

When present, the header exposes:

- vehicle load ID;
- vehicle trip ID;
- current trip-status name, or null when no status is linked;
- vehicle number, or null when no vehicle is linked;
- driver name, or null when no driver is linked;
- total cylinders loaded.

The GET flow does not contain a separate Returned/Proceeding/Halt eligibility predicate. It renders the current state it reads; the mutation rules are enforced by the companion POST workflow rather than by `GET /trip-return`.

## Assigned challan-book and leaf review

`findBooks(vehicleLoadId)` reads the assigned-book view through `TripChallanBookAssignmentViewJpaDao.findByVehicleLoadId(vehicleLoadId)` and maps each assignment to `TripReturnBookDto`.

For every book, `populatePagesAndCounts(...)` reads the physical page ledger through `ChallanPageAuditLedgerJpaDao.findPagesByBookIdOrderBySheetNumber(bookId)`. Leaves below the effective assigned start sheet are ignored.

For every retained leaf, the service reads active photo count through `ChallanPagePhotoJpaDao.countActivePhotosForPage(pageAuditId)` and exposes sheet number, page status, active-photo count and remarks. Counts for unused, used-confirmed, physically-used-pending-entry, spoiled, missing and active-photo conditions are derived from the same page-ledger rows that drive the visible heat map, preventing a separate summary source from drifting from the leaf display.

The page also derives the first unused/pending sheet information and next available sheet used by the return form.

## Visible browser contract

`TripReturnChallanBookReview.html` displays:

- Load, Trip, Vehicle, Driver and Current Status cards from `header`;
- a notice explaining the physical challan-book return workflow;
- one section per assigned book, including assignment state and whether the book is Return Pending or Already Returned;
- ledger-derived counts and a leaf heat map;
- a camera marker/title when a leaf has active photo evidence;
- a message when no challan books are assigned.

The page contains the companion return form `th:action="@{/trip-return}" method="post"` and carries hidden `vehicleLoadId`.

Visible inputs prepared for the POST are:

- `returnedBy` — officer/verifier name;
- `remarks` — optional common return remarks;
- `lastUsed_{assignmentId}` — numeric last-used sheet, bounded in the browser by the effective assigned start and book end sheet;
- hidden `firstUnused_{assignmentId}` — initialized from the book next-available sheet;
- `spoiled_{assignmentId}` — comma-separated spoiled sheets;
- `missing_{assignmentId}` — comma-separated missing sheets.

The page provides `Cancel` back to `/vehicle-load/fetch?vehicleLoadId=...` and `Confirm Physical Return` to submit the POST. Browser script connects leaf interaction to the corresponding `lastUsed_{assignmentId}` field.

## Persistence identities and effect

The GET operation is read-only. Source-proved persistence identities include:

- `public.tbl_vehicle_load`;
- `public.tbl_vehicle_trip`;
- `public.tbl_trip_status`;
- vehicle and driver entities/tables used by the trip header;
- `public.vw_trip_challan_book_assignments`;
- `public.tbl_challan_page_audit_ledger`;
- `public.tbl_challan_page_photo`.

No database write is asserted for `GET /trip-return`.

## Business effect

This endpoint is the physical-return review screen. It binds the selected load to its trip context, shows every assigned challan book from the current assignment view, derives visible leaf state and counts from the challan page ledger, surfaces active photo evidence, and prepares the exact inputs needed by the subsequent return confirmation operation.

## Completion and approval gate

The exact request parameter, controller/view/model contract, missing-load/missing-trip behavior, header fields, assigned-book source, leaf/count/photo derivation, visible controls and GET read-only persistence effect are source-bound from the recovered governed ZIP.

STORY-0052 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval is inferred. No application code was changed and no BL-010 work was created or executed.
