# STORY-0039 — Vehicle Load

- Release: R1
- Endpoint: `GET /vehicleLoad`
- Functional area: Vehicle Load
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to open the Vehicle Loading screen so that I can identify the vehicle and driver, set load date/time and loading metadata, choose cylinders available for loading, distribute FULL cylinders between delivery and buffer purposes, and prepare the vehicle-load submission.

## Entry and server-side GET contract

`GET /vehicleLoad` is handled by `Uc02Phase01VehicleLoadController.doGet(Model model)`.

The controller always:

1. creates a new `UC02Phase01VehicleLoadRequestDto`;
2. creates a new `VehicleLoadDto` and attaches it to the request DTO;
3. creates a `VehicleTripDto` placeholder;
4. creates view `with-menu/Uc02-Phase01-VehicleLoadView`;
5. exposes the request DTO as model attribute `vehicleLoad`;
6. calls `lookupDataCache.getVehicleLoadPurposes()`.

The fetched `vehicleLoadPurposeDtos` local variable is not added to the model in this handler, so no further behavior is attributed to that call.

### Redirect-preselected branch

When the Spring `Model` contains `REDIRECT_REQUEST`, the controller reads these exact flash/model attributes:

- `DRIVER_ID`
- `DRIVER_NAME`
- `VEHICLE_ID`
- `VEHICLE_NUMBER`
- `VEHICLE_TRIP_ID`

It forwards them to the page as:

- `preselectedVehicleId`
- `preselectedVehicleNumber`
- `preselectedDriverId`
- `preselectedDriverName`
- `preselectedVehicleTripId`

It also sets `vehicleTripDto.vehicleTripId` and attaches that DTO to the request DTO. When `REDIRECT_REQUEST` is absent, this preselection branch is skipped and the page uses normal vehicle/driver type-ahead behavior.

Frozen controller source:
`cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/Uc02Phase01VehicleLoadController.java`

## Exact screen and form binding

The Thymeleaf page is:
`cylindermanagement.web/src/main/resources/templates/with-menu/Uc02-Phase01-VehicleLoadView.html`.

The form uses `th:object="${vehicleLoad}"`, `method="post"`, and posts to `/vehicleLoad`.

Source-proved controls include:

- **Vehicle*** — visible type-ahead `vehicle-text`; selected identity is propagated to hidden `vehicle-id` for the request DTO; the redirect branch can pre-populate and lock this field.
- **Driver*** — visible type-ahead with hidden selected driver identity; the redirect branch can pre-populate and lock this field.
- **Load Date*** — `vehicleLoadDto.loadDate`; `onchange` invokes `syncLoadTime()`.
- **Load Time*** — visible time control; `onchange` and `oninput` invoke `syncLoadTime()`; hidden `vehicleLoadDto.loadTime` carries the submitted value.
- **Loaded By*** — text input `vehicleLoadDto.loadedBy`.
- **Remarks** — optional text input `vehicleLoadDto.remarks`.
- **Cylinder picker** — lists available cylinders, supports serial search, refresh, pagination, add/remove, and creates hidden `vehicleLoadDto.loadLines[i].cylinder.cylinderId` inputs for selected lines.
- **For Customer Delivery*** — `vehicleLoadDto.quantityFullForDelivery`.
- **Buffer / Adhoc Supply*** — `vehicleLoadDto.quantityFullForBuffer`.
- **For Supplier Refill** — read-only `vehicleLoadDto.quantityEmptyForSupplier`, auto-synchronized to the selected EMPTY count.
- **Cancel** — navigates away without submitting.
- **Save Vehicle Load** — invokes `submitLoad()`.

The screen displays a server-side error banner when `errorMessage` is present.

## Browser events and dependent request identities

The page defines these source-proved request identities:

- cylinder-by-state API: `/cylindermanagement/search/cylinder/by-state`;
- cylinder-by-serial-and-state API: `/cylindermanagement/search/cylinder/by-serial-and-state`;
- vehicle type-ahead base: `/cylindermanagement/search/vehicle/`;
- driver type-ahead base: `/cylindermanagement/search/driver/`.

Vehicle and Driver text edits clear their previously selected hidden IDs. Each type-ahead waits 280 ms before issuing its request. Empty text closes the dropdown without a request. Vehicle results display vehicle number/type and propagate `vehicleId`; Driver results display driver name and propagate `driverId`. Request failures are logged and the dropdown is hidden rather than inventing a successful selection.

Cylinder selection is maintained client-side and each selected cylinder contributes a hidden request field named exactly `vehicleLoadDto.loadLines[i].cylinder.cylinderId`. The live summary tracks FULL, EMPTY and total counts.

## Purpose-distribution branch and validation

The page maintains three quantities:

- `quantityFullForDelivery`
- `quantityFullForBuffer`
- `quantityEmptyForSupplier`

`quantityEmptyForSupplier` is automatically synchronized to the selected EMPTY count. Editing Delivery recalculates Buffer as the remainder; editing Buffer recalculates Delivery as the remainder. `validateDistribution()` requires Delivery + Buffer to equal the total selected FULL cylinder count. When it does not, the page shows the distribution error and refuses submit.

## Client-side submit guards

`submitLoad()` refuses submission when any source-proved requirement fails:

- no selected vehicle ID;
- no selected driver ID;
- no selected cylinder line;
- blank Loaded By value;
- FULL purpose distribution does not balance.

On a distribution failure it reports the actual Delivery, Buffer and required FULL counts and scrolls the distribution section into view. When all guards pass, the submit spinner is activated and the form posts to `POST /vehicleLoad`.

## Adjacent POST behavior visible from this screen

The same controller binds the submitted form as `@ModelAttribute("vehicleLoad") UC02Phase01VehicleLoadRequestDto` and invokes `uc02Phase01VehicleLoadMediator.invokeServices(requestDto)`.

- success redirects to `/vehicle-loads/list`;
- `InvalidInputParameterException` redisplays `with-menu/Uc02-Phase01-VehicleLoadView`, preserves `vehicleLoad`, and exposes the exception message as `errorMessage`.

The registered work unit is the GET screen-entry story. The deeper POST mediator/service/DAO/database mutation is a separate registered mutation path and is not falsely attributed to this GET handler.

## Deepest applicable data path for this GET

The GET handler performs one explicit application lookup: `lookupDataCache.getVehicleLoadPurposes()`. The frozen controller evidence does not prove a direct repository/DAO/database access from this GET handler itself, and the returned local variable is not attached to the model. Therefore no database table identity is attributed to the registered GET operation without additional source proof.

## Strict completion decision

Strict field/UI completion is **PASS** for registered `GET /vehicleLoad`. Frozen controller/template source proves the blank/direct and redirect-preselected branches, exact form/model binding, visible controls, browser events, dependent request identities, hidden cylinder propagation, purpose-distribution rules, submit guards, adjacent POST handoff, success/error visibility and the deepest directly applicable GET-side application lookup.

No approval occurred; approval remains explicitly pending user approval.
