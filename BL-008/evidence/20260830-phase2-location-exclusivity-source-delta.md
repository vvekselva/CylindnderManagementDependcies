# BL-008 Phase 2 — Location Exclusivity Source Delta

Status: `IMPLEMENTED_SOURCE_VALIDATION_PENDING`.

User explicitly requested that the previously deferred Customer, Supplier and Decommissioned location buckets be taken up as part of Ownership Model Phase 2.

## Source finding

`CylinderLocationExclusivityValidator` previously counted only active Yard inventory and active Vehicle logistics and documented Customer custody, Supplier custody and Decommissioned status as future extension points.

Existing authoritative sources already exist:

- Yard: active `tbl_yard_inventory_line`.
- Vehicle/logistics: active `tbl_cylinder_logistics_execution_line`.
- Customer: active `tbl_cylinder_party_custody` rows with `party_type='CUSTOMER'`, `custody_status='ACTIVE'`, `exited_at IS NULL`.
- Supplier: active `tbl_cylinder_party_custody` rows with `party_type='SUPPLIER'`, `custody_status='ACTIVE'`, `exited_at IS NULL`.
- Decommissioned: latest `tbl_cylinder_state_audit` event resolving to `tbl_cylinder_states.cylinder_state='DECOMMISSIONED'`.

The implementation deliberately does not use the legacy `tbl_cylinder_current_status` as an ownership-model decision source.

## Implemented source delta

Application repository changes:

1. `cylinder.management.dao/.../CylinderOwnershipValidationJpaDao.java`
   - counts active Customer custody rows by cylinder;
   - counts active Supplier custody rows by cylinder;
   - determines whether the latest state-audit event is DECOMMISSIONED.

2. `cylindermanagement.custommapper.service/.../CylinderLocationExclusivityValidator.java`
   - total location count is now Yard + Vehicle + Customer + Supplier + Decommissioned;
   - Yard -> Vehicle precondition is exactly Yard=1 and all other buckets=0;
   - emits explicit Customer, Supplier and Decommissioned validation errors.

3. `cylindermanagement.custommapper.service/src/test/.../CylinderLocationExclusivityValidatorTest.java`
   - valid Yard-only case;
   - Customer conflict;
   - Supplier conflict;
   - Decommissioned conflict;
   - duplicate Customer custody conflict.

Application commits:

- DAO update: `38d3555879edafc92eebfeeeff2cf88808942cff`
- Validator update: `c74e9011acd3ef27aca352d3933f09ebfa804feb`
- Unit test creation: `ac14d8363871ffe9bf46fa3eddcb2170b5109aa4`

## Validation status

The source delta was statically inspected. The focused Maven/JUnit test could not be executed in the ChatGPT container because Maven is not installed in that runtime. Therefore runtime/unit-test PASS is not claimed.

No database schema defect was required to implement these three validator buckets, so no V175 migration is created by this unit of work.

Next: run the focused JUnit test in the normal project build environment, then continue Phase-2 lifecycle/accounting and supplier asset-count-preservation analysis.
