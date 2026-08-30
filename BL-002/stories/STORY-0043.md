# STORY-0043 — Vehicle Trip Load Wizard

- Release: R1
- Endpoint: `GET /wizard/vehicle-trip-load`
- Functional area: Vehicle Trip Load Wizard
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to open the combined Vehicle Trip + Load wizard through `GET /wizard/vehicle-trip-load` so that I can prepare a vehicle trip and its cylinder load in one guided form.

## Frozen-source contract proved in this run

### Request and controller

`VehicleTripLoadWizardController` is rooted at `@RequestMapping("/wizard/vehicle-trip-load")`; its `@GetMapping` `showWizard()` therefore owns the registered GET endpoint. The handler creates a blank `UC02Phase01VehicleLoadRequestDto`, initializes nested `VehicleTripDto` and `VehicleLoadDto`, fetches Vehicle Load Purposes from `LookupDataCache`, and renders `final-version-1/VehicleTripLoadWizard`.

The model is populated with:

- `wizardRequest` — the blank combined trip/load request DTO;
- `backLink` — `/vehicle-loads/list`;
- `purposes` — `lookupDataCache.getVehicleLoadPurposes()`;
- `totalProducts` — `lookupDataCache.getTotalProducts()`;
- `products` — `lookupDataCache.getProduct()`;
- active challan-book collections returned by `ActiveChallanBookForTripLoadViewJpaDao.findByBookType(...)` for `DELIVERY_CHALLAN`, `EMPTY_PICKUP_CHALLAN`, `FILLING_NOTE`, and `CUSTOMER_SPOT_CYLINDER_CHECK`.

### Screen / browser behavior

The exact Thymeleaf resource is `templates/final-version-1/VehicleTripLoadWizard.html`. Frozen template evidence proves a multi-step client-side wizard wrapped in one form. Step navigation is client-side; the final submission is the single POST `/wizard/vehicle-trip-load/save`. Binding paths include `vehicleTripDto.*`, `vehicleLoadDto.*`, and cylinder identities under `vehicleLoadDto.loadLines[n].cylinder.cylinderId`.

The template declares type-ahead/dependent browser requests for vehicle, driver, customer, customer-address, and cylinder-by-state lookups. The GET endpoint itself does not create a trip/load record; it supplies the blank model/reference data needed for the browser workflow.

### Reference-data/cache boundary

The controller obtains Vehicle Load Purposes and Products from `LookupDataCache`. The cache uses injected application services and lazy-reload behavior when its cached collections are empty. This proves the controller-to-cache/application-service boundary without attributing an unproved concrete repository implementation.

### Challan-book read boundary

The controller directly invokes the injected `ActiveChallanBookForTripLoadViewJpaDao.findByBookType(...)` four times with the exact book-type identities listed above. This is an explicit frozen-source JPA DAO boundary used to populate the initial screen.

## Exact remaining source-detail gap

Strict completion is deliberately **not** claimed. The frozen web source proves the endpoint, blank DTO/model setup, exact template, wizard/browser contract, cache lookups, and the exact challan-book DAO calls. However, the concrete source for `ActiveChallanBookForTripLoadViewJpaDao` and the concrete implementations behind the injected lookup application services are not present in the frozen repository tree available to this run. Therefore the DAO/view/table/column identity for active challan books and the downstream repository/entity/table identities for the cache-backed lookups cannot be source-proved without inventing implementation detail.

Until those downstream authoritative source artifacts are available, STORY-0043 remains `SOURCE_DETAIL_REVIEW_REQUIRED` and does not increase `strict_field_ui_complete`.

No behavior beyond frozen evidence is invented. No approval occurred.
