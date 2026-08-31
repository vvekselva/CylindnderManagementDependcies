# BL-008 — DATABASE FROZEN / SERVICE-UI ACCEPTANCE PHASE

Date: **2026-08-31**

Current status: **V185 CLEAN_DATABASE_VALIDATED_PASS — DATABASE FROZEN AT V185**

## Final database result

The final business-model alignment migration `V185__Align_External_Logical_Physical_Asset_Model.sql` has passed the clean-database harmony validator with:

`BL008_V185_FINAL_DATABASE_HARMONY_PASS; failed_checks=0`

Accepted database migration line:

`V174 -> V185 = CLEAN_DATABASE_VALIDATED_PASS`

No active database migration gate remains.

## Frozen governed model

### Transaction identity

All business/operational relations use only the stable logical `tbl_cylinder.pk_cylinder_id` through `fk_cylinder`. Physical cylinder identifiers are never operational foreign keys.

### Company-owned

- No logical/physical split.
- `tbl_cylinder.cylinder_serial` is the company cylinder identity.
- Separate active-primary physical identifier rows required: **0**.

### Supplier/customer-owned

- `tbl_cylinder` is the stable logical asset.
- `tbl_cylinder_identifier` stores current/historical physical identifiers.
- `ASSIGNED` = exactly one active-primary physical identifier.
- `AWAITING_REPLACEMENT` = zero active-primary physical identifiers and no active physical location/custody.
- `CLOSED` = zero active-primary physical identifiers; no further operational use.

### Ownership and custody

Ownership and custody are separate. A CUSTOMER_OWNED logical asset may be held by its owner customer or another customer. Custody history records the actual holder. Physical replacement is validated against the actual custody/refill context at replacement time.

### Physical condition and logical accounting

For external assets, physical DAMAGED/LOST/DECOMMISSIONED events do not automatically close or reduce the logical asset. LOST/DECOMMISSIONED retires the current physical identifier and places the logical asset into `AWAITING_REPLACEMENT`. Only explicit `CUSTOMER_ASSET_CLOSED` reduces the customer logical active-asset balance by one. Supplier logical close remains count-neutral under the governed supplier model.

### Recovery

Company terminal states remain terminal. Supplier/customer logical assets may recover from physical DAMAGED/LOST/DECOMMISSIONED only after a usable replacement physical identifier is assigned.

### Display

- Company: `COMP-00125`
- Supplier: `LS-00100 / SUP-7788`
- Customer: `LC-00025 / CUST-250`

The logical ID always remains the transaction key.

## Validation evidence

V185 clean validation confirmed logical-ID-only operational storage, custody separation, ownership-aware physical-ID authority, replacement traceability, logical accounting, append-only history, explicit closure, operational guards, recovery, display harmony and regressions for the accepted prior migrations.

Evidence: `BL-008/evidence/20260831-v185-final-database-harmony-pass.md`.

## Database freeze rule

**The database is frozen at V185.**

Do not create V186 or modify the schema unless a new approved business requirement is introduced or a service/UI/runtime regression test proves a genuine database defect. Application/service/UI defects must be corrected in application code first when the frozen database model is already correct.

## V185 service/UI test baseline

The official post-freeze acceptance pack contains **30 tests** in six stages:

1. Registration — BL008-SUI-001..005
2. Search / logical-key preservation — BL008-SUI-006..010
3. Custody / location — BL008-SUI-011..014
4. Physical replacement / loss / recovery — BL008-SUI-015..021
5. Customer logical closure — BL008-SUI-022..025
6. Regression / end-to-end — BL008-SUI-026..030

### Canonical TestData Backlog

The reusable test data and acceptance catalogue are frozen for execution under:

`BL-008/TestData-Backlog/`

Canonical files:

- `BL-008/TestData-Backlog/BL008_V185_Test_Data.csv`
- `BL-008/TestData-Backlog/BL008_V185_Service_UI_Test_Cases.csv`
- `BL-008/TestData-Backlog/BL008_V185_Test_Data_Human_Readable.md`
- `BL-008/TestData-Backlog/BL008_V185_Test_Execution_Order.md`
- `BL-008/TestData-Backlog/README.md`

The old `BL-008/test-case-backlog.csv` is historical pre-V185 material and must not be used as the current acceptance source where its V176/V178/V181 assumptions conflict with the final V185 model.

## Automated test code

JUnit-style test automation is stored in the source repository `vvekselva/CylinderManagement` on branch:

`bl008-v185-test-automation`

Current automated test assets are under:

`cylindermanagement.custommapper.service/src/test/java/com/sreyas/datamatics/cylinder/management/bl008/`

and:

`cylindermanagement.custommapper.service/src/test/resources/bl008/`

The automation currently includes:

- `BL008V185TestCatalogTest` — verifies all 30 test IDs and reusable datasets are present.
- `BL008V185SourceContractTest` — one JUnit contract assertion for every BL008-SUI-001..030 case.
- `BL008V185CylinderIngestionServiceTest` — Mockito behavior tests for company/supplier/customer registration identity handling.
- `BL008V185SupplierReplacementServiceTest` — Mockito behavior tests for V185 supplier refill/custodian replacement semantics.

These tests are intentionally red/green TDD tests. A failure identifies an application/service/UI mismatch against the frozen V185 contract; it does not reopen the database automatically.

### Known source risks to test first

Static source review identifies likely application mismatches which the tests are designed to expose:

- `CylinderIngestionService` still creates a primary identifier for company registration and overwrites response `cylinderSerial` with the physical identifier.
- `AvailableYardCylinderByStateSearchService` can overwrite logical `cylinderSerial` with the physical identifier.
- `CylindersOnVehicleSearchServiceWithOwnershipModel` can overwrite logical `cylinderSerial` with the physical identifier.
- `SupplierRefillIdentifierReplacementService` still requires the refill supplier to equal the permanent owner supplier instead of using the valid current custody/refill context.
- Domain Lookup still needs the final logical-ID/physical-ID conditional UI treatment verified.

## Current BL-008 phase

Database/schema work: **COMPLETE AND FROZEN**.

Test design and reusable TestData Backlog: **COMPLETE AND STORED IN GIT**.

JUnit-style automated contract/behavior test code: **AUTHORED AND STORED ON `bl008-v185-test-automation`**.

Next action: run Stage 1 automated tests, correct application defects, rerun affected tests until green, then continue through service/integration and UI acceptance. BL-008 final closure occurs after the 30-case acceptance results are recorded.
