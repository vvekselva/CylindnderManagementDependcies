# STORY-0092 — Cylinders by Customer

- Release: R1
- Endpoint: `POST /search/cylinder/by-customer`
- Controller: `RestfulCylinderServices.getCylindersByCustomer`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Customer Stop trigger and request
After a customer and delivery address are selected, `loadExchange(customerId)` issues the exact POST `/cylindermanagement/search/cylinder/by-customer` with JSON content type. The payload is `{ serachQueryData:{ state:'FULL', MULTIPLE_STATE_SEARCH:'TRUE', STATES:['EMPTY','FULL'], CUSTOMER_ID:parseInt(customerId) }, pageNumber:1, itemsPerPage:50 }`.

## Visible result and selection behavior
The UI reads `data.cylinderDtos`. Each returned row displays `cylinderSerial`, state badge from `currentState`, and `totalQuantity`, plus a pickup checkbox. Empty results show `No cylinders at customer / Nothing to pick up at this location`; request failure shows `Failed to load customer holdings`.

Checking a row appends `{id:cylinderId, serial:cylinderSerial}` to the pickup selection; unchecking removes that exact cylinder ID. `renderSummary()` updates visible pickup tags/count and materializes repeated hidden inputs named `emptyCylinderIdForYard` with the selected cylinder IDs. Those hidden IDs are later bound by `POST /stop` for customer empty pickup.

## Service/database path
Canonical trace proves `RestfulCylinderServices.getCylindersByCustomer` -> `CylindersByCustomerSearchServiceWithOwnershipModel.searchWithText` -> `CustomerHeldCylinderSearchJpaDao.findActiveCustomerHeldCylinders` -> `public.vw_cylinder_party_custody_with_identifiers`, with cylinder/product identities from `public.tbl_cylinder` and `public.tbl_product`, returning `CylinderSearchResponseDto`.

This search endpoint is read-only. The governing identity is `CUSTOMER_ID`; returned `cylinderId` values are selected for downstream movement. No custody change is claimed until the separate stop-ingestion service executes.

## Approval boundary
Strict applicable field/UI contract is complete. Approval remains pending and no testing readiness is inferred.
