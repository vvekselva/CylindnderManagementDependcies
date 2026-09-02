# STORY-0091 — Customer Search

- Release: R1
- Endpoint: `GET /search/customer/{searchText}`
- Controller: `RestfulCustomerServices.getCustomers`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

The Customer Stop page uses visible input `#custSearch`: under 3 trimmed characters it performs no request; at 3+ characters it waits 280 ms and calls `GET /search/customer/{encoded searchText}`. Results expose customer name and persistent customer ID. Selecting a result writes that ID to hidden `vehicleTripStop.customer.customerId`, invalidates stale address/exchange state, and triggers the dependent customer-address lookup. Clearing customer clears customer/address identities and downstream state.

The recovered ZIP confirms the REST path through `RestfulCustomerServices.getCustomers`, `CustomerSearchService.searchWithText`, request validation, `CustomerJpaDao.findByCustomerNameContainingIgnoreCase`, `CustomerDo` / `public.tbl_customer`, DTO mapping and `CustomerSearchResponseDto`. The API is read-only; selected IDs are consumed later by Customer Stop persistence.

No-result and request-failure browser messages are source-bound by the Customer Stop template, as is delayed dropdown closing on blur.

## Completion and approval gate

The typeahead event/timing, selected identity propagation/reset behavior, search/DAO/table path and read-only business impact are source-bound. STORY-0091 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
