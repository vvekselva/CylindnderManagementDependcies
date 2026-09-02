# STORY-0110 — Save Product UOM

- Release: R1
- Endpoint: `POST /domainLookup/productUom/save`
- Controller: `DomainLookupController.saveProductUom`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0110-product-uom-update-drift-review-20260902.yaml`

## Business behavior

The Product UOM tab posts optional `productUomId`, required `productUom`, and optional description. The controller preserves the ID, trims/uppercases UOM, trims description, determines add vs update from ID null/zero, delegates `ProductUomIngestionRequestDto`, refreshes only the Product UOM cache on successful persistence and redirects back to the Product UOM tab with add/update-specific success text. User-input validation can re-render the form with the failed DTO; other failures redirect with an error flash.

`ProductUomIngestionService` validates the request/value, then currently rejects whenever `ProductUomJpaDao.findByProductUomContainingIgnoreCase(value)` returns any row. It maps to `ProductUomDo`, saves via the repository and returns the saved DTO.

The current duplicate validation does not exclude the same `productUomId` during update and uses contains rather than exact business-key equality. That creates a source-proved update/uniqueness drift. The exact service/repository/test remediation is isolated in the referenced approval-gated packet; no code implementation is authorized yet.

## Completion and approval gate

The submitted fields, normalization, controller/cache/PRG behavior, service save/validation path and exact current defect are source-bound. STORY-0110 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
