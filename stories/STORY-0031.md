# STORY-0031 — Complete a vehicle trip and return cylinders to yard records

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `bec09f914e6bf1601fda2adb2704c547f06765174bc5f0f6f8961561ee9bc014`

A caller submits `POST /complete-trip`. The accepted BL-001 trace shows the request reaching `CompleteTripController.completeTrip`, which delegates to `CompleteTripServiceImpl.processRequest` and runs `CompleteTripRequestValidator.validate` before the success path continues.

The proved validation flow reads the vehicle load, related logistics execution, active logistics lines, allowed yard states and any existing active yard-inventory line. The accepted trace proves these checks but does not enumerate the exact caller-visible validation messages or HTTP/error status behavior, so those details are intentionally not invented.

On the proved successful path, the service reads and updates the logistics execution and its active lines, creates a yard entry, resolves the active yard inventory and source type, resolves the cylinder state, and creates the yard inventory line. It then resolves the trip status, updates the vehicle trip, resolves the stop type and creates the yard-end trip stop. Cylinder identity is read from the active logistics-line association to `CylinderDo` / `public.tbl_cylinder`.

The proved persistence set includes `public.tbl_cylinder_logistics_execution`, `public.tbl_cylinder_logistics_execution_line`, `public.tbl_yard_entries`, `public.tbl_yard_inventory_line`, `public.tbl_vehicle_trip` and `public.tbl_vehicle_trip_stop`, with supporting reads from `public.tbl_vehicle_load`, `public.tbl_yard_inventory_allowed_state`, `public.tbl_cylinder_states`, `public.tbl_yard_inventory`, `public.tbl_yard_inventory_source_type`, `public.tbl_trip_status`, `public.tbl_stop_type` and `public.tbl_cylinder`.

Postcondition: the source-proved yard, logistics and trip persistence paths have executed and the controller returns `redirect:ViewConstants.REDIRECT_HOME_LINK`.

Evidence: canonical BL-001 row `POST /complete-trip`; `logs/runs/PRODUCTION-FIRE-20260824-000114.md`.

Approval is pending explicit user decision for fingerprint `bec09f914e6bf1601fda2adb2704c547f06765174bc5f0f6f8961561ee9bc014`.
