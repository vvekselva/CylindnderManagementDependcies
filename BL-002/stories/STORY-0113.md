# STORY-0113 — Save Vehicle

- Release: R1
- Endpoint: `POST /domainLookup/vehicle/save`
- Controller: `DomainLookupController.saveVehicle`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0113-vehicle-update-drift-review-20260902.yaml`

## Business behavior

The Domain Lookup Vehicle tab posts optional vehicleId plus vehicle number, type, capacity, registration date and active flag. The controller normalizes vehicle number/type/date, builds `VehicleIngestionRequestDto`, classifies create/update by vehicleId, delegates to `VehicleIngestionService`, refreshes Vehicle cache after successful persistence, and follows the standard inline-validation/PRG result behavior.

`VehicleIngestionService` validates a nonblank vehicle number, currently rejects whenever `VehicleJpaDao.findByVehicleNumberContainingIgnoreCase(vehicleNumber)` returns any row, maps `VehicleDto` to `VehicleDo`, saves it and returns the saved vehicle DTO.

The duplicate validation does not exclude the same vehicleId during update and uses contains rather than exact normalized uniqueness, so legitimate updates/substrings can be falsely rejected. The exact service/repository/test repair is isolated in the referenced approval-gated packet.

## Completion and approval gate

The submitted fields, controller/cache behavior, service save/validation path and exact current update defect are source-bound. STORY-0113 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
