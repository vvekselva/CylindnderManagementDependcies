# STORY-0053 — Trip Return

## Status

- Release: R1
- Unique key: `POST /trip-return`
- Register state: `READY_FOR_USER_REVIEW`
- Approval: `PENDING_USER_APPROVAL`
- Review state: `READY_FOR_USER_REVIEW`
- Rework state: `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`
- Enrichment state: `BUSINESS_BEHAVIOR_COMPLETE`
- Source baseline: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Story auto-approval: forbidden

## Human-readable story

As an authorized Cylinder Management user confirming a vehicle's physical return, I want to submit the Trip Return form so that the application records physical challan-leaf usage and exception states, returns each still-active assigned challan book to the office, and moves the trip to Returned when appropriate while preserving visible error feedback if any part of the return cannot be completed.

## Exact browser/form contract

`TripReturnChallanBookReview.html` submits `POST /trip-return` and sends hidden `vehicleLoadId` plus the visible/common fields:

- `returnedBy` — officer/verifier name;
- `remarks` — optional common remarks.

For every book assignment the form emits assignment-specific fields:

- `lastUsed_{assignmentId}` — last physically used sheet;
- `firstUnused_{assignmentId}` — hidden first-unused/next-available sheet;
- `spoiled_{assignmentId}` — comma-separated spoiled sheets;
- `missing_{assignmentId}` — comma-separated missing sheets.

The visible submit control is `Confirm Physical Return`. The page also provides Cancel back to the vehicle-load screen.

## Controller request mapping

`TripReturnController` is rooted at `@RequestMapping("/trip-return")`; `returnTripAndBooks(@RequestParam Map<String,String> form)` is the `@PostMapping` handler.

The controller immediately parses `vehicleLoadId` with `Long.valueOf(form.get("vehicleLoadId"))`, creates the return-review view for failure handling, converts the form into `TripReturnSubmitRequestDto`, and delegates to `TripReturnWorkflowService.returnTripAndBooks(...)`.

`toTripReturnRequest(...)`:

- parses `vehicleLoadId` as `Long`;
- trims blank `returnedBy` and `remarks` to null;
- detects dynamic keys by prefixes `firstUnused_`, `lastUsed_`, `spoiled_`, `missing_`;
- extracts the assignment ID from the suffix after `_` as `Long`;
- parses first-unused/last-used values as nullable `Integer`;
- retains spoiled/missing CSV text for service parsing.

Malformed/missing numeric values can therefore fail during controller conversion; the handler's catch branch covers exceptions raised after `vehicleLoadId` has first been parsed.

## Transaction and top-level guards

`TripReturnWorkflowService.returnTripAndBooks(...)` is `@Transactional`.

A null request or null `vehicleLoadId` raises:

`Vehicle load id is required for Returned Trip.`

The service resolves the load/trip header. A missing load raises `Vehicle load {id} was not found.`; a load without a trip raises `Vehicle load {id} is not linked to a vehicle trip.`

If the current trip status is `Halt`, processing stops with:

`Trip is already Halt/closed. Challan book return cannot be changed.`

## Per-book return behavior

The service loads assigned books using the same current trip-assignment view as the GET review page. A book whose `returnedAt` is already non-null is skipped idempotently.

For each not-yet-returned book:

1. Resolve first-unused sheet. If `lastUsed_{assignmentId}` is supplied, it is range-validated and first-unused becomes `lastUsed + 1`; otherwise the submitted hidden `firstUnused_{assignmentId}` is used.
2. Validate first-unused against the effective assignment range, allowing one past the physical book end so a fully-used book can be represented.
3. Every ledger leaf from the effective assigned start up to but excluding first-unused that is still `UNUSED` becomes `PHYSICALLY_USED_PENDING_ENTRY`; `statusChangedAt` and an appended audit remark are set; changed leaves are saved through `ChallanPageAuditLedgerJpaDao.saveAll(...)`.
4. Parse `spoiled_{assignmentId}` CSV. Each sheet must be within range and exist in the ledger; it is written as `CANCELLED_SPOILED` with timestamp/remark.
5. Parse `missing_{assignmentId}` CSV. Each sheet must be within range and exist in the ledger; it is written as `FLAGGED_MISSING` with timestamp/remark.
6. Load the physical trip-book assignment by ID. Missing assignment raises `Trip challan book assignment {id} was not found.` If `returnedAt` is null it is set to the current timestamp; `returnVerifiedBy` is set from trimmed `returnedBy`; an audit remark is appended; the assignment is saved.
7. Load the challan-book registry row. Missing book raises `Challan book {id} was not found.` Set `currentLocation = IN_OFFICE`, clear `assignedVehicleId`, update timestamp, and save.

Sheet validation raises an explicit range error when a requested sheet falls outside the effective assigned start/end range. Explicit spoiled/missing sheets that are not physically present in the ledger raise `Sheet {sheet} was not found in book {bookCode}.`

## Trip-status mutation

After all applicable books are processed, if the header status is not already `Returned`, the service resolves the configured `Returned` status through `VehicleTripStatusJpaDao.findByStatusName("Returned")`.

If the status row is not configured it raises `Trip status 'Returned' is not configured.` It then reloads the trip by ID, raises `Vehicle trip {id} was not found.` when absent, assigns the Returned status to `VehicleTripDo`, and saves through `VehicleTripJpaDao`.

The physical return workflow therefore performs the state transition to `Returned`; the Trip Return page itself documents that office challan entry subsequently moves Returned to Proceeding and final closure moves Proceeding to Halt.

## Persistence identities and exact effects

Source-proved writes/read dependencies include:

- `public.tbl_challan_page_audit_ledger` — physical leaf states, status timestamps and remarks;
- `public.tbl_trip_challan_book_assignment` — `returnedAt`, verifier and remarks for active assignment returns;
- `public.tbl_challan_book_registry` — location moved to `IN_OFFICE`, assigned vehicle cleared, update timestamp;
- `public.tbl_vehicle_trip` with `public.tbl_trip_status` — trip status set to configured Returned.

The operation is transactional at the service method boundary, so service-level persistence work participates in one Spring transaction unless an outer/global configuration changes the standard transaction semantics.

## Visible outcomes

On successful service completion the controller redirects to:

`/vehicle-loads/list`

On any caught exception after the load ID is parsed, the controller:

- places the exception message in model key `errorMessage`;
- reloads the Trip Return page model for the same `vehicleLoadId`;
- re-renders `final-version-1/TripReturnChallanBookReview`.

The template visibly renders `errorMessage` as an error alert.

## Completion and approval gate

The complete submitted-field contract, parsing/normalization, top-level guards, idempotent already-returned behavior, leaf state transitions, spoiled/missing validation, assignment return mutation, book-location reset, trip Returned transition, persistence identities, transaction boundary and success/error terminals are source-bound from the recovered governed ZIP.

STORY-0053 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval is inferred. No application code was changed and no BL-010 work was created or executed.
