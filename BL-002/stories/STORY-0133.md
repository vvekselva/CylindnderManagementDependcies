# STORY-0133 — New Vehicle Trip Screen

- Release: R1
- Endpoint: `GET /addVechileTrip`
- Controller: `VehicleTripIngestionController.doGet`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Screen entry / server contract
`@GetMapping("/addVechileTrip")` creates empty `VehicleTripDto`, wraps it in `VehicleTripIngestionRequestDto`, renders `with-menu/VehicleTripIngestion`, exposes it as `tripRequest`, and exposes `backLink=/vehicle-loads/list`. This GET performs no persistence write.

## Exact visible controls and browser behavior
The screen requires Vehicle, Driver, Starting Date & Time, Customer and Delivery Address. Vehicle/driver/customer are search inputs; address remains dependent on customer. Search input events call `handleSearch`. Blank trimmed search performs no API call. Nonblank search shows a spinner and uses a 350 ms debounce before calling the applicable endpoint: `/cylindermanagement/search/vehicle/{q}`, `/search/driver/{q}`, `/search/customer/{q}`. Address uses `/search/address/customer-address/{customerId}` and is also loaded immediately after customer selection/focus.

Selecting a result stores the full selected object in JS state, hides the text input and displays a selected chip. Customer selection invalidates any previous address, enables address search and immediately loads that customer's addresses. Clearing Customer clears/invalidate Address and disables address search again. Clearing other selections restores their search input. Search failures display `Search failed. Please try again.`.

Starting Date & Time is `datetime-local`, initialized to current local time and constrained with `min` equal to now. Its input updates the trip-reference preview.

## Local validation / hidden propagation
Create Trip invokes `validate()`. Missing Vehicle, Driver, starting time, Customer, or Address marks the field invalid and prevents submit with `Please fill in all required fields`.

On valid submit the browser copies selected identities into the hidden Spring form with exact names: `vehicleTripDto.vehicle.vehicleId`, `vehicleTripDto.vehicle.vehicleNumber`, `vehicleTripDto.driver.driverId`, `vehicleTripDto.driver.driverName`, `vehicleTripDto.startingTime`, `vehicleTripDto.customerDto.customerId`, and `vehicleTripDto.customerAddress.customerAddressId`. The datetime-local value is reduced to its HH:mm component before assigning `vehicleTripDto.startingTime`. The form POSTs to `/addVechileTrip` and shows a Creating Vehicle Trip loading overlay. Cancel asks for confirmation and navigates browser history back only when confirmed.

## Outcome boundary
The GET itself only prepares and displays the form. Persistence belongs to STORY-0134 POST. No approval occurs.
