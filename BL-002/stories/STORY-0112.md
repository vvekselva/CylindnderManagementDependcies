# STORY-0112 — Save Cylinder

- Release: R1
- Endpoint: `POST /domainLookup/cylinder/save`
- Controller: `DomainLookupController.saveCylinder`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0112-cylinder-v185-identity-drift-review-20260902.yaml`

## Business behavior

The Domain Lookup Cylinder tab posts optional cylinderId; required logical `cylinderSerial`, quantity, UOM ID and Product ID; ownership type defaulting to COMPANY_OWNED; optional actual physical identifier; and optional supplier/customer owner IDs. The controller normalizes the logical code/actual identifier/ownership code, builds `CylinderDto`/`CylinderIngestionRequestDto`, delegates to `CylinderIngestionService`, refreshes the Cylinder cache on success, and follows the Domain Lookup inline-validation/PRG result pattern.

`CylinderIngestionService` is transactional. It validates required cylinder/product/UOM/identifier inputs and active-primary identifier uniqueness, resolves the configured ownership type, enforces supplier/customer owner requirements, maps and saves the logical `CylinderDo`, resolves Product/UOM, creates an initial yard-inventory line, and returns a success response.

The recovered source also proves a material V185 conformance drift: `createPrimaryIdentifier` is called for COMPANY_OWNED as well as external assets, even though the frozen V185 model requires no separate active-primary physical identifier for company assets; and response mapping overwrites `responseDto.cylinderSerial` with the actual physical identifier instead of preserving the stable logical cylinder serial. The exact service/test correction is isolated in the referenced approval-gated packet. No schema change is proposed.

## Completion and approval gate

The complete controller fields/normalization, ownership-specific service/persistence path, yard initialization, response behavior and exact current V185 mismatch are source-bound. STORY-0112 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
