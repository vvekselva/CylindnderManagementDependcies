# STORY-0045 — Open customer registration page with address types

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `b56eb8eaaa94e447bf7045a37f535ec6cf2fb844a825f3ac50abd9804868bc69`  
Canonical matrix row: `GET /registerCustomer`  
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

A caller opens `GET /registerCustomer`. The controller asks `LookupDataCache` for address types. When the cache is populated, the in-memory list is used directly. When the cache is empty, `LookupDataCache.refreshAddressTypes` invokes `AddressTypeFetchByPageService.processRequest` with a blank search term; the blank-search path reads through `AddressTypeJpaDao.findAll(pageable)` and `AddressTypeDo` from `public.tbl_address_type`, then refreshes the in-memory list. The controller renders `final-version-1/UC01RegisterCustomer`.

No required caller input or caller-input validation is proved for this GET flow. No customer write occurs. No unproved error behavior is added.

## Ordered component flow

`UC01RegisterCustomerController.doGet` → `LookupDataCache.getAddressTypes` → cache hit **or** `LookupDataCache.refreshAddressTypes` → `AddressTypeFetchByPageService.processRequest` → `AddressTypeJpaDao.findAll(pageable)` → `AddressTypeDo` → `public.tbl_address_type` → in-memory cache → `final-version-1/UC01RegisterCustomer`.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-093200.md`

User approval is still required before this Story becomes downstream-authoritative.
