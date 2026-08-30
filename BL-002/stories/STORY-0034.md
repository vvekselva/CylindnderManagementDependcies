# STORY-0034 — Customer spot cylinder check submit

- Round: R2
- Controller: `CustomerSpotCylinderCheckController`
- Endpoint: `POST /customer-spot-cylinder-check/submit`
- Status: STRICT_FIELD_UI_COMPLETE
- Strict field/UI complete: YES
- Frozen source: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

A user records a customer spot cylinder check for a vehicle load. The screen is a validation-only entry: it records what cylinders were physically observed at the selected customer and compares those serials with the system’s current customer-custody view. It does **not** create a customer holding, transfer a cylinder, or change cylinder custody/state. On a valid submission it saves a spot-check header and its observed lines, consumes the selected assigned challan sheet, and creates the challan-to-spot-check transaction link.

## Source-proved UI and request contract

Entry page is `final-version-1/CustomerSpotCylinderCheck`. The form posts to `/customer-spot-cylinder-check/submit` using model attribute `spotCheckRequest`.

Hidden propagation: `customerSpotCylinderCheckDto.vehicleLoadId` and `customerSpotCylinderCheckDto.vehicleTripId` are posted as hidden fields.

Visible controls: required numeric `customerId`; optional numeric `customerAddressId`; optional text `checkedBy`; required `challanBookId` select populated from `activeSpotCheckBooks`; required numeric `sheetNumber` with HTML `min=1`; optional `remarks`; and line entries containing `observedCylinderSerial` plus `observedCondition` (`FULL` or `EMPTY`). The GET/failure path ensures at least 10 line rows.

The submit button is `Submit Spot Check`; browser-native required/min constraints apply to customer, book and sheet controls. No source-proved debounce, type-ahead endpoint, dependent browser API call, or JavaScript enable/disable predicate exists in this template.

## Controller contract

Spring binds the posted form into `CustomerSpotCylinderCheckRequestDto` via `@ModelAttribute("spotCheckRequest")`. The controller invokes `customerSpotCylinderCheckService.submitSpotCheck(requestDto)`.

On success, the returned `CustomerSpotCylinderCheckDto` is placed into a fresh request wrapper and the same page is rendered with: `Customer spot cylinder check saved and validated successfully.` Active spot-check books are reloaded using the vehicle-load id.

On `CylinderManagementApplicationException`, the posted DTO is retained, entry rows are padded to 10 if needed, and the same page displays: `Customer spot cylinder check failed. Verify trip/load, assigned spot-check book, unused sheet number, customer and serials.`

## Exact service guards

`CustomerSpotCylinderCheckService.submitSpotCheck` is `@Transactional`.

Submission is rejected when the request wrapper or nested spot-check DTO is null. The header is rejected when any of these are missing: `vehicleLoadId`, `customerId`, `challanBookId`, `sheetNumber`, or the lines collection. An empty lines collection is also rejected. The selected customer must exist according to `CustomerJpaDao.existsById(customerId)`.

The selected challan book is valid only if it appears in `findActiveSpotCheckBooksForLoad(vehicleLoadId)`, which queries the trip-challan-book assignment view for the same vehicle load, book type `CUSTOMER_SPOT_CYLINDER_CHECK`, and `activeAssignment=true`; the submitted `challanBookId` must match one of those active assigned books.

The submitted sheet number must be between that assignment’s `startSheetNumber` and `endSheetNumber`. The physical page is then loaded by exact `bookId + sheetNumber` from `public.tbl_challan_page_audit_ledger`; the page must exist and its status must be exactly `UNUSED`.

`customerAddressId` and `vehicleTripStopId` are persisted when supplied, but this service contains no additional source-proved existence validation for either field. `vehicleTripId` persisted on the spot-check header comes from the resolved assigned-book record, not from trusting the posted hidden trip id.

Blank/null line objects or lines with blank serials are skipped. After skipping blanks, at least one persisted line must remain or the submission is rejected.

## Exact line validation and result derivation

Serial comparison normalizes by trim + uppercase. The saved observed serial is trimmed.

For each nonblank line:

1. If the normalized serial already appeared in the same submission, the line becomes `DUPLICATE_IN_CHECK` with message `Serial is repeated in the same spot-check entry.`
2. Otherwise the cylinder is looked up with `CylinderJpaDao.findByCylinderSerialIgnoreCase(trimmedSerial)`. If absent, the line becomes `UNKNOWN_CYLINDER` with message `Cylinder serial is not available in the system.`
3. If the cylinder exists, its `cylinderId` is stored as `matchedCylinderId`.
4. Current customer custody is read from the immutable `public.vw_cylinders_at_customers` view using the selected `customerId`. The normalized serial must appear in that customer’s active custody rows.
5. If not held by that customer, status becomes `NOT_HELD_BY_CUSTOMER`, `expectedCustomerId` is set to the selected customer, and the message is `Cylinder exists, but is not actively held by the selected customer.`
6. If held, `expectedCustomerId` and `expectedSystemState` are copied from the custody view; status becomes `MATCHED` with message `Observed serial matches active customer holding. No custody records were changed.`

The UI supplies only `FULL` or `EMPTY`. The service normalizes the value; `EMPTY` remains `EMPTY`, otherwise the persisted condition is `FULL`.

Header counts are derived from the persisted line conditions: `fullCountObserved`, `emptyCountObserved`, and their sum `totalCountObserved`. Any line status other than `MATCHED` increments the variance count. Header `systemValidationStatus` is `MATCHED` when variance count is zero. If variances exist, duplicate serial has precedence (`DUPLICATE_SERIAL`), then unknown cylinder (`UNKNOWN_CYLINDER`), otherwise `VARIANCE`.

## DTO → entity → database persistence

A new `CustomerSpotCylinderCheckDo` is built with:

- `vehicleTripId` from the resolved assigned book
- posted `vehicleLoadId`
- posted optional `vehicleTripStopId`
- posted `customerId`
- posted optional `customerAddressId`
- assigned `bookId`
- resolved page `pageAuditId`
- posted `sheetNumber`
- posted `checkedAt`, or `LocalDateTime.now()` when null
- optional `checkedBy`
- optional `remarks`
- `entryStatus = SUBMITTED`
- derived counts and `systemValidationStatus`

`CustomerSpotCylinderCheckJpaDao.save(headerDo)` persists the header to `public.tbl_customer_spot_cylinder_check`. Its identity is `pk_customer_spot_check_id` using identity generation. Exact mapped columns include `fk_vehicle_trip`, `fk_vehicle_load`, `fk_vehicle_trip_stop`, `fk_customer`, `fk_customer_address`, `fk_challan_book`, `fk_page_audit_id`, `sheet_number`, `checked_at`, `checked_by`, `entry_status`, `system_validation_status`, `full_count_observed`, `empty_count_observed`, `total_count_observed`, `remarks`, `created_at`, and `updated_at`.

The header owns a `CascadeType.ALL` one-to-many collection. Each `CustomerSpotCylinderCheckLineDo` therefore persists with the header into `public.tbl_customer_spot_cylinder_check_line`, keyed by `pk_customer_spot_check_line_id` and linked by `fk_customer_spot_check`. Persisted line fields include observed serial, matched cylinder id, observed condition, expected system state/customer, line validation status/message, and timestamps.

## Challan sheet mutation and transaction link

After the spot-check header/lines are saved, the resolved physical page in `public.tbl_challan_page_audit_ledger` is updated by primary key `pk_page_audit_id`: `page_status` becomes `USED_CONFIRMED`, `status_changed_at` becomes the current timestamp, and remarks become `Used for customer spot cylinder check id=<saved spot-check id>`.

The service then inserts one row into `public.tbl_challan_transaction_link` with `fk_page_audit_id`, `linked_business_job_type='CUSTOMER_SPOT_CYLINDER_CHECK'`, the saved spot-check id as `fk_linked_business_job_id`, and the current timestamp as `linked_at`.

These operations occur inside the `@Transactional` `submitSpotCheck` service boundary. No service statement writes to the cylinder-custody view or changes cylinder state/custody; custody is read only for validation.

## Response and visible outcome

The saved entity is mapped back to `CustomerSpotCylinderCheckDto`, including generated spot-check/header id, vehicle/trip/load/customer/book/page identities, sheet, check metadata, statuses/counts/remarks, and every persisted line’s generated id, observed serial/condition, matched cylinder, expected customer/state, validation status, and validation message. Response code is set to application `SUCCESS`.

The controller renders the same screen with the success message and reloads active spot-check books. On a governed application-validation exception it renders the same screen with the original entered values and the verification error message.

## Strict completion evidence

Strict field/UI contract is complete from frozen source: screen intent and fields → form binding → controller → transactional service → exact header/book/page/customer/serial guards → custody lookup → line/header status derivation → JPA entities/tables/columns → challan page mutation → transaction-link insertion → mapped response → visible success/error outcome are all source-proved. No custody/state mutation is inferred or performed by this flow.
