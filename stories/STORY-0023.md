# STORY-0023 — Return yard locations as GeoJSON

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `7ebd50e76cf17ec67fb06a406e1b5460a81aaf3db9118c6cd4d94ccecab88b0a`

A caller requests `GET /yard-location/points.geojson`. The request reaches `CustomerAddressLocationController.yardLocationsGeoJson`, which invokes `CustomerAddressLocationOfflineMapService.fetchYardLocationsGeoJson`. The accepted trace proves `YardLocationJpaDao.findActiveYardLocations`, whose native SQL reads `public.tbl_yard_location` joined with `public.tbl_yard_inventory`. `YardLocationMapper.toDto` maps the data before the service generates the GeoJSON response.

No caller-supplied request values, input normalization, explicit validation failure path, persistence write, audit mutation, file access or external API call is proved for this GET endpoint. No extra business rule is inferred.

Postcondition: active yard-location data is returned as generated GeoJSON and no database mutation is proved.

Evidence: canonical BL-001 row `GET /yard-location/points.geojson`; `logs/runs/PRODUCTION-FIRE-20260824-020143.md`.

Approval is pending explicit user decision for the exact fingerprint above.
