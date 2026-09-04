# BL-004 / STORY-0081 — Supplier Registration Unit-Test Plan

Source contract: `BL-002/stories/STORY-0081.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Unit scenarios
1. Valid SupplierIngestionRequestDto reaches SupplierIngestionRequestValidator before persistence mapping.
2. Null request/supplier is rejected through the controlled validation flow.
3. Supplier name is required.
4. GST is required, normalized/validated, and duplicate GST is rejected.
5. Phone is required, normalized to the governed format, validated as 10 digits/pattern, and duplicate phone is rejected.
6. Address and geography identities are validated.
7. Valid request maps SupplierDo, AddressDo and PhoneNumberDo, sets supplier active=true, resolves City/State/Country IDs, links the aggregate and invokes SupplierJpaDao.save(...).
8. Invalid input returns validator-marked DTO data for redisplay.
9. Successful submission follows the configured success/home/list redirect.
10. CylinderManagementApplicationException returns the supplier form without inventing an unproved global message.

## Execution
Fan-out plan only. Runtime execution and JaCoCo coverage remain NOT_EXECUTED until a faithful Maven/JUnit/Mockito/Spring test runtime is available.
