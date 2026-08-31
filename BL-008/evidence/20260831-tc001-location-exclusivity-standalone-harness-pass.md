# BL-008 TC-001 Location Exclusivity Focused Execution PASS

Date: 2026-08-31

## Scope

BL008-TC-001 validates the application-side `CylinderLocationExclusivityValidator` behavior used before Yard -> Vehicle movement.

The normal Maven/JUnit runner is not available in the ChatGPT execution container. To execute the behavior instead of merely reviewing source, the production `CylinderLocationExclusivityValidator.java` file was compiled **unchanged** with minimal local stubs for external framework/DAO/DTO dependencies and a standalone Java assertion harness.

This is a focused logic execution of the real validator source. It is not represented as a full Maven/Spring/JUnit build.

## Executed checks

| Check | Result |
|---|---|
| Yard is the only active bucket | PASS |
| Yard + Customer custody conflict | PASS — rejected with `CYLINDER_ALREADY_ACTIVE_AT_CUSTOMER` and `CYLINDER_LOCATION_NOT_EXCLUSIVE` |
| Yard + Supplier custody conflict | PASS — rejected with `CYLINDER_ALREADY_ACTIVE_AT_SUPPLIER` and `CYLINDER_LOCATION_NOT_EXCLUSIVE` |
| Yard + DECOMMISSIONED lifecycle conflict | PASS — rejected with `CYLINDER_DECOMMISSIONED` and `CYLINDER_LOCATION_NOT_EXCLUSIVE` |

Terminal output:

```text
PASS | TC001-A Yard is the only active bucket
PASS | TC001-B Customer custody conflict rejected
PASS | TC001-C Supplier custody conflict rejected
PASS | TC001-D Decommissioned conflict rejected
BL008_TC001_STANDALONE_HARNESS_PASS; checks=4; failures=0
```

Result-file SHA-256:

`01a6d524f45bca413679fa8cfdda8874c90622c9412b4675a03e730e2693f94f`

## Acceptance

BL008-TC-001 is accepted as **PASS_FOCUSED_STANDALONE_HARNESS**.

The remaining BL-008 runtime/UI/DB-runtime cases are non-blocking residual validation cases and are handled by the BL-008 closure decision rather than being falsely marked as executed.
