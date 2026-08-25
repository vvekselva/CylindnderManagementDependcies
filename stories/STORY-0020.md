# STORY-0020 — Display challan heatmap metrics and filter options

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `02e05d7aed62a5be46bd270674b5671b434ca0ebdc35391452b9f661edbc2d57`

A caller requests `GET /challan-heatmap`. The request reaches `ChallanHeatmapController.showHeatmap`, which constructs a `ChallanHeatmapFetchRequestDto` without setting `serachQueryData` and invokes `ChallanHeatmapFetchService.processRequest`. The accepted trace proves that this endpoint therefore follows the normal heatmap branch through `ChallanHeatmapMetricsViewJpaDao`, reading `public.vw_challan_heatmap_metrics` for heatmap metrics and distinct book-type, book-code and series-prefix values. `ChallanHeatmapMetricsViewMapper` maps the rows before `final-version-1/ChallanHeatmapDashboard` is returned.

The assigned-book-window branch is explicitly not claimed for this endpoint because the enabling query-data flags are not set by this controller path. No persistence write, state transition, audit mutation, file access or external API call is proved.

Postcondition: the heatmap dashboard is returned from the normal metrics branch with no proved database mutation.

Evidence: canonical BL-001 row `GET /challan-heatmap`; `logs/runs/PRODUCTION-FIRE-20260824-013336.md`.

Approval is pending explicit user decision for the exact fingerprint above.
