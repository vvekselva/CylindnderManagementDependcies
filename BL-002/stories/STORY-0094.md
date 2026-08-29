# STORY-0094 — Yard Cylinders by State

- Release: R1
- Endpoint: `POST /search/cylinder/by-state`
- Controller: `RestfulCylinderServices.getCylindersByState`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Contract
This read-only yard-stock search is source-proved as `RestfulCylinderServices.getCylindersByState` -> `AvailableYardCylinderByStateSearchService.searchWithText` -> `YardInventoryLineJpaDao.findYardProductWiseEmptyFullCounts / findActiveYardCylindersByStateNames*` -> `YardInventoryLineDo` / `public.tbl_yard_inventory_line` -> `CylinderDo` / `public.tbl_cylinder`, with identifier resolution through `CylinderIdentifierJpaDao` / `CylinderIdentifierDo` / `public.tbl_cylinder_identifier`, returning `YardCylinderStockResponseDto`.

The endpoint reads active yard inventory constrained by requested state names and exposes cylinder/identifier stock data. No mutation is performed. Frozen evidence does not attach a unique screen event or debounce/hidden-field rule to this endpoint, so such UI behavior is not invented.

## Approval boundary
Strict applicable source contract is complete. Approval remains pending.
