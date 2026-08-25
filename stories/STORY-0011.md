# STORY-0011 — Display customer addresses whose locations are missing

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `c34ea04e99af64319cb6d9bcee30860a8cd0a056e47bb49e8a41d8a6faefa3c4`

A caller requests `GET /customer-address-location/missing`. The request reaches `CustomerAddressLocationController.showMissingLocations`, which calls `CustomerAddressLocationOfflineMapService.fetchMissingCustomerAddressLocations`. The service calls `CustomerAddressLocationJpaDao.findMissingCustomerAddressLocations`, whose accepted trace reads `public.vw_customer_address_location_status`. Returned rows are converted by `CustomerAddressLocationMapper.toDto`, and the controller renders `with-menu/CustomerAddressLocationMissing`.

No caller-supplied request values, normalization/defaulting, explicit input validation, persistence write, state change, audit effect, file access, or external API call is proved for this endpoint. No additional business rule or error branch is inferred beyond the accepted trace.

Postcondition: the missing-location view is returned from the source-proved query result, with no proved database mutation.

Evidence: canonical BL-001 row `GET /customer-address-location/missing`; `logs/runs/PRODUCTION-FIRE-20260824-020143.md` endpoint 1.

Approval is pending explicit user decision for the exact fingerprint above.
