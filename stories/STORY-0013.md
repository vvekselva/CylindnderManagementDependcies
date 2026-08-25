# STORY-0013 — Display predefined delivery trips with planning metrics and stops

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `04de66353dc5b5f90124a0b393160f92f8e7d2994f288113defc362c158400a7`

A caller requests `GET /delivery-planning/predefined-trips`. The request reaches `PredefinedDeliveryTripController`, which uses `PredefinedDeliveryTripService` for trip, metrics and stop-row data and `DeliveryPlanningStopService.list` for planning-stop data. The accepted source trace proves reads from `public.tbl_predefined_delivery_trip`, `public.tbl_predefined_delivery_trip_stop`, `public.tbl_delivery_planning_stop`, `public.vw_customer_address_location_status`, and `public.vw_customer_delivery_planning_signal`; the two views are explicitly referenced by the metrics query.

No caller-supplied request values, input normalization, explicit validation failure path, persistence write, state transition, audit mutation, file access or external API call is proved for this GET endpoint. No additional business rule is inferred.

Postcondition: the page response is assembled from the source-proved trip, stop and metrics dependencies without a proved database mutation.

Evidence: canonical BL-001 row `GET /delivery-planning/predefined-trips`; `logs/runs/INVOCATION-20260823-160000.md` LANE-03.

Approval is pending explicit user decision for the exact fingerprint above.
