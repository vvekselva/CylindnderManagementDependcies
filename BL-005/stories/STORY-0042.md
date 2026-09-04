# BL-005 / STORY-0042 — Customer Registration PostgreSQL Integration-Test Plan

Source contract: `BL-002/stories/STORY-0042.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Required runtime
JUnit 5 + Spring test + PostgreSQL Testcontainers + Flyway/JPA.

## Integration scenarios
1. Submit a valid customer with phone and address collections through POST /registerCustomer.
2. Verify persistence through `tbl_customer`, `tbl_address`, `tbl_customer_address`, `tbl_phone_number`, and `tbl_customer_phone_number` with generated IDs.
3. Verify duplicate GST is rejected by the governed validation path and does not create an unintended second customer.
4. Verify invalid phone/address/location data returns validation feedback without persistence.
5. Verify the successful controller outcome redirects to `/ownership-dashboard`.
6. Verify the current-source Address Type omission explicitly: the request may validate/resolve Address Type while `CustomerAddressDo` does not receive it on the current code path.
7. Verify the real Spring Data JPA repository transaction/persistence behavior rather than substituting mocks or manual SQL.

## Execution
Generated plan is not PASS evidence. Runtime execution and JaCoCo coverage remain NOT_EXECUTED.
