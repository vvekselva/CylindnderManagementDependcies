# STORY-0043 — Vehicle Trip Load Wizard

- Release: R1
- Endpoint: `GET /wizard/vehicle-trip-load`
- Functional area: Vehicle Trip Load Wizard
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_AFTER_REWORK
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Business-behavior rework: COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to open the combined Vehicle Trip + Load wizard so that I can prepare the trip, choose the vehicle/driver/customer and dependent customer address, select cylinders and their load-purpose distribution, choose the four required physical challan books with starting unused pages, and finally submit one combined trip/load transaction.

## GET page preparation

`VehicleTripLoadWizardController` handles `GET /wizard/vehicle-trip-load`. It creates a fresh `UC02Phase01VehicleLoadRequestDto` with nested `VehicleTripDto` and `VehicleLoadDto`, then renders `final-version-1/VehicleTripLoadWizard`.

The model contains `wizardRequest`, `/vehicle-loads/list` as the back link, Vehicle Load Purposes, product reference data and four active challan-book collections for `DELIVERY_CHALLAN`, `EMPTY_PICKUP_CHALLAN`, `FILLING_NOTE` and `CUSTOMER_SPOT_CYLINDER_CHECK`.

The GET itself does not create a trip or load. It prepares the data required for the multi-step browser workflow.

## Reference-data reads

`LookupDataCache` supplies Vehicle Load Purpose and Product reference data. The cache is populated at application startup and lazily reloads an empty cached list through the corresponding application service.

`VehicleLoadPurposeFetchAllService` reads `VehicleLoadPurposeJpaDao.findAll()` and maps `VehicleLoadPurposeDo`. `VehicleLoadPurposeDo` maps `public.tbl_vehicle_load_purpose`, primary key `pk_load_purpose_id`, with unique `load_purpose` and `description`.

`ProductFetchByPageService` reads `ProductJpaDao` and maps `ProductDo`. `ProductDo` maps `public.tbl_product`, primary key `pk_product_id`, including `product_name`, `description`, tax-rate fields and product-category/UOM relationships.

A current-source limitation is retained: when `ProductFetchByPageService` receives a nonblank search term it still executes `productJpaDao.findAll(pageable)`; the source comment says filtered DAO support is intended later. It also caps the page size at 10. Therefore this cache path is not falsely described as a fully filtered fetch-all product search.

## Physical challan-book choices

The controller directly reads `ActiveChallanBookForTripLoadViewJpaDao.findByBookType(...)` for each of the four required book types.

The DAO is a Spring Data repository over immutable `ActiveChallanBookForTripLoadViewDo`, which maps `public.vw_active_challan_books_for_trip_load`. The view exposes the exact business data used to choose an office book: `book_id`, `book_code`, `book_type`, `series_prefix`, physical start/end sheet numbers, current location, assigned vehicle identity, unused/used/spoiled/missing counts and `next_available_sheet_number`.

## Browser workflow and selectors

The exact template is a client-side multi-step wizard inside one final form. Step navigation does not persist the trip/load. The final server submission is `POST /wizard/vehicle-trip-load/save`.

The page uses source-proved search/dependent behavior for Vehicle, Driver, Customer, Customer Address and cylinders. Customer Address is dependent on the selected Customer; cylinder selection is state/search driven. The four challan-book controls are populated from the active-book view rather than an unconstrained master list.

The request carries `vehicleTripDto.*`, `vehicleLoadDto.*`, selected cylinder identities under `vehicleLoadDto.loadLines[n].cylinder.cylinderId`, the four challan-book IDs and their four starting unused sheet numbers.

## Embedded Save capability

Although this registered Story is the GET entry screen, the page's business purpose includes the final Save operation. Its exact mutation is source-bound in related STORY-0044.

The final Save invokes the transactional `VehicleLoadAndTripIngestionService`. That service validates the Vehicle Trip, Vehicle Load and all four physical challan-book selections; creates the trip initially in Started state; creates the load and load lines; records a `YARD_START` stop; changes the trip to Loaded; creates four `public.tbl_trip_challan_book_assignment` rows with the selected starting sheet numbers; creates an OPEN cylinder logistics execution and active logistics lines; and deactivates the selected cylinders' former active Yard Inventory lines.

Thus the user is not merely filling a temporary screen: the completed wizard is designed to establish the trip/load, allocate physical challan books and move cylinder operational custody from Yard to vehicle logistics when the final Save succeeds.

## Current-source gaps retained for review

- The Product cache/fetch service does not implement the filtered Product DAO query suggested by its own comment; it currently performs paged `findAll` even with a search term.
- The Product fetch service caps a request page at 10, so the cache's apparent fetch-all request does not prove all Products are loaded in a single call.
- Code-level validation defects found in the related final Save path remain documented in STORY-0044 and are not automatically repaired by this GET Story.

No application code is changed by Story rework. Any future Story/code drift correction must present the exact Drift / Code Change Manifest and receive explicit user approval before BL-010 work or source mutation.

## Review and approval gate

The previously unresolved active-challan-book DAO/view identity and cache-backed Product/Vehicle Load Purpose read identities are now source-bound. Together with the source-bound embedded Save behavior, STORY-0043 is `APPROVED_AFTER_REWORK` by explicit user approval on 2026-09-04, with testing fan-out requested. Strict source enrichment remains complete. This approval covers the GET wizard-entry contract; related STORY-0044 mutation drift remains independently governed and is not authorized by this approval.
