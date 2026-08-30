# STORY-0016 — Customer Address Location Upload Screen

- Release: R2
- Endpoint: `GET /customer-address-location/upload`
- Controller: `CustomerAddressLocationController.showUploadForm`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Governed evidence

The BL-002 story register identifies this story as R2 `GET /customer-address-location/upload`, controller method `CustomerAddressLocationController.showUploadForm`, with trace chain `Controller -> CustomerAddressLocationOfflineMapService`, register review state `READY_FOR_REVIEW`, and note `Generated from BL-001 controller dependency matrix`.

## Exact remaining source-detail gap

The physical Story file was absent. The strict screen-entry contract still requires frozen-source proof for request parameters/model defaults, exact visible controls, browser events, coordinate/source parsing and local validation, hidden propagation, dependent APIs, service/DAO read identities, and visible success/error states. These details are not invented from neighboring yard/customer-location stories.

No strict-field/UI completion is claimed. No approval occurred.
