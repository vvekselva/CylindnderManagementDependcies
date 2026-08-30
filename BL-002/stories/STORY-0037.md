# STORY-0037 — Cylinder Delivery

- Release: R1
- Endpoint: `GET /cylinderDelivery`
- Functional area: Cylinder Delivery
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to open the Cylinder Delivery / Delivery Challan Entry screen so that I can enter challan details, select the customer, driver and vehicle, choose cylinders that are in transit on that vehicle, and prepare the delivery order for submission.

## Entry and server-side GET contract

`GET /cylinderDelivery` is handled by `Uc02Phase02CylinderDeliveryController.doGet()`.

The controller:

1. Creates a new `UC02Phase02CylinderDeliveryRequestDto`.
2. Creates a new empty `OrderDto` and sets it into the request DTO.
3. Returns Thymeleaf view `Uc02-Phase02-CylinderDeliveryView`.
4. Adds the request DTO to the model under the exact attribute name `cylinderDelivery`.

The GET handler does not invoke the application mediator, DAO, repository or database. It only prepares the blank page model. Therefore there is no persisted/read database identity for the GET request itself.

Frozen controller source:
`cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/web/controller/Uc02Phase02CylinderDeliveryController.java`

## Exact visible controls and model binding

The page is `cylindermanagement.web/src/main/resources/templates/Uc02-Phase02-CylinderDeliveryView.html` and posts back to `/cylinderDelivery` with model object `cylinderDelivery`.

The delivery form exposes these source-proved controls:

- **Challan Number*** — text input `challan-number`; submits `orderDto.challanNumber`.
- **Challan Date*** — date input `challan-date`; submits `orderDto.challanDate`; `onchange` calls `tryFetchCylinders()`.
- **Challan Type*** — type-ahead text `challan-type-text`; selected identity is propagated to hidden `challan-type-id` -> `orderDto.challanType.challanTypeId`.
- **Order Status*** — type-ahead text `order-status-text`; selected value is propagated to hidden `order-status-value` -> `orderDto.orderStatus`.
- **Driver*** — type-ahead text `driver-text`; selected ID is propagated to hidden `driver-id` -> `orderDto.driver.driverId`.
- **Vehicle*** — type-ahead text `vehicle-text`; selected ID is propagated to hidden `vehicle-id` -> `orderDto.vehicle.vehicleId`; selecting a vehicle re-evaluates the cylinder picker.
- **Remarks** — textarea `remarks`; submits `orderDto.remarks`.
- **Customer*** — type-ahead text `customer-text`; selected ID is propagated to hidden `customer-id` -> `orderDto.customer.customerId`.
- **Delivery Address** — select `address-select`; selected ID is copied to hidden `address-id` -> `orderDto.deliveryAddress.customerAddressId`.
- **In-Transit Cylinder search** — text input `cyl-search`; invokes a debounced cylinder lookup.
- **Cylinder Add/Remove controls** — selected cylinder rows are converted into hidden fields `orderDto.orderLines[i].cylinder.cylinderId` and `orderDto.orderLines[i].quantity`.
- **Cancel** — navigates to `/orderList?pageNumber=1&itemsPerPage=10`.
- **Save Delivery Order** — button invokes `submitOrder()`.
- Hidden timestamps `orderDto.createdAt` and `orderDto.updatedAt` are initialized on page load and refreshed before submit.

## Browser events and dependent request identities

On `DOMContentLoaded`, the page sets the current date into Challan Date when it is empty and initializes created/updated timestamps.

Type-ahead controls clear their previously selected hidden identity when the user edits the visible text. They use a 280 ms debounce before their lookup requests:

- Vehicle: `GET /search/vehicle/{term}`.
- Driver: `GET /search/driver/{term}`.
- Customer: `GET /search/customer/{term}`.
- Challan type: `GET /search/challantype/{term}`.
- Order status: `GET /search/orderstatus/{term}`; if that lookup fails, the page shows an inline fallback list filtered from `DELIVERED`, `DRAFT`, `PENDING`, `PARTIALLY_DELIVERED`, `CANCELLED`.

After a Customer is selected, the page calls `GET /search/address/customer/{customerId}` and populates the Delivery Address select. Changing the customer first clears the existing customer/address hidden IDs and hides the address selector until new addresses are loaded.

The in-transit picker is gated by **both** `vehicle-id` and `challan-date`. If either is absent, no cylinder API call is made. Once both exist, the picker becomes visible and calls:

- `POST /search/cylinder/in-transit` for normal paging.
- `POST /search/cylinder/in-transit/by-serial` when a non-empty serial search term is present.

The exact JSON search payload contains:

- `serachQueryData.VECHILE_ID` = selected vehicle ID.
- `serachQueryData.DELIVERED_DATE` = challan date.
- `serachQueryData.CYLINDER_SERIAL_NUMBER` only for serial search.
- `searchTermRequiredForFiltering: false`.
- `pageNumber` = one-based page number.
- `itemsPerPage: 10`.

Cylinder serial search is debounced by 350 ms. Pagination reuses the same fetch function. A failed cylinder fetch shows `Failed to load cylinders — check console.`; an empty successful result shows `No in-transit cylinders found for this vehicle & date.`

## Selection and hidden propagation

Adding a cylinder is idempotent by `cylinderId`: the page keeps an `addedIds` set and will not add the same cylinder twice. The selected row is added to `orderLines`, shown in the table, and represented in the submitted form by:

- `orderDto.orderLines[i].cylinder.cylinderId`
- `orderDto.orderLines[i].quantity`

Removing a line deletes the cylinder ID from `addedIds`, removes the array element, regenerates the hidden line fields and re-enables the Add control in the picker when that item is still displayed.

## Client-side submit guards

`submitOrder()` refuses form submission and displays an alert containing all failed checks when any of these source-proved requirements is missing:

- Challan Number.
- Challan Date.
- Challan Type ID.
- Customer ID.
- Driver ID.
- Vehicle ID.
- At least one selected cylinder.

Delivery Address, Remarks and Order Status are not included in this JavaScript required-field guard. No additional requiredness is invented.

If the guards pass, the page refreshes the created/updated timestamps, activates the submit spinner and submits the form to `POST /cylinderDelivery`.

## Adjacent POST behavior visible from this screen

The same controller binds the submitted form as `@ModelAttribute("cylinderDelivery") UC02Phase02CylinderDeliveryRequestDto` and invokes `uc02Phase02CylinderDeliveryMediator.invokeServices(requestDto)`.

- Success redirects to `/orderList?pageNumber=1&itemsPerPage=10`.
- `InvalidInputParameterException` redisplays `Uc02-Phase02-CylinderDeliveryView`, preserves the submitted request DTO and exposes the exception message as `errorMessage`, which the page renders in the server-side error banner.

The registered work unit is the GET screen-entry story. Deeper POST mediator/service/DAO/database persistence is a separate mutation path and is not falsely attributed to the GET handler.

## Strict completion decision

Strict field/UI completion is **PASS** for registered `GET /cylinderDelivery`: the frozen source proves the exact page model, controls, browser events, hidden propagation, dependent request identities, picker gates, client validation, visible empty/error behavior and adjacent form-submit handoff. The GET itself performs no service/DAO/database access, so no database path is applicable to this GET work unit.

No approval occurred; approval remains explicitly pending user approval.
