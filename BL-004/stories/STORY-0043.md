# BL-004 / STORY-0043 — Vehicle Trip Load Wizard GET Unit-Test Plan

Source contract: `BL-002/stories/STORY-0043.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Unit scenarios
1. GET /wizard/vehicle-trip-load creates a fresh UC02Phase01VehicleLoadRequestDto with nested VehicleTripDto and VehicleLoadDto.
2. The controller exposes model key `wizardRequest` and back link `/vehicle-loads/list`.
3. Vehicle Load Purpose and Product reference data are loaded through LookupDataCache.
4. The four challan-book collections are loaded for DELIVERY_CHALLAN, EMPTY_PICKUP_CHALLAN, FILLING_NOTE and CUSTOMER_SPOT_CYLINDER_CHECK.
5. The controller renders `final-version-1/VehicleTripLoadWizard`.
6. Customer Address selection remains dependent on the chosen Customer.
7. Vehicle, Driver, Customer and cylinder selectors retain their source-bound identities and request mappings.
8. GET performs no trip/load/challan/logistics persistence.
9. Product cache behavior is tested as current source: nonblank search still uses paged findAll and the fetch service caps page size at 10; no filtered/full-catalog behavior is inferred.
10. STORY-0044 save-path mutation behavior is not executed through this GET unit scope.

## Execution
Fan-out plan only. Runtime execution and JaCoCo coverage remain NOT_EXECUTED until a faithful Maven/JUnit/Spring/Mockito runtime is available.
