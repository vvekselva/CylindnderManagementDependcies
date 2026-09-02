# STORY-0129 — Save Address Type

- Release: R1
- Endpoint: `POST /lookupManagement/addressType/save`
- Controller: `LookupManagementController.saveAddressType`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0129-address-type-update-drift-review-20260902.yaml`
- Global lookup/insertion rule: `BL-002/lookup-insertion-precheck-policy.yaml`

## Business behavior

The Address Type tab lets an operator add a new address classification or edit an existing one. The form posts optional `addressTypeId`, required `addressType`, optional/default-empty `description`, and CSRF when available to `POST /lookupManagement/addressType/save`.

The controller trims and uppercases the address type, trims description, copies the optional identity into `AddressTypeDto`, wraps it in `AddressTypeIngestionRequestDto`, and delegates to `AddressTypeIngestionService`. A null/zero ID is create; a nonzero ID is update.

On success the controller refreshes only the Address Type cache and redirects to `/lookupManagement?tab=addressType`, with add/update-specific success text. User-input validation carrying the expected AddressType request returns the Lookup Management view directly with the failed Address Type DTO and refreshed lookup collections so inline validation survives. Unexpected validation payloads or other exceptions redirect with an error flash.

## Required lookup-before-insert user behavior

The user has explicitly required that Address Type entry must help prevent duplicates before submission, not only reject them after Save.

When the operator types an Address Type, the screen must search the database-backed Address Type search path and show matching existing Address Types. The existing search Story is STORY-0087 (`GET /search/addresstype/{searchText}`) and should be reused rather than introducing a second ungoverned lookup path unless source review proves a reason otherwise.

The required interaction is:

1. The operator begins typing the proposed Address Type.
2. The UI performs a controlled/debounced database-backed search using the governed Address Type search capability.
3. Matching existing Address Types are displayed before the operator submits a new value.
4. The operator can therefore see that a value already exists and avoid creating another copy.
5. If the typed text changes, any stale selected identity/result state must be cleared.
6. On submit, the service must still perform its own duplicate pre-check; the UI search is assistance, not the authoritative concurrency guard.

This rule is part of the global BL-002 lookup/insertion policy and must also be checked for every other lookup/master-data maintenance and insertion/update Story.

## Exact service and persistence behavior

`AddressTypeIngestionService.processRequest(...)` is transactional. A null request, null nested DTO or blank address type raises controlled input validation evidence. The service then calls `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase(...)`; if any row is returned it adds `ADDRESS_TYPE_ALREADY_EXISTS` validation evidence and rejects the request.

On a request that passes validation, `AddressTypeMapper` maps to `AddressTypeDo` and `AddressTypeJpaDao.saveAndFlush(...)` persists the entity. `AddressTypeDo` maps to `public.tbl_address_type`, primary key `pk_address_type_id`, sequence `public.pk_address_type_id_serial`, unique non-null `address_type`, and non-null `description`.

The service converts repository-save exceptions into a FAILURE response code rather than rethrowing them from this method; successful save sets SUCCESS.

## Source-proved update/uniqueness drift

The duplicate predicate is currently a contains/ignore-case search and does not exclude the same `addressTypeId` during update. Therefore a legitimate edit can be rejected as a duplicate of itself, and substring relationships can also produce false duplicate rejection. The database already has exact uniqueness on `address_type`; no schema change is required for the proposed application correction.

The target duplicate rule is stricter and clearer: normalized business-equivalent duplicates must be rejected, update must exclude the current row identity, substring matches may be useful as search suggestions but must not automatically become false duplicate errors unless the business domain explicitly treats them as identical.

The exact service/repository/test remediation currently isolated in `BL-002/evidence/STORY-0129-address-type-update-drift-review-20260902.yaml` must be extended/reviewed to cover the new UI search-before-insert requirement. Application mutation remains separately approval-gated.

## Business impact and visible outcome

A successful operation creates or updates the persisted Address Type and refreshes the cache used by Lookup Management and consuming forms. A controlled validation error remains visible on the same tab; unexpected failures return an error flash. The required search-before-insert behavior reduces accidental duplicate entry, while the service/database checks provide authoritative protection.

## Completion and approval gate

The recovered ZIP binds the current form/controller normalization, validation, repository/entity/table path, cache refresh, visible outcomes and current update defect. The user-requested database-backed type-ahead lookup behavior is now part of the target business contract and is not represented as already implemented in the frozen source.

Approval remains `PENDING_USER_APPROVAL`. No application code was changed and no BL-010 implementation was created or executed by this Story-document update.
