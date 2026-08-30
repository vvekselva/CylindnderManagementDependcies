# STORY-0033 — Product UOM Page

- Release: R2
- Endpoint: `GET /product-uom`
- Controller: `ProductUomController.getProductUom`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Governed evidence

The BL-002 story register identifies this story as R2 `GET /product-uom`, controller method `ProductUomController.getProductUom`, trace chain `Controller -> ProductUomService -> ProductUomDto -> ProductUomMapper -> ProductUomDo -> ProductUomJpaDao`, review state `READY_FOR_REVIEW`.

## Exact remaining source-detail gap

The missing physical artifact is repaired. Strict completion still requires frozen-source proof of page/template/model, visible UOM controls/columns, request parameters and browser events, service/DAO read contract and ordering/filtering, entity/table identity, and visible empty/error outcomes.

No strict-field/UI completion is claimed. No approval occurred.
