# STORY-0111 — Save Product

- Release: R1
- Endpoint: `POST /domainLookup/product/save`
- Controller: `DomainLookupController.saveProduct`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0111-product-update-drift-review-20260902.yaml`

## Business behavior

The Product tab submits Product identity/name plus selected Product Category and Product UOM reference IDs and tax/value fields through `DomainLookupController.saveProduct`. The controller builds `ProductDto`/`ProductIngestionRequestDto`, classifies create/update by submitted Product identity, delegates to `ProductIngestionService`, refreshes Product cache on success, and follows the Domain Lookup inline-validation/PRG success/error pattern.

`ProductIngestionService` validates a nonblank product name, currently rejects when `findByProductNameContainingIgnoreCase(name)` returns any row, maps the DTO, resolves Category/UOM by submitted IDs when present in their repositories, saves through `ProductJpaDao`, and returns the saved product DTO.

The recovered source therefore exposes two current conformance gaps: update duplicate validation does not exclude the same product ID and uses contains rather than exact uniqueness; category/UOM lookup absence is not converted into a specific controlled reference-validation error. The exact proposed service/repository/test remediation is isolated in the referenced approval-gated drift packet.

## Completion and approval gate

The submitted identity/reference contract, controller/cache outcomes, service mapping/save behavior and exact current defects are source-bound. STORY-0111 is `APPROVED_AFTER_REWORK` by explicit user approval on 2026-09-04, with downstream fan-out requested.

Approval is explicitly recorded. Existing drift/code-remediation packets remain independently approval-gated; no application-code or BL-010 mutation is authorized by this Story approval.
