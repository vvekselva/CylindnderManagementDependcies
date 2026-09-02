# STORY-0017 — Customer Location Planning Map

- Release: R2
- Endpoint: `GET /customer-address-location/planning-map`
- Controller: `CustomerAddressLocationController.showPlanningMap`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0017-local-source-business-behavior-20260902-1640.yaml`

The GET takes no parameters and renders `with-menu/CustomerAddressPlanningMap`. The visible screen contains Center latitude (`planningCenterLatitude`, initial 11.024387), Center longitude (`planningCenterLongitude`, initial 76.981745), Radius in meters (`planningRadiusMeters`, initial 25000), `planningPendingOnly` checkbox, and `Load Points` button. It also loads local MapLibre CSS/JS and `cmas-offline-vector-map.js`.

On DOMContentLoaded the page retries up to 20 times at 100 ms intervals waiting for `window.CmasOfflineVectorMap`. Once available it calls `setupCustomerPlanningMap` with the exact element IDs and context path. If the script never becomes available, the visible note becomes `Offline map script did not load. Check /offline-map/js/cmas-offline-vector-map.js` and receives the error class. The initial note is `Loading customer location points from database.`

`setupCustomerPlanningMap` performs an initial render and binds the Load Points button to rerender from the current field values. `renderCustomerPlanningMap` calls the customer GeoJSON endpoint and the yard GeoJSON endpoint, displays loading/error text, adds the returned customer/yard layers, optionally places a planning-center marker and fits the map to returned points.

The page legend identifies verified customers, customers with pending requests, yard location and planning center. The GET itself performs no database mutation; point loading is delegated to the source-proved JavaScript and separate GeoJSON endpoints.

The recovered governed ZIP independently confirms the controller, visible controls/defaults, retry behavior, JavaScript handoff and database-point loading flow. STORY-0017 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
