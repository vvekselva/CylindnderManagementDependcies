# STORY-0019 — Display challan-entry aging dashboard tracker and audit data

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `e5cc9367faaa515747f750c99184ebcaae0d11e7e4acaa7d7dca65bafce9a2ac`

A caller requests `GET /challan-entry-aging-dashboard`. The request reaches `ChallanEntryAgingDashboardController.showChallanEntryAgingDashboard`, which calls `ChallanEntryAgingDashboardService.fetchDashboard`. The accepted trace proves two read branches: tracker status/count and dashboard rows from `TripChallanEntryTrackerJpaDao -> TripChallanEntryTrackerDo -> public.tbl_trip_challan_entry_tracker`, and audit rows from `TripChallanEntryTrackerAuditJpaDao -> TripChallanEntryTrackerAuditDo -> public.tbl_trip_challan_entry_tracker_audit`. `ChallanEntryAgingDashboardMapper` maps both branches before the terminal view `final-version-1/ChallanEntryAgingDashboard` is returned.

No caller-supplied request values, normalization, explicit validation failure path, persistence write, state transition, file access or external API call is proved for this GET endpoint. No unproved aging policy is inferred from the dashboard name.

Postcondition: the dashboard view is returned from the accepted tracker and audit persistence branches without a proved database mutation.

Evidence: canonical BL-001 row `GET /challan-entry-aging-dashboard`; `logs/runs/PRODUCTION-FIRE-20260824-005711.md`.

Approval is pending explicit user decision for the exact fingerprint above.
