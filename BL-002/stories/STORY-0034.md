# STORY-0034 — Customer spot cylinder check submit

- Round: R2
- Controller: `CustomerSpotCylinderCheckController`
- Endpoint: `POST /customer-spot-cylinder-check/submit`
- Status: SOURCE_DETAIL_REVIEW_REQUIRED
- Strict field/UI complete: NO
- Frozen source: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Source-proved UI and request contract

Entry page is `final-version-1/CustomerSpotCylinderCheck`. It is a validation-only entry and explicitly states that it does not create customer holding or move cylinders. The form posts to `/customer-spot-cylinder-check/submit` using model attribute `spotCheckRequest`.

Hidden propagation: `customerSpotCylinderCheckDto.vehicleLoadId` and `customerSpotCylinderCheckDto.vehicleTripId` are posted as hidden fields.

Visible controls: required numeric `customerId`; optional numeric `customerAddressId`; optional text `checkedBy`; required `challanBookId` select populated from `activeSpotCheckBooks`; required numeric `sheetNumber` with HTML `min=1`; optional `remarks`; and line entries containing `observedCylinderSerial` plus `observedCondition` (`FULL` or `EMPTY`). The GET/failure path ensures at least 10 line rows.

The submit button is `Submit Spot Check`; browser-native required/min constraints apply to customer, book and sheet controls. No source-proved debounce, type-ahead endpoint, dependent browser API call, or JavaScript enable/disable predicate exists in this template.

## Controller behavior

Spring binds the posted form into `CustomerSpotCylinderCheckRequestDto` via `@ModelAttribute("spotCheckRequest")`. The controller invokes `customerSpotCylinderCheckService.submitSpotCheck(requestDto)`.

On success, the returned `CustomerSpotCylinderCheckDto` is placed into a fresh request wrapper and the same page is rendered with: `Customer spot cylinder check saved and validated successfully.` Active spot-check books are reloaded using the vehicle load id.

On `CylinderManagementApplicationException`, the posted DTO is retained, entry rows are padded to 10 if needed, and the same page displays: `Customer spot cylinder check failed. Verify trip/load, assigned spot-check book, unused sheet number, customer and serials.`

The page states that only the Customer Spot Cylinder Check book assigned to the vehicle load is valid and that the selected sheet is marked used after successful validation.

## Remaining source-detail gap

Strict completion is withheld until the frozen authoritative service/DAO/entity/database implementation behind `CustomerSpotCylinderCheckService.submitSpotCheck` is traced. Required remaining proof: exact service guard predicates for trip/load/book/sheet/customer/serial validation; DTO-to-entity mapping; exact persisted tables/identities including sheet-use mutation; transaction behavior; and line validation result derivation. No behavior beyond the controller/template evidence above is inferred.
