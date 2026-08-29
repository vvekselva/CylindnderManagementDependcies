# STORY-0053 — Trip Return

- Release: R1
- Unique key: `POST /trip-return`
- Register state: `READY_FOR_USER_REVIEW`
- Approval: `PENDING_USER_APPROVAL`
- Source baseline: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Evidence basis: accepted BL-001 canonical 134/134 traceability matrix only

## Human-readable story

When the Trip Return form is submitted, `TripReturnController.returnTripAndBooks` delegates the return operation to `TripReturnWorkflowService.returnTripAndBooks`. The accepted traceability evidence proves that this workflow coordinates three material branches: challan-page state updates, return of the trip's challan-book assignments, and the vehicle-trip status transition.

For challan-page state handling, the workflow reaches `ChallanPageAuditLedgerJpaDao`, whose persistence target is `public.tbl_challan_page_audit_ledger`. For returning book assignments, it reaches `TripChallanBookAssignmentJpaDao` / `TripChallanBookAssignmentDo` backed by `public.tbl_trip_challan_book_assignment`, and the accepted dependency set also includes `ChallanBookRegistryJpaDao` / `ChallanBookRegistryDo` backed by `public.tbl_challan_book_registry`. For the trip transition, the workflow reaches `VehicleTripJpaDao` and the accepted dependency set includes `public.tbl_vehicle_trip` and `public.tbl_trip_status`.

The accepted canonical row proves the post-processing navigation dependencies `redirect:/vehicle-loads/list` and `final-version-1/TripReturnChallanBookReview`. This Story does not infer which terminal is selected for any unproved condition.

## Source-proved chain

`TripReturnController.returnTripAndBooks`
→ `TripReturnWorkflowService.returnTripAndBooks`
→ challan-page audit persistence (`ChallanPageAuditLedgerJpaDao` → `public.tbl_challan_page_audit_ledger`)
→ returned trip-book assignment persistence (`TripChallanBookAssignmentJpaDao` → `TripChallanBookAssignmentDo` → `public.tbl_trip_challan_book_assignment`)
→ challan-book registry persistence/read dependency (`ChallanBookRegistryJpaDao` → `ChallanBookRegistryDo` → `public.tbl_challan_book_registry`)
→ trip transition persistence (`VehicleTripJpaDao` → `public.tbl_vehicle_trip`, `public.tbl_trip_status`).

## Proved terminals

- `redirect:/vehicle-loads/list`
- `final-version-1/TripReturnChallanBookReview`

## Not proved / not invented

The accepted BL-001 evidence does not by itself prove the complete submitted field list, datatype/requiredness contract, normalization/default rules, exact per-field validation messages, the exact challan-page state values written, the precise returned-at/value mutation applied to each assignment, the exact trip-status value selected, transaction boundary details, or the condition selecting either terminal. Those details remain source-detail review items and are not invented here.

## Review gate

This Story is enriched from accepted evidence and is ready for human review. It is **not approved** and must not be grouped into an approved Use Case until explicit Story approval is recorded.
