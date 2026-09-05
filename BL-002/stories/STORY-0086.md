# STORY-0086 — Customer Address Search

- Release: R1
- Endpoint: `GET /search/address/customer-address/{customerId}`
- Controller: `RestfulAddressServices.getCustomerAddressByCustomerId`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_FANOUT_REQUESTED
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

On Customer Stop, selecting a customer stores that exact persistent customer ID and immediately triggers the dependent address lookup `GET /search/address/customer-address/{customerId}`. There is no independent text/debounce rule for this dependent lookup; the path identity comes from the selected customer result.

The recovered ZIP confirms `RestfulAddressServices.getCustomerAddressByCustomerId` and `CustomerAddressFetchByIDService`. The service reads customer-address relationships through `CustomerAddressJpaDao` and returns `CustomerAddressSearchResponseDto.customerAddressDtos`. Browser address cards use the returned `customerAddressId` as the selectable persistent identity, display address data, and write the selected ID to `vehicleTripStop.deliveryAddress.customerAddressId`; clearing/changing the customer invalidates the dependent address selection.

Blank customer identity returns no usable address response; invalid/service-failure paths return an empty response DTO. Empty results display no-address feedback and fetch failures display the address-load failure message. This search itself is read-only; its result identity is consumed later by Customer Stop persistence.

## Completion and approval gate

The trigger, path identity, service/DAO read path, selectable address identity, dependent reset behavior, empty/error outcomes and read-only business effect are source-bound. STORY-0086 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

User approval recorded on 2026-09-05. Fan-out is authorized subject to post-approval source/code conformance; runtime execution and coverage must remain evidence-based.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Recorded: 2026-09-05
- Post-approval gate: source/code conformance required before executable downstream claims
- Fan-out targets: BL-004 unit testing, BL-005 integration testing, BL-009 test-case/test-data catalogue, BL-011 human-readable testing packet
- Runtime/coverage rule: do not infer execution or coverage without durable evidence
