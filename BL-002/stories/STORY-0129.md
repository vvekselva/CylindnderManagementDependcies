# STORY-0129 — Save Address Type

- Release: R1
- Endpoint: `POST /lookupManagement/addressType/save`
- Controller: `LookupManagementController.saveAddressType`
- Approval: APPROVED_AFTER_REWORK
- Approval evidence: `BL-002/approval-evidence/STORY-0129-approval-20260902.md`
- Fan-out: REQUESTED_TO_BL004_BL005_BL009
- Review state: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0129-address-type-update-drift-review-20260902.yaml`
- Source reconciliation: `BL-002/evidence/STORY-0129-ui-search-source-reconciliation-20260902.yaml`
- Global lookup/insertion rule: `BL-002/lookup-insertion-precheck-policy.yaml`

## Business behavior

The Address Type tab lets an operator add a new address classification or edit an existing one. The form posts optional `addressTypeId`, required `addressType`, optional/default-empty `description`, and CSRF when available to `POST /lookupManagement/addressType/save`.

The controller trims and uppercases the address type, trims description, copies the optional identity into `AddressTypeDto`, wraps it in `AddressTypeIngestionRequestDto`, and delegates to `AddressTypeIngestionService`. A null/zero ID is create; a nonzero ID is update.

On success the controller refreshes only the Address Type cache and redirects to `/lookupManagement?tab=addressType`, with add/update-specific success text. User-input validation carrying the expected AddressType request returns the Lookup Management view directly with the failed Address Type DTO and refreshed lookup collections so inline validation survives. Unexpected validation payloads or other exceptions redirect with an error flash.

## Database-backed lookup-before-insert behavior — implemented in recovered source

The recovered `final-version-1/LookupManagement.html` already implements the required Address Type pre-submit lookup behavior.

1. The Address Type input `#at-code` uppercases typed text and calls `searchAddressType(this.value)` on each input change.
2. `searchAddressType(...)` uses the existing governed STORY-0087 endpoint base `/search/addresstype/`.
3. The JavaScript debounces the request by **320 ms** before calling the database-backed REST search.
4. Returned `addressTypeDtos` are rendered in the suggestion box with the existing Address Type, description and an `Already exists` marker.
5. When no match is returned the user sees `No match — this type is available`.
6. Empty input hides and clears suggestions; blur also hides the suggestion display.
7. This UI assistance does not replace submit-time service validation.

The REST path is `RestfulAddressTypeServices` → `AddressTypeSearchService` → `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase(...)`. Therefore the search-before-insert requirement is source-proved as **currently implemented**; no new production template code is proposed for this requirement.

## Exact service and persistence behavior

`AddressTypeIngestionService.processRequest(...)` is transactional. A null request, null nested DTO or blank address type raises controlled input validation evidence. The service then calls `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase(...)`; if any row is returned it adds `ADDRESS_TYPE_ALREADY_EXISTS` validation evidence and rejects the request.

On a request that passes validation, `AddressTypeMapper` maps to `AddressTypeDo` and `AddressTypeJpaDao.saveAndFlush(...)` persists the entity. `AddressTypeDo` maps to `public.tbl_address_type`, primary key `pk_address_type_id`, sequence `public.pk_address_type_id_serial`, unique non-null `address_type`, and non-null `description`.

The service converts repository-save exceptions into a FAILURE response code rather than rethrowing them from this method; successful save sets SUCCESS.

## Remaining source-proved update/uniqueness drift

The submit-time duplicate predicate is still a contains/ignore-case search and does not exclude the same `addressTypeId` during update. Therefore a legitimate edit can be rejected as a duplicate of itself, and substring relationships can also produce false duplicate rejection. The database already has exact uniqueness on `address_type`; no schema change is required for the proposed application correction.

The target duplicate rule is stricter and clearer: normalized business-equivalent duplicates must be rejected, update must exclude the current row identity, substring matches may remain useful as search suggestions but must not automatically become duplicate errors unless the domain explicitly treats them as equivalent.

The exact remaining service/repository/test remediation is isolated in `BL-002/evidence/STORY-0129-address-type-update-drift-review-20260902.yaml`. That manifest explicitly preserves the existing STORY-0087-backed type-ahead and proposes **no production template change**. Application mutation remains separately approval-gated.

## Business impact and visible outcome

A successful operation creates or updates the persisted Address Type and refreshes the cache used by Lookup Management and consuming forms. A controlled validation error remains visible on the same tab; unexpected failures return an error flash.

The current type-ahead already reduces accidental duplicate entry by showing database-backed matches before Save. The remaining service defect matters because authoritative submit-time uniqueness can still reject a legitimate same-row update or a non-equivalent substring match.

## Approval and fan-out gate

**APPROVED_AFTER_REWORK.** The user explicitly approved this revised Story on 2026-09-02 and explicitly requested fan-out. BL-004 unit-test, BL-005 integration-test and BL-009 test-case/test-data work may proceed for this approved current Story contract.

This Story approval does not by itself authorize application-code mutation for the separately documented drift manifest; that remains independently governed.