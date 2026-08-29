# STORY-0080 — Supplier Registration Form

- Release: R1
- Endpoint: `GET /ingestSupplier`
- Controller: `SupplierIngestionController.doGet`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an operator, I can open Register Supplier and receive a fully initialized supplier form whose nested phone/address/city/state/country objects are safe for Thymeleaf binding. I can enter supplier identity and address information; country/state/city are autocomplete controls that keep selected IDs/names in hidden fields for the later POST.

## GET/controller contract

`GET /ingestSupplier` accepts no request parameters. `doGet()` constructs `SupplierDto`, nested `PhoneNumberDto`, nested `AddressDto`, and nested `CityDto`, `StateDto`, `CountryDto`; wraps that graph in `SupplierIngestionRequestDto`; renders `with-menu/SupplierIngestion`; exposes it as model `supplier`; and exposes `backLink = ViewConstants.REDIRECT_HOME_LINK`.

## Exact form/binding contract

The rendered form posts to `/ingestSupplier`, binds `th:object="${supplier}"`, uses `method="post"`, `id="supplier-form"`, `autocomplete="off"`, and includes CSRF hidden name/value when available. Frozen controller/template evidence establishes these nested binding paths: `supplierDto.supplierName`, `supplierDto.gstNumber`, `supplierDto.phoneNumber.phoneNumber`, `supplierDto.address.addressLine1`, `supplierDto.address.addressLine2`, `supplierDto.address.addressLine3`, `supplierDto.address.landmark`, `supplierDto.address.city.cityId/cityName`, `supplierDto.address.state.stateId/stateName`, and `supplierDto.address.country.countryId/countryName`.

Visible Supplier Name is a text input. GST Number is text with `maxlength="15"`, uppercase styling, and `oninput` uppercasing. Validation styling/messages are driven by DTO `validationFailure` / `validationErrorDtos`; e.g. supplier-name and GST error codes are rendered from `messages.properties` via `#{${ve.errorCode}}`.

## Autocomplete behavior

The template defines search bases `/search/country/`, `/search/state/`, `/search/city/`. Typing a non-empty query schedules `_debounce(key, fn, ms)` then fetches the corresponding URL plus `encodeURIComponent(q)`, reads JSON arrays (`countryDtos`, `stateDtos`, `cityDtos`), and on selection copies both selected ID and name into hidden fields. Clearing/changing an upstream geography clears dependent selected fields before new results are used. The inspected call sites invoke `_debounce` without an explicit `ms`; therefore no positive debounce interval is source-proved and none is invented. Empty query hides the dropdown instead of calling the API.

## Persistence / outcome

This GET performs no persistence. Its purpose is safe form initialization and rendering. The later POST is a separate story. No submit success/error behavior is attributed to this GET.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/SupplierIngestionController.java`
- `cylindermanagement.web/src/main/resources/templates/with-menu/SupplierIngestion.html`

## Approval boundary

Strict field/UI source enrichment is complete. Approval remains `PENDING_USER_APPROVAL`; no auto-approval, Use Case grouping, or testing-readiness promotion is performed.
