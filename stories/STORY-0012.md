# STORY-0012 — Display the yard location upload page with active yards

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `9a2ad04609d2ab03387f065289116814f23b4260328afe551e7fa94fe100fa1d`

A caller requests `GET /yard-location/upload`. The request reaches `CustomerAddressLocationController.showYardLocationUpload`, which calls `CustomerAddressLocationOfflineMapService.fetchActiveYardsForLocationCapture`. The service calls `YardInventoryJpaDao.findByActiveTrueOrderByYardNameAsc`, which reads `YardInventoryDo` records from `public.tbl_yard_inventory`. The accepted repository contract proves active-yard selection and ordering by yard name. The controller then renders `with-menu/YardLocationUpload` with that data.

No caller-supplied request values, normalization/defaulting, explicit input validation, persistence write, state change, audit effect, file access, or external API call is proved for this endpoint. No additional business rule or error branch is inferred beyond the accepted trace.

Postcondition: the yard-location upload page is rendered using the returned active-yard data, with no proved database mutation.

Evidence: canonical BL-001 row `GET /yard-location/upload`; `logs/runs/PRODUCTION-FIRE-20260824-020143.md` endpoint 3.

Approval is pending explicit user decision for the exact fingerprint above.
