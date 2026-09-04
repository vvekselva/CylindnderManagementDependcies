# BL-004 / STORY-0042 — Customer Registration Unit-Test Plan

Source contract: `BL-002/stories/STORY-0042.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Unit scenarios
1. Valid request binds Customer, Address and Phone DTO collections and resolves submitted Address Type IDs.
2. Mediator maps the UC01 request into `CustomerIngestionRequestDto` and invokes `CustomerIngestionService.processRequest(...)`.
3. Validator rejects null request/customer, missing or invalid customer name/GST, duplicate GST, invalid/duplicate phone values, missing addresses, missing Address Type, invalid address lines and invalid City/State/Country references.
4. Valid request maps Customer, Address and Phone entities and invokes `customerJpaDao.save(customerDo)`.
5. Invalid input returns to the registration page with validator-marked DTOs restored and Address Type options reloaded.
6. Successful submission redirects to `/ownership-dashboard`.
7. Current source does not set Address Type on `CustomerAddressDo`; tests must expose this approved current-source gap rather than assert `fk_address_type` is persisted.
8. Repository save is the source-proved transaction boundary; no wider service/mediator transaction is inferred.

## Execution
Plan created by fan-out. Runtime execution and JaCoCo coverage remain NOT_EXECUTED until faithful Maven/JUnit/Spring test runtime is available.
