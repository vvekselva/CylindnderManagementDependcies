# BL-004 / STORY-0080 — Supplier Registration Form Unit-Test Plan

Source contract: `BL-002/stories/STORY-0080.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Unit scenarios
1. GET /ingestSupplier creates SupplierDto and nested PhoneNumberDto, AddressDto, CityDto, StateDto and CountryDto objects required for stable Thymeleaf binding.
2. Controller wraps the initialized supplier graph in SupplierIngestionRequestDto and exposes model key `supplier`.
3. Controller renders `with-menu/SupplierIngestion` and exposes the configured home/back link.
4. Visible supplier name, GST, phone, address and geography fields bind to the expected DTO paths.
5. Country/State/City autocomplete calls the governed search endpoints only for non-empty text.
6. Selecting a search result writes visible text and hidden persistent identity.
7. Changing Country clears State and City; changing State clears City.
8. GET /ingestSupplier performs no persistence write.

## Execution
Plan created by fan-out. Runtime execution and JaCoCo coverage remain NOT_EXECUTED until a faithful Maven/JUnit/Spring test runtime is available.
