# STORY-0052 — Open Trip Return Page

## Status

- Release: R1
- Endpoint: `GET /trip-return`
- Approval: `APPROVED_AFTER_REWORK — FANOUT_REQUESTED`
- Review state: `APPROVED_AFTER_REWORK`
- Rework state: `APPROVED_AFTER_REWORK`
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

## Required business lifecycle after the trip physically returns

The Trip Return screen is only one step in a larger physical-to-system reconciliation process.

The approved business rule is:

1. During the trip, the vehicle can return with cylinders collected from both Customers and Suppliers. The returned cylinders can be EMPTY or FULL depending on the business event.
2. When the trip physically reaches the Yard, those cylinders are unloaded and physically placed in the Yard.
3. **At that moment the physical unloading does not automatically make those cylinders part of the system Yard inventory.** The application must not pretend that the physical Yard and the system Yard are already reconciled merely because the vehicle has returned.
4. The next Yard Audit / Yard Stock Check is the operation that records what cylinders are actually found in the Yard.
5. Challans for the completed trip may be entered into the application only after the Yard Audit has established the physical evidence.
6. The cylinders observed by the Yard Audit must then be reconciled against the cylinders implied by the subsequently entered Delivery / Empty Pickup / Supplier-related challans and trip transactions.
7. If the Yard Audit and the entered challans agree, the reconciliation can become GREEN / reconciled.
8. If they do not agree, the system must visibly notify operations that there is a mismatch. The mismatch must remain unresolved until it is investigated/corrected; it must not be silently accepted.
9. A temporary difference caused only by challans not yet being entered may be represented as a time-bound pending/AMBER condition. Once the allowed challan-entry window expires without reconciliation, the mismatch must escalate for human attention.

### Simple example

A vehicle returns at night with 8 EMPTY cylinders collected from Customers and 3 FULL cylinders collected from a Supplier/return movement. Staff unload all 11 cylinders into the Yard physically. The application still should not simply mark all 11 as Yard inventory because the office challans have not yet been entered.

The next morning the Yard Audit scans the physical cylinders. Later the challans are entered. The system must compare the cylinder identities/counts represented by the Yard Audit against the cylinder movements represented by those challans. If the audit saw 11 returned cylinders but the entered challans explain only 10, the system must notify the user that one cylinder is unexplained.

## Current implementation assessment

This required business lifecycle is **only partially implemented in the current source**.

What already exists:
- Trip Return returns the physical challan books to office and changes the trip to Returned.
- Yard Audit / Yard Stock Check records physical cylinders found in the Yard and can produce variance/quality-gate information.
- The database contains reconciliation-gate logic for the specific next-day-before-challan-entry case: a Yard Audit mismatch can be held as AMBER while challan entry is pending, can turn GREEN when challan entry resolves the variance, and can escalate to RED when the permitted challan-entry window expires.

What is not fully proven/implemented end to end:
- STORY-0052/0053 does not create a durable returned-cylinder manifest that explicitly says which FULL/EMPTY cylinders physically came back on the trip but are intentionally not yet in system Yard inventory.
- There is no source-proved end-to-end controller/service flow in this Story that ties those physically returned cylinder identities to the next Yard Audit and then to the exact later challan transactions.
- Therefore the system does not yet have a fully source-proved guarantee that every returned cylinder found by the next-day Yard Audit is matched one-for-one against the later challan entries and that every mismatch is surfaced to the user through the governed application workflow.

This is a real system gap. It is tracked in BL-010 as DEV-0006. Story approval authorizes the business requirement and testing fan-out, but it does **not** authorize implementation of DEV-0006 until its exact change manifest is separately approved.

## Completion and approval gate

The exact request parameter, controller/view/model contract, missing-load/missing-trip behavior, header fields, assigned-book source, leaf/count/photo derivation, visible controls and GET read-only persistence effect are source-bound from the recovered governed ZIP.

STORY-0052 is `APPROVED_AFTER_REWORK` by explicit user approval on 2026-09-04, with fan-out requested. The physical-return -> next-day Yard Audit -> later challan reconciliation requirement is approved as part of the business contract. Current code is only partially conformant; DEV-0006 captures the missing end-to-end returned-cylinder reconciliation behavior. No application code was changed by this approval.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Post-approval source/code conformance is mandatory before downstream executable work becomes eligible.
- Fan-out after conformance: BL-004, BL-005, BL-009 and BL-011.
- No test execution or coverage is inferred.
- Any detected drift remains subject to exact-manifest user approval before application-code mutation.
