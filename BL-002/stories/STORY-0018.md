# STORY-0018 — Missing Customer Address Locations

- Release: R2
- Endpoint: `GET /customer-address-location/missing`
- Controller: `CustomerAddressLocationController.showMissingLocations`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0018-local-source-business-behavior-20260902-1642.yaml`

This read-only GET takes no request parameters. The controller renders `with-menu/CustomerAddressLocationMissing` and sets model attribute `missingLocations` from `CustomerAddressLocationOfflineMapService.fetchMissingCustomerAddressLocations()`.

The service executes `CustomerAddressLocationJpaDao.findMissingCustomerAddressLocations()`, maps every returned row through `CustomerAddressLocationMapper.toDto`, and returns the DTO list. The DAO's native query reads `public.vw_customer_address_location_status` with `location_missing = true`, ordered by customer name and customer-address identity.

There is no controller validation, browser typing/debounce contract, hidden field, persistence mutation or local error branch in this GET. The exact read contract is the missing-customer-address-location view result and mapper output.

The recovered governed ZIP independently confirms the controller, DAO view/filter and mapper path. STORY-0018 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
