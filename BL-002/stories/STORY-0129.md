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

## Business behavior

The Address Type tab lets an operator add a new address classification or edit an existing one. The form posts optional `addressTypeId`, required `addressType`, optional/default-empty `description`, and CSRF when available to `POST /lookupManagement/addressType/save`.

The controller trims and uppercases the address type, trims description, copies the optional identity into `AddressTypeDto`, wraps it in `AddressTypeIngestionRequestDto`, and delegates to `AddressTypeIngestionService`. A null/zero ID is create; a nonzero ID is update.

On success the controller refreshes only the Address Type cache and redirects to `/lookupManagement?tab=addressType`, with add/update-specific success text. User-input validation carrying the expected AddressType request returns the Lookup Management view directly with the failed Address Type DTO and refreshed lookup collections so inline validation survives. Unexpected validation payloads or other exceptions redirect with an error flash.

## Exact service and persistence behavior

`AddressTypeIngestionService.processRequest(...)` is transactional. A null request, null nested DTO or blank address type raises controlled input validation evidence. The service then calls `AddressTypeJpaDao.findByAddressTypeContainingIgnoreCase(...)`; if any row is returned it adds `ADDRESS_TYPE_ALREADY_EXISTS` validation evidence and rejects the request.

On a request that passes validation, `AddressTypeMapper` maps to `AddressTypeDo` and `AddressTypeJpaDao.saveAndFlush(...)` persists the entity. `AddressTypeDo` maps to `public.tbl_address_type`, primary key `pk_address_type_id`, sequence `public.pk_address_type_id_serial`, unique non-null `address_type`, and non-null `description`.

The service converts repository-save exceptions into a FAILURE response code rather than rethrowing them from this method; successful save sets SUCCESS.

## Source-proved update/uniqueness drift

The duplicate predicate is currently a contains/ignore-case search and does not exclude the same `addressTypeId` during update. Therefore a legitimate edit can be rejected as a duplicate of itself, and substring relationships can also produce false duplicate rejection. The database already has exact uniqueness on `address_type`; no schema change is required for the proposed application correction.

The exact service/repository/test remediation is isolated in `BL-002/evidence/STORY-0129-address-type-update-drift-review-20260902.yaml`. It is not authorized for implementation until explicit user approval of that manifest.

## Business impact and visible outcome

A successful operation creates or updates the persisted Address Type and refreshes the cache used by Lookup Management and consuming forms. A controlled validation error remains visible on the same tab; unexpected failures return an error flash. Current update uniqueness semantics can prevent otherwise valid maintenance and are explicitly review-gated.

## Completion and approval gate

The recovered ZIP binds the complete form/controller normalization, validation, repository/entity/table path, cache refresh, visible outcomes and current update defect. STORY-0129 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains `PENDING_USER_APPROVAL`. No application code was changed and no BL-010 work was created or executed.
