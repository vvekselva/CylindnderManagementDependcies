# STORY-0134 — Create Vehicle Trip

- Release: R1
- Endpoint: `POST /addVechileTrip`
- Controller: `VehicleTripIngestionController.doPost`
- Approval: NOT_NEEDED_SUPERSEDED
- Review state: SUPERSEDED_NOT_NEEDED
- Rework state: SUPERSEDED_NOT_NEEDED
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0134-vehicle-trip-create-drift-review-20260902.yaml`

- Lifecycle disposition: SUPERSEDED_NOT_NEEDED
- Superseded by: STORY-0043 / STORY-0044
- Supersession reason: The combined Vehicle Trip Load Wizard creates the trip and carries the trip identity into the same governed workflow, replacing the separate Add Vehicle Trip screen/submit flow.
- Approval requirement: NONE_FOR_SUPERSEDED_STORY
- Downstream fan-out: BLOCKED_NOT_APPLICABLE

## Business behavior

The New Vehicle Trip form posts model `tripRequest` to `POST /addVechileTrip` after browser validation has selected persistent Vehicle, Driver, Customer and Customer Address identities and converted the selected datetime to the trip starting-time value.

`VehicleTripIngestionController.doPost(...)` delegates the bound `VehicleTripIngestionRequestDto` to `VehicleTripIngestionServiceImpl`. On success it builds the next-step redirect context, preferring persisted response Driver/Vehicle values and falling back to submitted values when necessary, flashes Driver ID/name, Vehicle ID/number and the generated Vehicle Trip ID, then redirects to `/vehicleLoad`.

A controlled `InvalidInputParameterException` carrying `VehicleTripIngestionRequestDto` restores failed trip/validation data and re-renders `with-menu/VehicleTripIngestion`; other application exceptions also keep the user on the form rather than advancing to Vehicle Load.

## Exact validation and service behavior

`VehicleTripIngestionRequestValidator` checks the request/trip object, Vehicle identity/existence, Driver identity/existence, Starting Time, Customer Address identity/existence, Customer identity/existence and the persisted Customer-to-Address relationship. Accumulated validation errors are attached to the trip/request and are intended to raise controlled input-validation evidence.

`VehicleTripIngestionServiceImpl.processRequest(...)` is transactional. After validation it maps `VehicleTripDto` to `VehicleTripDo`, resolves the selected `VehicleDo`, `DriverDo`, `CustomerDo` and `CustomerAddressDo`, sets them on the trip, resolves trip status `Started`, and saves through `VehicleTripJpaDao.save(...)`.

`VehicleTripDo` maps to `public.tbl_vehicle_trip`, primary key `pk_vehicle_trip_id`, sequence `pk_vehicle_trip_id_serial`, with persisted links including `fk_vehicle`, `fk_driver`, `fk_customer`, `fk_customer_address`, and `fk_trip_status`. The generated trip is mapped back into `VehicleTripIngestionResponseDto` with SUCCESS.

## Source-proved validation/reference drift

The recovered ZIP exposes several current defects:

1. A null top-level trip request emits validation evidence using `VehicleIngestionRequestDto` instead of `VehicleTripIngestionRequestDto`, conflicting with the controller's intended inline validation branch.
2. Driver validation checks `driverId <= 0` without first guarding a null Driver ID when the Driver DTO itself exists, allowing a null-unboxing failure.
3. The Customer-ID invalidity condition checks `customerAddress.customerAddressId <= 0` instead of the submitted `customerId`; it can also dereference Customer Address after an earlier invalid-address condition.
4. Service reference/status resolution uses `Optional.get()` after validation, including the configured `Started` status, so a missing/raced reference can surface as an uncontrolled exception rather than a controlled application error.

The exact validator/service/test remediation is isolated in `BL-002/evidence/STORY-0134-vehicle-trip-create-drift-review-20260902.yaml`. The accepted persistence model needs no schema change.

## Business impact and outcome

A successful transaction creates the persisted trip and advances the user to Vehicle Load with the exact new trip identity. Validation/reference defects can currently produce uncontrolled failures or test the wrong identity for malformed inputs; those defects are review-gated and not silently changed.

## Completion and approval gate

The recovered ZIP binds the browser-submitted identity contract, controller branches, validator predicates, transaction/reference resolution, repository/entity/table persistence and all identified current defects. STORY-0134 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains `PENDING_USER_APPROVAL`. No application code was changed and no BL-010 work was created or executed.

## Supersession disposition

This legacy Story is retained only for traceability and audit. It is **not an active review or implementation requirement**. Its business capability is provided by the combined Vehicle Trip Load Wizard through STORY-0043 / STORY-0044. Do not request user approval, post-approval conformance, BL-004 unit-test fan-out, BL-005 integration-test fan-out, BL-009 test-catalogue fan-out, or BL-011 readable-packet completion for this superseded Story. Historical source analysis remains evidence only and must not be counted as active backlog work.
