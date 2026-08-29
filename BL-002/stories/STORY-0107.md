# STORY-0107 — Cylinders on Vehicle

- Release: R1
- Endpoint: `POST /search/cylinder/on-vehicle`
- Controller: `RestfulCylinderServices.getCylindersOnVehicle`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Supplier Stop screen behavior
After a supplier is selected, `loadExchange(supplierId)` resets pickup/dropoff selections, renders the summary, shows the exchange section and resets loading/error/table states. Its vehicle-stock request is exactly `POST /search/cylinder/on-vehicle` with `Content-Type: application/json` and JSON `serachQueryData:{state:'FULL', MULTIPLE_STATE_SEARCH:'TRUE', SUPPLIER_STOP:'TRUE', STATES:['FULL'], VEHICLE_LOAD_ID:parseInt(LOAD_ID)}`, plus `searchTermRequiredForFiltering:''`, `pageNumber:1`, `itemsPerPage:50`.

## Visible result and selection
The response consumes `cylinderDtos`. Rows display serial, current state and quantity. Each checkbox invokes `toggle('dropoff', cylinderId, cylinderSerial, checked)`. Selection stores exact cylinder IDs/serials; deselection removes by ID. Summary rendering writes repeated hidden fields `emptyCylinderDropOffToSuppliers=<id>` for downstream Supplier Stop submission. Request failure exposes the vehicle error state.

## Controller/service/database contract
`RestfulCylinderServices.getCylindersOnVehicle` accepts the JSON DTO, creates `Pageable`, and delegates to `cylindersOnVehicleSearchServiceWithOwnershipModel.searchWithText`. The controller documents that active execution reads physical vehicle-load contents from active `tbl_cylinder_logistics_execution_line`, replacing the legacy current-status implementation. `CylinderSearchResponseDto` is returned; application exceptions become an empty response DTO.

## Reset/invalidation
Each `loadExchange` invocation clears prior pickup/dropoff arrays before fetching new supplier/vehicle data, preventing a previous supplier's selected cylinder IDs from carrying into the new exchange.

## Approval boundary
Strict field/UI contract is complete from frozen Supplier Stop UI plus active controller contract. Approval remains pending.
