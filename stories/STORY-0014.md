# STORY-0014 — Create a predefined delivery trip

State: **NEEDS_CLARIFICATION**  
Fingerprint: `2721798676302f09c07f0cd0b1d08341cb5e29ebaa6bf7390291bcdb417932e7`

A caller submits `POST /delivery-planning/predefined-trips/create`. The accepted BL-001 trace proves the ordered chain `PredefinedDeliveryTripController.create -> PredefinedDeliveryTripService.create -> PredefinedDeliveryTripJpaDao -> PredefinedDeliveryTripDo -> public.tbl_predefined_delivery_trip` and therefore proves a persistence write to the predefined-delivery-trip table.

The accepted trace does not preserve the concrete request field names, types, normalization/defaulting rules, validation order, invalid-value handling, or exact response/redirect behaviour. Those details are therefore not inferred and remain `NEEDS_CLARIFICATION`.

Evidence: canonical BL-001 row `POST /delivery-planning/predefined-trips/create`; `logs/runs/INVOCATION-20260823-160000.md` LANE-03.
