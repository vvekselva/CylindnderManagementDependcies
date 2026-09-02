# STORY-0096 — Cylinders on Vehicle

- Release: R1
- Endpoint: `POST /search/cylinder/on-vehicle`
- Controller: `RestfulCylinderServices.getCylindersOnVehicle`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

Customer Stop calls this API after customer/address selection with the current `VEHICLE_LOAD_ID`, requested state FULL, Customer Stop flag and page 1/50. Returned rows display serial, current state and quantity; selecting rows records exact persistent cylinder IDs and materializes repeated `fullCylinderIdForDelivery` hidden inputs for the later `/stop` transaction. Empty and request-failure outcomes are rendered explicitly by the page.

The recovered ZIP confirms `RestfulCylinderServices.getCylindersOnVehicle` → `CylindersOnVehicleSearchServiceWithOwnershipModel` → `CylinderLogisticsExecutionLineJpaDao.findActiveVehicleContents` over active logistics execution lines in `public.tbl_cylinder_logistics_execution_line`, resolving `CylinderDo` / `public.tbl_cylinder` and physical identifiers through `CylinderIdentifierJpaDao` / `public.tbl_cylinder_identifier`, returning `CylinderSearchResponseDto`.

This endpoint is read-only; actual order/logistics movement occurs in the downstream stop-ingestion transaction.

## Completion and approval gate

The Customer Stop trigger/payload, selectable cylinder identities, UI propagation, active-logistics read path and read-only business effect are source-bound. STORY-0096 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
