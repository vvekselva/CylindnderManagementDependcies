# STORY-0126 — Vehicle Load Fetch

- Release: R1
- Endpoint: `GET /vehicle-load/fetch`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Screen entry and request contract
The exact frozen handler is `VehicleLoadFetchByIdController.doGet`. It is mapped with `@GetMapping("/vehicle-load/fetch")` and requires request parameter `vehicleLoadId` as `Long` through `@RequestParam("vehicleLoadId")`. The returned Thymeleaf view is `with-menu/Displayvehicleload.html`.

The browser entry identity is therefore the selected vehicle-load database/application identity propagated as query parameter `vehicleLoadId`. The page itself links subsequent actions using the same `vehicleLoad.vehicleLoadDto.vehicleLoadId`, including `/add-stop?...actionType=CustomerStop`, `/add-stop?...actionType=SupplierStop`, `/trip-return?vehicleLoadId=...`, and hidden POST field `vehicleLoadId` for `/complete-trip`.

## Controller -> DTO -> application-service contract
The controller creates `VehicleLoadDto`, assigns the request `vehicleLoadId`, creates `VehicleLoadFetchByIdRequestDto`, and sets that DTO as `requestDto.vehicleLoadDto`. It invokes `vehicleLoadFetchService.processRequest(requestDto)` through `ICylinderManagementApplicationService<VehicleLoadFetchByIdRequestDto, VehicleLoadFetchByIdResponseDto>`.

The response supplies the vehicle-load identity/data, trip DTO and trip-stop DTO collection. It is exposed to the view as model key `vehicleLoad`.

## Trip status / guard contract
The controller independently asks `TripReturnWorkflowService.getTripStatusByVehicleLoadId(vehicleLoadId)` and exposes exact guard model values:
- `tripReturned`: status equals `Returned`, case-insensitive.
- `tripProceeding`: status equals `Proceeding`.
- `tripHalt`: status equals `Halt`.
- `tripCanReturn`: status equals `Loaded`.
- `tripChallanEntryAllowed`: Returned OR Proceeding.
- `tripCanComplete`: Proceeding.

The frozen template applies those predicates directly. Customer and Supplier Stop links are enabled only when `tripChallanEntryAllowed`; otherwise disabled buttons state that Returned Trip is required. Returned Trip is enabled only when `tripCanReturn`. Complete Trip is enabled only when `tripCanComplete`; otherwise it is disabled pending Proceeding. Complete Trip opens a confirmation modal and submits hidden `vehicleLoadId` to POST `/complete-trip` only after confirmation.

## Visible screen/read outcome
The page renders Vehicle Load Console information from `vehicleLoad`, including load ID, vehicle, driver, vehicle quantities, recorded journey stops and status controls. Stops are rendered from `vehicleLoad.vehicleTripStopDtos`; customer/supplier names are displayed when present, and an empty-state message is shown when no stops exist.

On DOM load, the template propagates the selected load ID into JS constant `LOAD_ID`. When it exists, the browser makes POST `/cylindermanagement/search/cylinder/on-vehicle` with JSON search data containing `VEHICLE_LOAD_ID: LOAD_ID`, multiple-state search for `EMPTY` and `FULL`, page 1 and 10 items per page. Returned cylinders are rendered into the live vehicle table and state-count chips. An empty result shows `Vehicle is empty`; a rejected/failed fetch hides loading and displays `Failed to load live cylinder data. Please refresh the page.`

The client also derives journey presentation from the returned stop collection: YARD_START contributes Yard, CUSTOMER_DELIVERY contributes Customer, SUPPLIER_DROPOFF contributes Supplier, and YARD_END represents the journey end. These client calculations are presentation behavior; server-side action authorization remains governed by the controller's trip-status model predicates above.

## Error/reset behavior
If the application fetch service raises `CylinderManagementApplicationException`, the controller logs the exception, sets model `vehicleLoad` to null, and returns the same view. No alternate redirect or invented persistence behavior is claimed. This GET story performs application/database reads; it does not itself persist a vehicle-load mutation.

## Strict evidence boundary
The exact frozen controller and frozen Thymeleaf template resolve the previously recorded handler/UI gap. The downstream application's internal DAO/entity implementation behind `vehicleLoadFetchService.processRequest` is not restated beyond what this handler proves; no unproved table or repository identity is invented. The applicable field/UI contract for this GET screen is complete from frozen authoritative source.

## Approval boundary
No approval occurred. Strict enrichment completion is not business approval.
