# STORY-0034 — Customer spot cylinder check submit

- Round: R2
- Controller: `CustomerSpotCylinderCheckController`
- Endpoint: `POST /customer-spot-cylinder-check/submit`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0034-local-source-business-behavior-20260902-1646.yaml`

## Human-readable story

A user records a customer spot cylinder check for a vehicle load. The screen is a validation-only entry: it records what cylinders were physically observed at the selected customer and compares those serials with the system’s current customer-custody view. It does **not** create a customer holding, transfer a cylinder, or change cylinder custody/state. On a valid submission it saves a spot-check header and its observed lines, consumes the selected assigned challan sheet, and creates the challan-to-spot-check transaction link.

## Source-proved UI and request contract

Entry page is `final-version-1/CustomerSpotCylinderCheck`. The form posts to `/customer-spot-cylinder-check/submit` using model attribute `spotCheckRequest`.

Hidden propagation: `customerSpotCylinderCheckDto.vehicleLoadId` and `customerSpotCylinderCheckDto.vehicleTripId` are posted as hidden fields.

Visible controls: required numeric `customerId`; optional numeric `customerAddressId`; optional text `checkedBy`; required `challanBookId` select populated from `activeSpotCheckBooks`; required numeric `sheetNumber` with HTML `min=1`; optional `remarks`; and line entries containing `observedCylinderSerial` plus `observedCondition` (`FULL` or `EMPTY`). The GET/failure path ensures at least 10 line rows.

The submit button is `Submit Spot Check`; browser-native required/min constraints apply to customer, book and sheet controls. No source-proved debounce, type-ahead endpoint, dependent browser API call, or JavaScript enable/disable predicate exists in this template.

## Controller and service contract

Spring binds the posted form into `CustomerSpotCylinderCheckRequestDto` via `@ModelAttribute("spotCheckRequest")`. The controller invokes `customerSpotCylinderCheckService.submitSpotCheck(requestDto)`.

`CustomerSpotCylinderCheckService.submitSpotCheck` is `@Transactional`. It requires the wrapper/nested DTO, vehicleLoadId, customerId, challanBookId, sheetNumber and a non-empty line collection. The selected customer must exist. The selected challan book must be an active `CUSTOMER_SPOT_CYLINDER_CHECK` assignment for the vehicle load, the submitted sheet must fall within the assigned range, and the physical challan page must exist with status exactly `UNUSED`.

Blank line objects or blank serials are skipped; at least one persisted line must remain. Serials are normalized with trim + uppercase for comparison. Duplicate submitted serials become `DUPLICATE_IN_CHECK`; unknown cylinders become `UNKNOWN_CYLINDER`; cylinders not actively held by the selected customer become `NOT_HELD_BY_CUSTOMER`; matching active customer custody becomes `MATCHED`. Customer custody is read for validation only and is not mutated.

Header counts and overall system-validation status are derived from persisted line conditions/statuses. The header and line entities persist to `public.tbl_customer_spot_cylinder_check` and `public.tbl_customer_spot_cylinder_check_line`. After save, the selected physical challan page is updated to `USED_CONFIRMED`, and a `public.tbl_challan_transaction_link` row is inserted with linked business job type `CUSTOMER_SPOT_CYLINDER_CHECK`.

On success the same page renders `Customer spot cylinder check saved and validated successfully.` and reloads active spot-check books. On governed application failure the posted DTO is retained/padded and the same page renders the source-proved verification failure message.

## Completion and approval gate

The recovered governed ZIP independently confirms the full UI → controller → transactional validation → customer-custody read → header/line persistence → challan-page consumption → transaction-link path, while also confirming that cylinder custody/state is not changed by this flow. STORY-0034 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
