# STORY-0109 — Save Product Category

- Release: R1
- Endpoint: `POST /domainLookup/productCategory/save`
- Controller: `DomainLookupController.saveProductCategory`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0109-product-category-update-drift-review-20260902.yaml`

## Business behavior

The MVC handler accepts optional `productCategoryId`, required `productCategory`, and optional description. The controller trims/uppercases the category, trims description, uses ID null/zero to classify add vs update, builds `ProductCategoryIngestionRequestDto`, delegates to `ProductCategoryIngestionService`, refreshes only the Product Category cache on success, flashes add/update-specific success text and redirects to `/domainLookup?tab=productCategory`. User-input validation can re-render the page inline with the failed DTO; unexpected failures redirect with an error flash.

The service validates a nonblank request/category, then currently rejects whenever `ProductCategoryJpaDao.findByProductCategoryContainingIgnoreCase(value)` returns any row. It maps the DTO to `ProductCategoryDo`, saves through `ProductCategoryJpaDao`, and returns the saved DTO on success.

That current duplicate check does not exclude the same productCategoryId on update and uses contains rather than exact business-key equality. This creates a source-proved add/update conformance defect. The exact proposed service/repository/test repair is isolated in the referenced approval-gated packet; no implementation is authorized yet.

## Completion and approval gate

The submitted fields, normalization, controller branches/cache refresh, service validation/save behavior, visible outcome and exact current defect are source-bound. STORY-0109 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
