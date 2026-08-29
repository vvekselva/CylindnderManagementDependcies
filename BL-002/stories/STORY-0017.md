# STORY-0017 — Customer Location Planning Map

- Release: R2
- Endpoint: `GET /customer-address-location/planning-map`
- Controller: `CustomerAddressLocationController.showPlanningMap`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The GET takes no parameters and renders `with-menu/CustomerAddressPlanningMap`. The visible screen contains Center latitude (`planningCenterLatitude`, initial 11.024387), Center longitude (`planningCenterLongitude`, initial 76.981745), Radius in meters (`planningRadiusMeters`, initial 25000), `planningPendingOnly` checkbox, and `Load Points` button. It also loads local MapLibre CSS/JS and `cmas-offline-vector-map.js`.

On DOMContentLoaded the page retries up to 20 times at 100 ms intervals waiting for `window.CmasOfflineVectorMap`. Once available it calls `setupCustomerPlanningMap` with the exact element IDs and context path. If the script never becomes available, the visible note becomes `Offline map script did not load. Check /offline-map/js/cmas-offline-vector-map.js` and receives the error class. The initial note is `Loading customer location points from database.`

The page legend identifies verified customers, customers with pending requests, yard location and planning center. The GET itself performs no database mutation; subsequent point loading is delegated to the offline-map JavaScript and the separate GeoJSON endpoint STORY-0019, so this story does not invent that endpoint's browser details beyond the proven setup handoff. No approval occurred.
