# STORY-0011 — Trip Completion

- Release: R1
- Endpoint: `POST /complete-trip`
- Functional area: Trip Completion
- Controller: `CompleteTripController.completeTrip`
- Approval: PENDING_USER_APPROVAL
- Review state: NEEDS_CLARIFICATION
- Traceability state: PARTIAL_INTERMEDIATE_HOPS
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user completing a vehicle load/trip, I submit the current `vehicleLoadId` through `POST /complete-trip` so that the trip can be finalized only after its governed validation and status guards pass, returnable cylinders are transferred from active logistics execution into yard inventory, a yard-end stop is recorded, logistics execution is closed, and the trip reaches `Halt`.

## Proven browser/controller contract

The frozen `final-version-1/Displayvehicleload.html` contains the hidden `completeTripForm` that posts to `/complete-trip` with hidden request field `vehicleLoadId` sourced from the current vehicle-load model.

`CompleteTripController.completeTrip(@RequestParam("vehicleLoadId") Long vehicleLoadId)` constructs `CompleteTripRequestDto` with a `VehicleLoadDto` containing that id, calls the injected Complete Trip application service, and on success redirects to `ViewConstants.REDIRECT_HOME_LINK`. `CylinderManagementApplicationException` is rethrown; unexpected exceptions are wrapped as `CylinderManagementApplicationException` with an internal-error message.

## Proven validator and service behavior

The concrete service is `CompleteTripServiceImpl.processRequest`, executed transactionally. Before mutation it delegates to `CompleteTripRequestValidator`, which rejects a null request, missing/invalid vehicle-load id, missing vehicle load, missing logistics execution, active logistics states not allowed for yard return, logistics states that cannot map to final yard state, and cylinders that already have an active yard-inventory line.

The service then:

1. resolves the `VehicleLoadDo` and its `VehicleTripDo`;
2. requires the trip status to be `Proceeding` before final completion;
3. resolves the `CylinderLogisticsExecutionDo` and active execution lines;
4. for each active returnable line, maps the logistics state to final `FULL` or `EMPTY` yard state and to the governed source type (`SUPPLIER_RETURN`, `CUSTOMER_RETURN`, or `YARD_RETURN`);
5. creates a legacy `YardEntryDo` for the return;
6. creates an active `YardInventoryLineDo` in the active `MAIN` yard with the resolved cylinder state/source type;
7. marks the logistics execution line inactive/completed with completion timestamp;
8. closes the logistics execution as `COMPLETED`;
9. creates a `YARD_END` vehicle-trip stop with status `COMPLETED` and the next stop sequence;
10. changes the vehicle trip status to `Halt` and saves the trip;
11. returns a successful `CompleteTripResponseDto`.

## Proven persistence/read-write identities

The applicable call chain uses `VehicleLoadJpaDao`, `VehicleTripJpaDao`, `VehicleTripStatusJpaDao`, `VehicleTripStopJpaDao`, `VehicleTripStopTypeJpaDao`, `YardEntriesJpaDao`, `YardInventoryJpaDao`, `YardInventoryLineJpaDao`, `YardInventorySourceTypeJpaDao`, `CylinderStateJpaDao`, `CylinderLogisticsExecutionJpaDao`, `CylinderLogisticsExecutionLineJpaDao`, plus `YardInventoryAllowedStateJpaDao` in validation.

The canonical BL-001 row for `POST /complete-trip` already contains the corrected `CompleteTripController` entry, `CompleteTripServiceImpl`, `CompleteTripRequestValidator`, DAO/entity/table branches and terminal outcomes. No BL-001 source-integrity repair is required in this run.

## Strict completion decision

The physical Story identity previously described the unrelated login endpoint and was inconsistent with the canonical Story register. This artifact is now reconciled to canonical `STORY-0011 = R1 / POST /complete-trip / Trip Completion` and to frozen executable source.

The applicable browser → controller → validator/service → DAO/entity/database → transaction/guard/side-effect → terminal behavior is source-proved. Therefore `strict_field_ui_complete = true`.

Approval remains `PENDING_USER_APPROVAL`; no approval is inferred from source completion. The register-level `NEEDS_CLARIFICATION` value is retained until separately reconciled under the governed review-state process.
