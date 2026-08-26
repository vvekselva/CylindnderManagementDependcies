# STORY-0049 — Search address types by text

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `f99fa00122db2bc862f9be27f6b9ec4778987dde363603d1b94d23bca1779a20`  
**Matrix flow:** `GET /search/addresstype/{searchText}`

A caller supplies `searchText` in the URL. `RestfulAddressTypeServices.getAddressTypes` builds the request DTO and calls the typed search-service contract. The accepted frozen-source evidence proves `AddressTypeSearchService.searchWithText` as the implementation. It invokes `SearchRequestValidator.validate`, then calls `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase`. The DAO is a `JpaRepository<AddressTypeDo, Long>` and `AddressTypeDo` maps to `public.tbl_address_type`. Matched rows are mapped to `AddressTypeSearchResponseDto` and returned as JSON.

No trimming, casing, default substitution, or exact validator rejection predicates are proved, so none are asserted. Service exceptions are proved to produce an empty response DTO; exact validation messages or HTTP-status changes are not proved. The request performs a database read only; no persistence write or state mutation is proved.

**Ordered chain:** `RestfulAddressTypeServices.getAddressTypes → AddressTypeSearchService.searchWithText → SearchRequestValidator.validate → AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase → AddressTypeDo → public.tbl_address_type → mapper → AddressTypeSearchResponseDto JSON`.

**Evidence:** `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-233707.md`.

**Approval:** PENDING USER DECISION for the exact fingerprint above.
