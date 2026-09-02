# STORY-0097 — Cylinders by Supplier

- Release: R1
- Endpoint: `POST /search/cylinder/by-supplier`
- Controller: `RestfulCylinderServices.getCylindersBySupplier`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Canonical identity: `release-classification.csv` No. 97
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Identity repair evidence: `BL-002/evidence/STORY-0092-0097-identity-drift-repair-20260902.yaml`

## Business behavior

This ownership-model supplier-holding POST accepts required JSON `CylinderManagementApplicationRequestDto`, creates paging with `PaginationUtils.createPageable`, and delegates to `cylindersBySupplierSearchServiceWithOwnershipModel`. The active search represents cylinders currently held under active SUPPLIER custody; the controller documents current derived state `EMPTY_DELIVERED_FOR_REFILL`.

The downstream search reads supplier custody/identifier data and returns `CylinderSearchResponseDto`. A governed application exception is logged and converted to an empty response DTO. The endpoint does not mutate custody, ownership, state or logistics records.

The current Supplier Stop page may use other dedicated holdings APIs for its browser exchange workflow; no unrelated screen timing or hidden-field behavior is invented for this reusable endpoint.

## Completion and approval gate

The canonical Story identity, JSON/paging contract, supplier custody semantics, response/error behavior and read-only effect are source-bound. STORY-0097 is `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
