# STORY-0087 — Address Type Search

- Release: R1
- Endpoint: `GET /search/addresstype/{searchText}`
- Controller: `RestfulAddressTypeServices.getAddressTypes`
- Approval: APPROVED_AFTER_REWORK
- Approval evidence: `BL-002/approval-evidence/STORY-0087-approval-20260902.md`
- Fan-out: REQUESTED
- Review state: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

This is a read-only address-type lookup whose exact input is path variable `searchText`. The recovered ZIP confirms `RestfulAddressTypeServices` at `/search/addresstype` and the search flow through `AddressTypeSearchService`, request validation, `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase`, `AddressTypeDo` / `public.tbl_address_type`, DTO mapping and `AddressTypeSearchResponseDto`.

Lookup semantics are contains/ignore-case. Successful results are returned in the response DTO; application-service failure is converted by the REST handler to an empty response DTO. The endpoint itself has no persistence mutation and no standalone screen-specific debounce/minimum-length/hidden-ID contract is asserted where the source does not bind one.

## Completion and approval gate

The request identity, validation/search/DAO/table path, result/error behavior and read-only business effect are source-bound. STORY-0087 is `APPROVED_AFTER_REWORK` by explicit user instruction dated 2026-09-02, and downstream testing/test-data fan-out is requested.

This approval applies to the documented Story contract. It does not independently authorize unrelated application-code mutation or scope expansion.
