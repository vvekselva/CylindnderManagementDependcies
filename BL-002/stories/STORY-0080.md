# STORY-0080 — Supplier Registration Form

- Release: R1
- Endpoint: `GET /ingestSupplier`
- Controller: `SupplierIngestionController.doGet`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

As an operator, I can open Register Supplier and receive a fully initialized supplier form whose nested phone/address/city/state/country objects are safe for Thymeleaf binding. `GET /ingestSupplier` accepts no request parameters. The controller constructs `SupplierDto`, nested `PhoneNumberDto`, `AddressDto`, `CityDto`, `StateDto`, and `CountryDto`, wraps them in `SupplierIngestionRequestDto`, renders `with-menu/SupplierIngestion`, exposes the request as model `supplier`, and exposes the configured home back link.

The form posts to `/ingestSupplier`, binds `supplierDto.supplierName`, `gstNumber`, phone, address lines/landmark, plus selected city/state/country IDs and names. GST input is capped at 15 characters and uppercased on input. Country/state/city are browser autocomplete controls backed by `/search/country/`, `/search/state/`, `/search/city/`; non-empty text triggers the template debounce wrapper and fetch, selection writes both visible name and hidden persistent identity, and upstream geography changes clear stale dependent selections. Empty search text closes the dropdown rather than calling the API.

This GET performs no database write. Its business purpose is correct form initialization, user entry and stable reference-ID capture for the separate POST transaction.

## Completion and approval gate

The recovered ZIP confirms initialization, all visible/bound fields, autocomplete identity propagation, dependent clearing, form action and read-only effect. STORY-0080 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
