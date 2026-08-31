# STORY-0044 — Vehicle Trip Load Wizard

- Release: R1
- Endpoint: `POST /wizard/vehicle-trip-load/save`
- Functional area: Vehicle Trip Load Wizard
- Approval: PENDING_USER_APPROVAL
- Review state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Business-behavior rework: COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to submit the combined Vehicle Trip + Vehicle Load wizard so that one validated transaction creates the trip and load, assigns the four required physical challan books, records the Yard-start event, allocates FULL/EMPTY cylinders to their operational purposes, and transfers those cylinders from active Yard inventory into vehicle logistics execution.

## Submitted business contract

`VehicleTripLoadWizardController.save()` handles `POST /wizard/vehicle-trip-load/save` and binds `UC02Phase01VehicleLoadRequestDto` as `wizardRequest`. The request contains the Vehicle Trip, Vehicle Load and load-line information plus four physical challan-book selections and their starting unused sheet numbers:

- Delivery Challan;
- Empty Pickup Challan;
- Supplier Drop-off / `FILLING_NOTE`;
- Customer Spot Cylinder Check.

The executable handoff is `vehicleLoadAndTripIngestionService.processRequest(requestDto)`. The concrete implementation is `VehicleLoadAndTripIngestionService`; the older commented `IVehicleTripLoadWizardService` narrative is not treated as executable evidence.

## Transaction and validation sequence

`VehicleLoadAndTripIngestionService.processRequest()` is `@Transactional` and performs all validation before the core write sequence.

### Trip validation

`VehicleTripIngestionRequestValidator` requires a non-null trip; valid/existing Vehicle and Driver; non-null starting time; valid/existing Customer Address; valid/existing Customer; and verifies from database entities that the selected Address belongs to the selected Customer.

Current-source validation defects are preserved rather than silently corrected: the Driver condition repeats the Driver-object check and then dereferences `getDriverId()` without an explicit ID-null guard, and the Customer-ID validity condition uses `customerAddressId <= 0` where a Customer-ID check would normally be expected.

### Load validation

`VehicleLoadIngestionValidator` requires a non-null load and non-blank `loadedBy`. When cylinder lines are present, every selected Cylinder must exist, be available only in Yard, have one active Yard Inventory line, and be in Yard state `FULL` or `EMPTY`.

Its quantity-null condition checks `quantityFullForDelivery` twice and does not explicitly include `quantityEmptyForSupplier`; this is recorded as current-source behavior, not fixed by Story rework.

### Physical challan-book validation

`TripChallanBookAssignmentSelectionValidator` requires all four distinct physical book IDs and all four starting unused sheet numbers. For each expected book type it proves that the selected book:

1. is active for that exact type;
2. is physically `IN_OFFICE`;
3. has unused pages;
4. has the selected starting sheet inside its physical start/end range;
5. does not start before `nextAvailableSheetNumber`;
6. has that exact selected page currently marked UNUSED in the page-audit ledger; and
7. is not already assigned to another trip whose assignment has not been returned.

One physical book cannot be reused for more than one of the four required types in the same wizard submission.

## Trip creation

The service maps `VehicleTripDto` to `VehicleTripDo`, resolves Vehicle, Driver, Customer and Customer Address through their DAOs, assigns trip status `Started`, and saves the trip.

`VehicleTripDo` maps to `public.tbl_vehicle_trip`, primary key `pk_vehicle_trip_id`, with source-proved `fk_vehicle`, `fk_driver`, `fk_customer_address`, `fk_customer` and `fk_trip_status` identities.

## Vehicle load and cylinder-purpose assignment

The submitted `VehicleLoadDto` is mapped to `VehicleLoadDo` and linked to the newly created trip. The service resolves each submitted Cylinder from the database and requires exactly one active Yard Inventory line as the functional Yard source of truth.

- `EMPTY` cylinders are allocated to `EMPTY_FOR_SUPPLIER` up to the requested EMPTY count and target state `EMPTY_PICKED_FOR_REFILL`.
- `FULL` cylinders are allocated first to `FULL_FOR_DELIVERY`, then to `FULL_FOR_BUFFER`, and target `FULL_PICKED_UP_FOR_DELIVERY`.
- Missing Yard state, unsupported state or quantity overflow causes `CylinderManagementApplicationException`.

The service creates a `YARD_START` Vehicle Trip Stop with status `ARRIVED`, changes the trip status to `Loaded`, and saves both trip and load.

`VehicleLoadDo` maps to `public.tbl_vehicle_load`, primary key `pk_vehicle_load_id`, with unique `fk_vehicle_trip`. Its `loadLines` relationship uses `CascadeType.ALL`, so attached `VehicleLoadLineDo` records persist to `public.tbl_vehicle_load_line`, primary key `pk_vehicle_load_line_id`, carrying `fk_vehicle_load`, `fk_cylinder`, `fk_load_purpose` and load timestamp information.

## Four challan-book assignment writes

After trip/load persistence, the service creates four `TripChallanBookAssignmentDo` rows through `TripChallanBookAssignmentJpaDao` — one for each required book type. `TripChallanBookAssignmentDo` maps to `public.tbl_trip_challan_book_assignment`, primary key `pk_trip_challan_book_assignment_id`.

Each row stores the saved `fk_vehicle_trip`, saved `fk_vehicle_load`, selected `fk_challan_book`, `assigned_by`, `assigned_start_sheet_number`, assignment timestamps and remarks identifying the expected book type and starting unused sheet.

## Yard-to-vehicle logistics transfer

The same transaction creates an OPEN `CylinderLogisticsExecutionDo` in `public.tbl_cylinder_logistics_execution`, linked to the saved trip and load. For each selected cylinder it creates an active `CylinderLogisticsExecutionLineDo` in `public.tbl_cylinder_logistics_execution_line`, linked to the target Cylinder State, with active=true, completed=false and exception=false.

It then marks the previously active source `public.tbl_yard_inventory_line` rows inactive. Therefore the business effect is an explicit Yard-to-vehicle-logistics custody transfer, not merely a load-header insertion.

## Visible outcome

When the transactional service returns normally, the controller redirects to `/vehicle-loads/list`. On `CylinderManagementApplicationException`, the wizard is re-rendered, nested trip/load DTOs are preserved/repaired, reference data and all four active challan-book collections are repopulated, and an error message asks the user to verify the required books are selected and available in office.

## Review and approval gate

The previously unresolved concrete service/database gap is now closed from frozen source. STORY-0044 is `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW` and strict source binding is complete.

No approval occurred. No application code was mutated and no BL-010 task was created/executed. Any future Story/code drift correction requires the exact user-approved Drift / Code Change Manifest before code mutation.
