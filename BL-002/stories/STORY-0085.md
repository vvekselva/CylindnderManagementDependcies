# STORY-0085 — Delivery Stop

- Release: R1
- Endpoint: `POST /stop`
- Register controller group: `Delivery Stop`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source field contract: STRICT_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Screen entry and intent
The governed customer-stop path is entered through `GET /add-stop?vehicleLoadId=<id>&actionType=CustomerStop`. `AddStopController` first reads the trip status for the vehicle load. Office challan entry is allowed only when status is `Returned` or `Proceeding`; otherwise it redirects to `/vehicle-load/fetch?vehicleLoadId=<id>` with the error that the trip must be marked Returned. CustomerStop renders `with-menu/Customerstopselectionpage-withoutAutoChallanUpdate` and loads assigned `DELIVERY_CHALLAN` and `EMPTY_PICKUP_CHALLAN` book/page windows.

## Customer selection contract
Visible control: `#custSearch` (Customer Name). Browser `input` clears the previous timer, trims text, and does nothing until at least 3 characters are present. At >=3 characters it debounces for 280 ms then calls `GET /cylindermanagement/search/customer/{encoded query}`. Results use `customerDtos`; selecting a row captures the exact `customerId` and customer name. The selected ID propagates to hidden field `vehicleTripStop.customer.customerId`. Clearing the customer clears customer/address IDs and hides downstream address/exchange sections.

## Address contract
After customer selection the browser calls `GET /cylindermanagement/search/address/customer-address/{customerId}`. Response `customerAddressDtos` is rendered as selectable address cards. Clicking a card writes `customerAddressId` to hidden field `vehicleTripStop.deliveryAddress.customerAddressId`, updates submit eligibility, and starts exchange loading.

## Cylinder exchange contract
The frozen UI makes two dependent calls after address selection:
- Vehicle stock: `POST /cylindermanagement/search/cylinder/on-vehicle`, JSON includes `state:'FULL'`, `MULTIPLE_STATE_SEARCH:'TRUE'`, `CUSTOMER_STOP:'TRUE'`, `STATES:['FULL']`, `VEHICLE_LOAD_ID:<LOAD_ID>`, page 1 / 50. Returned `cylinderDtos` become delivery checkboxes.
- Customer holdings: `POST /cylindermanagement/search/cylinder/by-customer`, JSON includes `state:'FULL'`, `MULTIPLE_STATE_SEARCH:'TRUE'`, `STATES:['EMPTY','FULL']`, `CUSTOMER_ID:<customerId>`, page 1 / 50. Returned `cylinderDtos` become pickup checkboxes.

Selecting delivery rows materializes repeated hidden `fullCylinderIdForDelivery=<cylinderId>` inputs. Selecting pickup rows materializes repeated hidden `emptyCylinderIdForYard=<cylinderId>` inputs. At least one movement from either list is required by the client submit guard.

## Challan and photo contract
The stop form posts to `/cylindermanagement/stop` and carries `vehicleStopType=CUSTOMER_STOP`, `vehicleTripStop.vehicleLoad.vehicleLoadId`, customer/address IDs, `challanLeaf.bookCode`, `challanLeaf.seriesPrefix`, `challanLeaf.challanNumber`, `challanLeaf.challanType`, `challanPhotoUploaded`, and the selected cylinder IDs.

Challan type is a radio choice: `DELIVERY` or `EMPTY`. The corresponding first assigned trip book supplies book code/prefix and current/page-window values. Selecting/changing a challan page synchronizes the hidden book fields and resets the previously uploaded-photo state. The photo-upload button is enabled only when challan number, assigned book and selected file all exist. AJAX upload posts multipart fields `vehicleLoadId`, `actionType=CustomerStop`, `challanType`, `bookCode`, `seriesPrefix`, `sheetNumber`, and required `challanPhoto` to `/add-stop/challan-page-photo/upload-ajax`. Successful JSON records `challanPagePhotoId`, file name and photo URL; deletion posts `challanPagePhotoId` to `/add-stop/challan-page-photo/delete-ajax` and invalidates photo readiness.

## Complete-button and browser guard
`Complete Customer Stop` remains disabled unless all five predicates are true: selected customer, selected address, at least one cylinder movement, nonblank challan number plus assigned book code, and an uploaded challan photo ID. The form submit listener recomputes these conditions and prevents submission if disabled. Visible guidance identifies the first missing requirement.

## Controller binding and guards
`CustomerStopSelectionController.processStopIngestion` binds the form into `VehicleTripStopIngestionRequestDto` and separately binds optional `challanPhotoUploaded` with default `false`. For CUSTOMER_STOP the controller requires the photo flag; if absent/false it redirects back to `/add-stop?vehicleLoadId=<id>&actionType=CustomerStop`. It maps the request stop type through `LookupDataCache.getStopTypeParserMap()` into `vehicleTripStop.vehicleTripStopType.stopType`, then calls `vehicleTripStopIngestionService.processRequest(requestDto)`. A `CylinderManagementApplicationException` is logged by the controller; terminal navigation still redirects to `/vehicle-load/fetch?vehicleLoadId=<id>`.

## Service / DAO / persistence contract
`VehicleTripStopIngestionService.processRequest` is transactional and first invokes `vehicleStopIngestionRequestValidator`. It resolves the `VehicleLoadDo` by the submitted vehicle-load ID, derives the next stop sequence, resolves the persisted stop type, and for persisted `CUSTOMER_DELIVERY` resolves `CustomerDo` by submitted customer ID and `CustomerAddressDo` by submitted address ID.

For each selected full delivery cylinder it creates an `OrderDo` (`DELIVERED`) tied to customer, address, vehicle load and trip, saves it through `OrderJpaDao`, creates explicit `OrderLineDo` rows through `OrderLineJpaDao`, and completes the active logistics line only from allowed states `FULL_PICKED_UP_FOR_DELIVERY` or `FULL_PICKED_FROM_SUPPLIER`. For each selected customer pickup cylinder it creates/saves `EmptyPickupDo`, explicit `EmptyPickupLineDo` rows, resolves each `CylinderDo`, and creates an active logistics line in `EMPTY_IN_TRANSIT_TO_YARD`.

The stop is persisted as `VehicleTripStopDo` with `stopStatus='ARRIVED'`; the associated vehicle trip is changed to `Proceeding` if it is not already, then saved. The service saves the trip stop and consumes/links the supplied challan when present. It returns `CylinderManagementApplicationResponseCode.SUCCESS` in `VehicleTripStopIngestionResponseDto`.

## Exact persisted/read identity
Source-proved persistence identities are the submitted `vehicleLoadId`, selected `customerId`, selected `customerAddressId`, selected cylinder IDs, generated order/empty-pickup headers and lines, vehicle-trip stop sequence/type/status, vehicle trip status, logistics lines, and governed challan page/link identity. These paths are through the named JPA DAOs/entities above; no table name is inferred where the frozen source excerpt does not itself prove it.

## Reset / invalidation and visible outcome
Changing challan number/type can invalidate uploaded-photo readiness. Clearing customer clears address and downstream exchange state. Selecting a new customer/address reloads dependent data. Successful stop processing returns the operator to vehicle-load details for the same vehicle load; missing required photo returns to Customer Stop. Search/address/exchange failures are rendered in their respective UI areas, while controller-caught service failure is logged and returns to vehicle-load details.

## Approval boundary
Strict field/UI enrichment is complete from frozen source. This is **not** user approval. Approval remains `PENDING_USER_APPROVAL` and no testing/use-case readiness is inferred.
