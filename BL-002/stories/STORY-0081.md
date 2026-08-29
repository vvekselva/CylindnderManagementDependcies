# STORY-0081 — Submit Supplier Registration

- Release: R1
- Endpoint: `POST /ingestSupplier`
- Controller: `SupplierIngestionController.doPost`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an operator, I can submit the Register Supplier form. Spring binds the visible and hidden supplier fields into `SupplierIngestionRequestDto`; the controller sends that DTO through the typed application service for validation and persistence. A successful request redirects using the configured home/list link. Validation failures re-render the same form with the validator-annotated DTO so field and card error messages are visible.

## Exact request/binding contract

Form: `POST /ingestSupplier`, model attribute `supplier`. Bound paths are `supplierDto.supplierName`, `supplierDto.gstNumber`, `supplierDto.phoneNumber.phoneNumber`, `supplierDto.address.addressLine1`, `addressLine2`, `addressLine3`, `landmark`, plus selected `city.cityId/cityName`, `state.stateId/stateName`, and `country.countryId/countryName`. City/state/country IDs/names are populated by the autocomplete selection logic; CSRF hidden name/value is included when available. GST input is capped at 15 characters and uppercased on browser input.

## Controller/service path

`SupplierIngestionController.doPost(@ModelAttribute("supplier") SupplierIngestionRequestDto requestDto)` calls `ICylinderManagementApplicationService<SupplierIngestionRequestDto,SupplierIngestionResponseDto>.processRequest(requestDto)`. The controller documentation and flow identify this mediator as validation → service → persistence. No deeper repository/table identity is invented where it is not exposed by the inspected source.

## Branches and visible outcome

- Success: `processRequest` returns; controller logs success and returns `new ModelAndView("redirect:" + ViewConstants.REDIRECT_HOME_LINK)` (Post/Redirect/Get).
- `InvalidInputParameterException`: when its attached application DTO is exactly `SupplierIngestionRequestDto`, the controller copies the validator-annotated `supplierDto` back to the bound request. It then renders `with-menu/SupplierIngestion` with `supplier=requestDto` and `backLink=ViewConstants.REDIRECT_HOME_LINK`.
- The template displays DTO validation errors, including card-level error counts/strips and field-level messages resolved from error codes. Supplier-name error code `SUPPLIER_INGESTION_VALIDATION_SUPPLIER_NAME_INVALID` is explicitly handled; GST handles `...GST_NUMBER_NULL`, `...GST_NUMBER_INVALID`, and `...GST_NUMBER_ALREADY_EXISTS`.
- `CylinderManagementApplicationException`: stack trace is printed and the same form is re-rendered with the submitted request and back link; no custom visible global message is proved by the controller.

## Reset/invalidation behavior

On validation failure the submitted DTO is retained/re-rendered rather than reset. Geography hidden IDs/names are part of the bound DTO. The client autocomplete clears dependent geography selections when upstream text changes; no server-side reset beyond validator DTO replacement is asserted.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/SupplierIngestionController.java`
- `cylindermanagement.web/src/main/resources/templates/with-menu/SupplierIngestion.html`

## Approval boundary

Strict field/UI source enrichment is complete. Approval remains `PENDING_USER_APPROVAL`; no auto-approval, Use Case grouping, or testing-readiness promotion is performed.
