# STORY-0024 — Save a customer address location

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `d2234c7ea5d926179521e7b18438ed80c31974dc5636b7b80a007ef1ef494f3e`

A caller submits `POST /customer-address-location/upload`. The request reaches `CustomerAddressLocationController.saveLocation`, which invokes `CustomerAddressLocationOfflineMapService.saveCustomerAddressLocation`. The accepted trace proves `CustomerAddressJpaDao.findById -> CustomerAddressDo -> public.tbl_customer_address`, followed by `CustomerAddressLocationJpaDao.findByCustomerAddressCustomerAddressIdAndActiveTrue / save -> CustomerAddressLocationDo -> public.tbl_customer_address_location -> CustomerAddressLocationMapper.toDto`.

The proved terminal branches are a success redirect to `/customer-address-location/missing` and an error redirect back to the upload page. The accepted evidence does not prove the exact submitted field names, requiredness, formatting rules, validation messages, geographic rules, ownership rules or uniqueness semantics, so none are invented here.

Postcondition: on the proved successful save path, customer-address location state is persisted and the caller is redirected to the missing-locations route.

Evidence: canonical BL-001 row `POST /customer-address-location/upload`; `logs/runs/PRODUCTION-FIRE-20260824-020143.md`.

Approval is pending explicit user decision for the exact fingerprint above.
