# STORY-0044 — Vehicle Trip Load Wizard

- Release: R1
- Endpoint: `POST /wizard/vehicle-trip-load/save`
- Functional area: Vehicle Trip Load Wizard
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to submit the combined Vehicle Trip + Load wizard once so that the full trip/load request is handed to the application service and I either return to the vehicle-load list after success or receive the populated wizard with an error message when the application rejects the operation.

## Frozen-source contract proved

`VehicleTripLoadWizardController` is rooted at `@RequestMapping("/wizard/vehicle-trip-load")`; `save()` is mapped by `@PostMapping("/save")`, proving exact request identity `POST /wizard/vehicle-trip-load/save`.

The method binds `@ModelAttribute("wizardRequest") UC02Phase01VehicleLoadRequestDto`. The request DTO carries `VehicleTripDto`, `VehicleLoadDto`, four challan-book ids (`deliveryChallanBookId`, `emptyPickupChallanBookId`, `supplierDropOffChallanBookId`, `customerSpotCylinderCheckBookId`) and the four corresponding starting-sheet numbers.

Controller comments and the DTO prove the single submitted model also carries load lines and trip/load fields. The client-side Step-1 Continue action is not a server submit; the save endpoint is the wizard's only server-side form submission.

The concrete application handoff is `vehicleLoadAndTripIngestionService.processRequest(requestDto)` where the injected dependency is `ICylinderManagementApplicationService<UC02Phase01VehicleLoadRequestDto, UC02Phase01VehicleLoadResponseDto>`.

On normal return from the service, the visible response is `redirect:/vehicle-loads/list`.

On `CylinderManagementApplicationException`, `errorMav()` re-renders `final-version-1/VehicleTripLoadWizard`, preserves/repairs nested trip/load DTOs, repopulates purposes/products and all four active challan-book collections, and exposes a system error instructing the user to verify all four challan book types are selected and available in office.

## Important source-integrity finding

The controller contains descriptive comments claiming a transactional trip + load persistence sequence and specific `tbl_vehicle_trip`, `tbl_vehicle_load` and `tbl_vehicle_load_line` behavior. However, the originally described `IVehicleTripLoadWizardService` field/call is commented out. The executable path in this frozen source is the generic `vehicleLoadAndTripIngestionService.processRequest(requestDto)` call. Therefore the commented transactional/database narrative is not accepted as proof of executable behavior by itself.

## Exact remaining source-detail gap

Strict completion is deliberately **not** claimed. The frozen executable source proves endpoint identity, DTO binding, trip/load/challan-book request identities, application-service boundary, success redirect and application-error re-render. The concrete implementation behind `vehicleLoadAndTripIngestionService`, including validation branches, transaction annotation, DAO/repository calls, entity mapping, exact tables/columns, generated ids, cylinder-state side effects and challan assignment writes, is not source-resolved in the frozen evidence available to this run.

No database behavior is inferred from comments. STORY-0044 therefore remains `SOURCE_DETAIL_REVIEW_REQUIRED`; no strict-field/UI increment and no approval occurred.
