# STORY-0107 — Cylinders on Vehicle

- Release: R1
- Endpoint: `POST /search/cylinder/on-vehicle`
- Controller: `RestfulCylinderServices.getCylindersOnVehicle`
- Approval: APPROVED_AFTER_REWORK
- Review state: USER_APPROVED
- Rework state: APPROVED_AND_FAN_OUT
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Approval evidence: `BL-002/approval-evidence/STORY-0107-approval-20260905.md`
- Post-approval conformance: CODE_CONFORMANCE_VERIFIED_PASS
- Conformance evidence: `BL-002/evidence/STORY-0107-post-approval-source-conformance-20260905.yaml`

## Business behavior

On Supplier Stop, selecting a supplier resets previous pickup/drop-off selections and triggers the vehicle-stock POST with `VEHICLE_LOAD_ID`, FULL-state criteria, Supplier Stop flag and page 1/50. Returned cylinder rows display serial/current state/quantity; selecting rows stores exact persistent cylinder IDs and materializes repeated `emptyCylinderDropOffToSuppliers` fields for the later stop transaction. Reloading exchange clears stale selection from a previous supplier.

The recovered ZIP confirms `RestfulCylinderServices.getCylindersOnVehicle` creates paging and delegates to the ownership-model `cylindersOnVehicleSearchServiceWithOwnershipModel`. Active execution reads physical vehicle-load contents from active logistics execution lines rather than the legacy current-status model. Governed application failure returns an empty `CylinderSearchResponseDto`.

This endpoint is read-only; actual vehicle/supplier logistics mutation occurs only in downstream stop ingestion.

## Completion and approval gate

The Supplier Stop trigger/payload, selection/reset behavior, ownership-model vehicle-content path and read-only effect are source-bound. STORY-0107 is therefore `APPROVED_AFTER_REWORK` with post-approval code conformance verified.

Explicit user approval was recorded on 2026-09-05. BL-004, BL-005, BL-009 and BL-011 fan-out is authorized after source-bound conformance PASS. No application-code or BL-010 mutation occurred, and no runtime execution or coverage is inferred.
