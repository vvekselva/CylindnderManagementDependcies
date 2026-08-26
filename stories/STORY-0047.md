# STORY-0047 — Open the vehicle trip/load wizard with lookup and active challan-book data

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `2ab938e66f6b38bfb37d6b2b4d6e9f032cab670213cc8e9b7e8abefc37b2f47c`  
Matrix row: `GET /wizard/vehicle-trip-load`  
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`

A caller opens the vehicle trip/load wizard. `VehicleTripLoadWizardController.showWizard` prepares the page using two source-proved branches. First, it reads the vehicle-load purposes, total products and product details from `LookupDataCache`. The accepted request trace proves those in-memory cache accesses for this GET invocation, but does not prove a database-population path behind that cache, so no additional database dependency is inferred for that branch.

The second branch calls `populateActiveChallanBooks`, which uses `ActiveChallanBookForTripLoadViewJpaDao.findByBookType`. That DAO maps `ActiveChallanBookForTripLoadViewDo` to the PostgreSQL view `public.vw_active_challan_books_for_trip_load`. The active challan-book rows are added to the data used to prepare the wizard.

No caller-input validation, invalid-value branch, or persistent write is proved for this GET path. The accepted evidence also does not enumerate a caller-visible exception/error branch, so no such behavior is invented.

The successful postcondition is that the controller renders `final-version-1/VehicleTripLoadWizard` with the source-proved lookup values and active challan-book data available to the page.

## Ordered evidence-backed flow

`VehicleTripLoadWizardController.showWizard` → `LookupDataCache.getVehicleLoadPurposes / getTotalProducts / getProduct` → in-memory cache

and

`VehicleTripLoadWizardController.showWizard` → `populateActiveChallanBooks` → `ActiveChallanBookForTripLoadViewJpaDao.findByBookType` → `ActiveChallanBookForTripLoadViewDo` → `public.vw_active_challan_books_for_trip_load`

→ terminal view `final-version-1/VehicleTripLoadWizard`.

Evidence: `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-110011.md`.

Approval remains with the user. This Story is not authoritative for downstream Use Case/test generation until this exact fingerprint is explicitly approved.
