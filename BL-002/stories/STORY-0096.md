# STORY-0096 — Cylinders on Vehicle

- Release: R1
- Endpoint: `POST /search/cylinder/on-vehicle`
- Controller: `RestfulCylinderServices.getCylindersOnVehicle`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Customer Stop trigger and payload
After customer/address selection, Customer Stop calls `/cylindermanagement/search/cylinder/on-vehicle` with JSON `{ serachQueryData:{ state:'FULL', MULTIPLE_STATE_SEARCH:'TRUE', CUSTOMER_STOP:'TRUE', STATES:['FULL'], VEHICLE_LOAD_ID:parseInt(LOAD_ID) }, searchTermRequiredForFiltering:'', pageNumber:1, itemsPerPage:50 }`.

## Visible result and selection
The UI reads `cylinderDtos`, displaying serial, current state and quantity. Empty data shows `No full cylinders on vehicle / All stock has been delivered`; request failure shows `Failed to load vehicle stock`. Checking a row records exact `cylinderId` and serial in the delivery selection; unchecking removes that ID. Summary rendering creates repeated hidden `fullCylinderIdForDelivery=<id>` fields for later `/stop` submission.

## Service/database path
Canonical trace proves `RestfulCylinderServices.getCylindersOnVehicle` -> `CylindersOnVehicleSearchServiceWithOwnershipModel.searchWithText` -> `CylinderLogisticsExecutionLineJpaDao.findActiveVehicleContents` -> `CylinderLogisticsExecutionLineDo` / `public.tbl_cylinder_logistics_execution_line` -> `CylinderDo` / `public.tbl_cylinder`, with identifier resolution through `CylinderIdentifierJpaDao` / `CylinderIdentifierDo` / `public.tbl_cylinder_identifier`, returning `CylinderSearchResponseDto`.

This endpoint is read-only; the selected cylinder IDs are only candidates for downstream Customer Stop delivery. Actual logistics/order changes happen in stop ingestion, not here.

## Approval boundary
Strict field/UI contract is complete from frozen UI plus canonical trace. Approval remains pending.
