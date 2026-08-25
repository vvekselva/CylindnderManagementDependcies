# STORY-0021 — Return customer address map points as GeoJSON

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `97a1894f1f35c7eea236fa40223556b268950cca58ce9a889c3d90a8ede1f736`

A caller requests `GET /customer-address-location/points.geojson`. The request reaches `CustomerAddressLocationController.customerAddressPointsGeoJson`, which invokes `CustomerAddressLocationOfflineMapService.fetchCustomerAddressMapPointsGeoJson`. The accepted trace then proves `fetchCustomerAddressMapPoints -> CustomerAddressLocationJpaDao.findCustomerAddressMapPoints`, whose native query reads `public.vw_customer_address_location_status` and `public.tbl_customer_order_request`. The service generates the GeoJSON response in memory.

No caller-supplied request values, explicit normalization, request validation, persistence write, state transition, audit mutation, file dependency or external API call is proved for this GET endpoint. No extra business rule is inferred.

Postcondition: customer-address map data is returned as generated GeoJSON and no database mutation is proved.

Evidence: canonical BL-001 row `GET /customer-address-location/points.geojson`; `logs/runs/PRODUCTION-FIRE-20260824-020143.md`.

Approval is pending explicit user decision for the exact fingerprint above.
