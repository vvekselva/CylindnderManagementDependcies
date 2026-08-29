# STORY-0018 — Missing Customer Address Locations

- Release: R2
- Endpoint: `GET /customer-address-location/missing`
- Controller: `CustomerAddressLocationController.showMissingLocations`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

This read-only GET takes no request parameters. The controller renders `with-menu/CustomerAddressLocationMissing` and sets model attribute `missingLocations` from `CustomerAddressLocationOfflineMapService.fetchMissingCustomerAddressLocations()`.

The service executes the DAO read `CustomerAddressLocationJpaDao.findMissingCustomerAddressLocations()`, maps every returned row through `CustomerAddressLocationMapper.toDto`, and returns the DTO list. There is no controller validation, browser typing/debounce contract, hidden field, persistence mutation or local error branch in this GET. The exact read contract is the DAO's missing-customer-address-location result and mapper output; no additional behavior is inferred beyond frozen source. No approval occurred.
