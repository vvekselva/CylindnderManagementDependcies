# STORY-0040 — Vehicle Load

- Release: R1
- Endpoint: `POST /vehicleLoad`
- Functional area: Vehicle Load
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to submit the **Vehicle Load** form through **POST /vehicleLoad** so that the selected vehicle-load request is passed to the application mediator and, when accepted, the browser returns to the active vehicle-load list.

## Source-proved controller contract

`Uc02Phase01VehicleLoadController.doPost()` binds the submitted form as `@ModelAttribute("vehicleLoad") UC02Phase01VehicleLoadRequestDto requestDto` and invokes `uc02Phase01VehicleLoadMediator.invokeServices(requestDto)`.

The controller explicitly reads/logs three submitted load quantities from `requestDto.vehicleLoadDto` before invoking the mediator:

- `quantityFullForDelivery`
- `quantityFullForBuffer`
- `quantityEmptyForSupplier`

On mediator success the controller redirects to `/vehicle-loads/list`.

If the mediator throws `InvalidInputParameterException`, the same `with-menu/Uc02-Phase01-VehicleLoadView` is rendered again with the submitted `vehicleLoad` request object and `errorMessage` equal to the exception message.

## Source-proved request model

`UC02Phase01VehicleLoadRequestDto` contains:

- `vehicleLoadDto`
- `vehicleTripDto`
- `deliveryChallanBookId`
- `emptyPickupChallanBookId`
- `supplierDropOffChallanBookId`
- `customerSpotCylinderCheckBookId`
- `deliveryChallanBookStartingSheetNumber`
- `emptyPickupChallanBookStartingSheetNumber`
- `supplierDropOffChallanBookStartingSheetNumber`
- `customerSpotCylinderCheckBookStartingSheetNumber`

Its frozen-source documentation states that the nested `VehicleLoadDto` carries vehicle identity, driver identity, load date/time, loaded-by/remarks and load-line cylinder selections.

## Exact remaining source-detail gap

The physical Story artifact is materialized and the controller/request-model contract is now source-proved. Strict completion is still withheld because this run has not yet resolved the concrete implementation selected for `ICylinderManagementApplicationMediator<UC02Phase01VehicleLoadRequestDto, UC02Phase01VehicleLoadResponseDto>` and therefore cannot yet prove the exact mediator -> service -> DAO/repository -> entity/table write chain, transaction/guard predicates, persisted identities, or downstream side effects.

No database behavior beyond frozen source is invented. No strict-field/UI completion is claimed. No approval occurred.
