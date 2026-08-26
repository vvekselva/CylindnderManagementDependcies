# STORY-0048 — Submit the vehicle trip/load wizard

**State:** NEEDS_CLARIFICATION  
**Endpoint:** `POST /wizard/vehicle-trip-load/save`  
**Controller:** `VehicleTripLoadWizardController.save`  
**Fingerprint:** `771b0908502f43602eaad86e130e21dd7a528a3ebce548e3e2c40545527077a9`

## Trigger and context

A caller submits `POST /wizard/vehicle-trip-load/save` with `UC02Phase01VehicleLoadRequestDto`. The controller passes that request to the source-proved transactional implementation `VehicleLoadAndTripIngestionService.processRequest`.

## Proved validation and ordered persistence behavior

The accepted canonical trace proves challan-book selection validation through `TripChallanBookAssignmentSelectionValidator`, including reads from `public.vw_active_challan_books_for_trip_load`, `public.tbl_challan_page_audit_ledger` and existing `public.tbl_trip_challan_book_assignment` rows. It separately proves cylinder/location validation through `VehicleLoadIngestionValidator`, `CylinderJpaDao`, `CylinderLocationExclusivityValidator`, `public.tbl_yard_inventory_line` and `public.tbl_cylinder_logistics_execution_line`.

The trip/master branch reads vehicle, driver, customer, customer-address and trip-status masters and persists `VehicleTripDo` to `public.tbl_vehicle_trip`. The load branch reads load-purpose, cylinder and yard data and persists `VehicleLoadDo` to `public.tbl_vehicle_load`, cascading its `VehicleLoadLineDo` collection to `public.tbl_vehicle_load_line`. The yard-start branch resolves the stop type and persists `VehicleTripStopDo` to `public.tbl_vehicle_trip_stop`. Four selected challan-book assignments are persisted to `public.tbl_trip_challan_book_assignment`. The yard-to-logistics branch persists `public.tbl_cylinder_logistics_execution` and `public.tbl_cylinder_logistics_execution_line`, reads the cylinder-state master, and updates `public.tbl_yard_inventory_line` through `saveAll`.

## Terminal paths

Success returns `redirect:/vehicle-loads/list`. The accepted application-error path invokes `VehicleTripLoadWizardController.errorMav`, refreshes lookup/cache and active challan-book data, and renders `final-version-1/VehicleTripLoadWizard`.

## Why clarification is still required

The accepted canonical evidence does not preserve the complete submitted request-field list, required/optional status, exact normalization/default rules, exact field-level invalid predicates and validation order, or exact caller-visible validation messages. Those details are not invented, so this Story remains `NEEDS_CLARIFICATION` rather than becoming review-ready.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-113951.md`

No Story approval is implied by this artifact. Explicit user approval of the exact fingerprint is still required.
