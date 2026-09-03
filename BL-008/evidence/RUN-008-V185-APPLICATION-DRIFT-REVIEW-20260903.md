# BL-008 V185 Application Drift Review — RUN-008

Run: `CYLINDER-PRODUCTION-FIRE-20260903-143500-IST-RUN-008`
Source baseline: frozen local ZIP SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
Contract: BL-008 V185 frozen database/service-UI acceptance model.

**No application-code mutation is authorized by this packet. Explicit user approval of the exact manifest below is required. No BL-010 rework item was created.**

## Drift A — Company-owned ingestion creates a physical identifier and returns it as logical serial

Current behavior: `CylinderIngestionService` saves `CylinderDo.cylinderSerial` from the logical code, then unconditionally calls `createPrimaryIdentifier(...)`; that helper persists an active-primary `CylinderIdentifierDo` for every ownership type. The response subsequently overwrites `CylinderDto.cylinderSerial` with `actualIdentifier`.

Approved V185 behavior: COMPANY_OWNED has no logical/physical split; `tbl_cylinder.cylinder_serial` is the company cylinder identity and requires zero separate active-primary physical-identifier rows.

Business impact: company assets can acquire an external-style identifier row and the response can expose a different value in the logical serial field, violating stable identity/display semantics.

Exact proposed locations:
1. Repository/ref: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`; file `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/services/CylinderIngestionService.java`; class `CylinderIngestionService`; method `processRequest`; anchor lines ~132-145. Proposed change: invoke `createPrimaryIdentifier(...)` only for external exchangeable ownership (`SUPPLIER_OWNED` / `CUSTOMER_OWNED`), and keep response `cylinderSerial` equal to `saved.getCylinderSerial()`; use the physical/display fields separately where applicable.
2. Same file/class; method `createPrimaryIdentifier`; anchor lines ~254-274. Proposed change: add/retain a defensive external-ownership guard so COMPANY_OWNED can never persist a separate identifier row through this helper.

Tests: extend `BL008V185CylinderIngestionServiceTest` for zero identifier saves on COMPANY_OWNED, logical serial preservation in response, and one active-primary identifier for supplier/customer assets. DB impact: NONE; V185 remains frozen.

## Drift B — Yard-by-state search overwrites logical cylinder serial

Current behavior: `AvailableYardCylinderByStateSearchService.mapYardInventoryLineToCylinderDto` first sets `cylinderSerial` from `CylinderDo`, then overwrites it with active-primary identifier value when one exists.

Approved V185 behavior: logical cylinder serial remains the stable transaction/display identity component; physical identifier belongs in `actualCylinderIdentifier` / `displayCylinderIdentifier` fields.

Business impact: external assets returned from yard search can lose their logical ID in `cylinderSerial`, breaking logical-key preservation for consuming screens.

Exact proposed location: repository/ref above; file `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/search/services/AvailableYardCylinderByStateSearchService.java`; class `AvailableYardCylinderByStateSearchService`; method `mapYardInventoryLineToCylinderDto`; anchor lines ~257-270. Proposed change: remove the `setCylinderSerial(identifier.getIdentifierValue())` overwrite while retaining dedicated physical identifier fields.

Tests: add/update V185 search contract tests for company/external logical serial preservation and physical field population. DB impact: NONE.

## Drift C — On-vehicle search overwrites logical cylinder serial

Current behavior: `CylindersOnVehicleSearchServiceWithOwnershipModel.mapToCylinderDto` likewise overwrites the logical `cylinderSerial` with active physical identifier value.

Approved V185 behavior and impact: same logical-key preservation rule as Drift B; vehicle/logistics consumers must keep `tbl_cylinder.pk_cylinder_id`/logical serial stable while physical identifiers are separate display/custody attributes.

Exact proposed location: repository/ref above; file `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/search/services/CylindersOnVehicleSearchServiceWithOwnershipModel.java`; class `CylindersOnVehicleSearchServiceWithOwnershipModel`; method `mapToCylinderDto`; anchor lines ~136-149. Proposed change: remove only the physical-value overwrite of `cylinderSerial`; retain active identifier mapping to dedicated fields.

Tests: add/update source-contract and service tests for company/supplier/customer assets on vehicle. DB impact: NONE.

## Drift D — Supplier replacement requires permanent owner instead of actual refill context

Current behavior: `SupplierRefillIdentifierReplacementService.applyIfRequested` rejects replacement unless `cylinderDo.ownerSupplierId == supplierDo.supplierId`, even though the persisted `SupplierRefillCollectionLineDo` links to a `SupplierRefillCollectionDo` whose supplier records the actual refill/collection context.

Approved V185 behavior: ownership and custody/refill context are separate; physical replacement is validated against the actual valid custody/refill context at replacement time, not permanent ownership alone.

Business impact: a supplier-owned exchangeable logical asset legitimately refilled/returned through another valid supplier context can be rejected even when the persisted collection event proves the supplier handling the physical replacement.

Exact proposed location: repository/ref above; file `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/services/SupplierRefillIdentifierReplacementService.java`; class `SupplierRefillIdentifierReplacementService`; method `applyIfRequested`; anchor lines ~46-62. Proposed change: replace the owner-supplier equality gate with validation that the persisted `collectionLineDo.getSupplierRefillCollection().getSupplier().getSupplierId()` exists and equals the supplied refill `supplierDo.getSupplierId()`; retain SUPPLIER_OWNED/exchangeable and persisted-collection guards. Do not change permanent ownership.

Tests: extend `BL008V185SupplierReplacementServiceTest` with (a) non-owner but matching persisted refill supplier allowed, (b) supplier mismatching persisted refill context rejected, (c) permanent owner unchanged, (d) identifier replacement function invoked only after context validation. DB impact: NONE; no migration/constraint change proposed.

## Expansion rule

Only the exact locations and behavioral changes listed above are in this manifest. Domain Lookup conditional UI treatment is not included because this RUN-008 packet did not establish a sufficiently exact source anchor for that scope. Any additional file, method, UI template, normalization rule, database object, or behavior requires a new explicit user approval packet.
