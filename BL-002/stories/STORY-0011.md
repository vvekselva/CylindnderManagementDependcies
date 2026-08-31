# STORY-0011 — Complete a Vehicle Trip and Return Cylinders to Yard

- Release: R1
- Endpoint: `POST /complete-trip`
- Functional area: Trip Completion
- Controller: `CompleteTripController.completeTrip`
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Approval state: NOT APPROVED
- Legacy traceability state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## What this operation is for

This operation is the final business step for a vehicle load/trip after the vehicle has completed its external movement and is ready to finish at the yard.

The purpose is to make the system agree with the physical business situation at trip end: cylinders that have returned on the vehicle must stop being treated as actively in logistics, they must be placed back into active yard inventory in the correct FULL/EMPTY condition, the trip must receive its final yard stop, and the trip itself must move to `Halt`.

The user does not manually re-enter all cylinder details during this action. The current vehicle load already identifies the trip and the cylinders being returned. The user's business action is to complete the currently displayed trip/load.

## How the user enters this flow

The frozen `final-version-1/Displayvehicleload.html` page contains `completeTripForm`. When the user chooses the Complete Trip action, that form posts to `/complete-trip`.

The form carries one submitted field:

| Field | Visible/hidden | Business meaning | System use |
|---|---|---|---|
| `vehicleLoadId` | Hidden | Identifies the vehicle load/trip that the user is completing | Used to resolve the existing `VehicleLoadDo`, its `VehicleTripDo`, logistics execution and all applicable active return lines |

There is no separate customer, product, supplier, vehicle, driver or address selection as part of this final submit action. The operation acts on the already-selected/current vehicle load.

## Why completion is guarded

Trip completion changes several pieces of operational state at once, so the system must reject completion if the current load/trip or its cylinders are not in a state that can safely return to yard.

`CompleteTripRequestValidator` rejects the request when applicable if:

- the request is missing;
- `vehicleLoadId` is missing, non-positive or does not resolve to a vehicle load;
- the related logistics execution does not exist;
- an active logistics cylinder state is not allowed for yard return;
- an active logistics state cannot be mapped to a final yard state;
- a cylinder already has an active yard-inventory line.

`CompleteTripServiceImpl` additionally requires the vehicle trip to be in `Proceeding` before final completion.

These validations prevent duplicate active yard inventory, impossible state transitions and premature closure of a trip that has not reached the required lifecycle stage.

## What happens when the user completes the trip

`CompleteTripController.completeTrip(@RequestParam("vehicleLoadId") Long vehicleLoadId)` creates `CompleteTripRequestDto` containing the selected `VehicleLoadDto` id and invokes the Complete Trip service.

`CompleteTripServiceImpl.processRequest` executes transactionally. Once all guards pass, it performs the business completion as one governed operation:

1. resolves the vehicle load and its trip;
2. resolves the associated active cylinder logistics execution and its active lines;
3. classifies every returnable cylinder into its final yard state, `FULL` or `EMPTY`;
4. derives the governed return source type as `SUPPLIER_RETURN`, `CUSTOMER_RETURN` or `YARD_RETURN` from the logistics state;
5. records a legacy yard-entry record for the return;
6. creates an active yard-inventory line in the active `MAIN` yard for each returned cylinder;
7. marks the corresponding active logistics-execution line completed/inactive with its completion time;
8. closes the logistics execution as `COMPLETED`;
9. creates the trip's `YARD_END` stop with status `COMPLETED` and the next stop sequence;
10. moves the vehicle trip from `Proceeding` to `Halt` and saves it;
11. returns a successful `CompleteTripResponseDto`.

Because the service is transactional, these related state changes are treated as one completion workflow rather than independent user actions.

## Exact read/write identities

The source-proved read/write chain uses:

- `VehicleLoadJpaDao`
- `VehicleTripJpaDao`
- `VehicleTripStatusJpaDao`
- `VehicleTripStopJpaDao`
- `VehicleTripStopTypeJpaDao`
- `YardEntriesJpaDao`
- `YardInventoryJpaDao`
- `YardInventoryLineJpaDao`
- `YardInventorySourceTypeJpaDao`
- `CylinderStateJpaDao`
- `CylinderLogisticsExecutionJpaDao`
- `CylinderLogisticsExecutionLineJpaDao`
- `YardInventoryAllowedStateJpaDao`

The persisted business effects are therefore not limited to changing a single trip-status value. The operation closes active logistics execution, creates returned-cylinder yard inventory, records the yard-end stop and persists the final trip status.

## User-visible outcome

On successful completion, the controller redirects using `ViewConstants.REDIRECT_HOME_LINK`. The user leaves the trip-completion action with the trip finalized in the system.

If a governed application validation fails, `CylinderManagementApplicationException` is propagated. Unexpected exceptions are wrapped as `CylinderManagementApplicationException` with the internal-error message. The operation must not be represented as successfully completed when those failures occur.

## Downstream business impact

After successful completion:

- returned cylinders are available to yard processes from active yard inventory rather than still appearing active in vehicle logistics;
- the logistics execution is closed;
- the trip contains a completed `YARD_END` stop;
- the trip reaches `Halt`, which is the final state for this source-proved completion flow;
- later yard, inventory, reconciliation and trip-status views can rely on the final persisted state instead of treating the trip as still proceeding.

## Same-page and cross-story relationship

This registered Story is the POST transaction for the Complete Trip action embedded in the vehicle-load display page. The page may expose other trip/load operations, but those are separate governed operations and are not silently folded into this POST Story. This Story covers the business meaning and effects of the Complete Trip submission itself.

## Reference-selector UX review

The mandatory Customer/Product/Supplier/Vehicle/Driver/Address and large-reference selector review was performed for this operation.

**Result: no selector conversion is required for the Complete Trip submit action.** The request contains only the hidden `vehicleLoadId` for the already-current load. It does not ask the user to choose a customer, product, supplier, vehicle, driver or address during completion.

If another operation on the surrounding page contains large static reference selectors, that operation must be reviewed in its own Story; this completion POST does not create a duplicate search-selector requirement.

## Current-state versus required-state assessment

No user-requested UX/application change has been identified for the Complete Trip submission itself in this rework. The source-proved transaction already performs the governed trip-to-yard completion described above.

## Approval gate

This Story is now complete against the current business-behavior documentation standard and is ready for user review, but it is **NOT APPROVED**. No BL-004, BL-005 or BL-009 revised-contract fan-out is authorized until explicit user approval is recorded.
