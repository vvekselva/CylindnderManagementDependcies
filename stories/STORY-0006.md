# STORY-0006 — Return the offline map style JSON

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `8de2952b18665432b67386fa6de5da875ebdc5297e35d9141090aae03cb21fa5`

A caller requests `GET /offline-map/style.json`. The request reaches the OfflineMapController style path. The proved chain uses `OfflineMapProperties` together with the request base URL and returns terminal JSON.

No input normalization, invalid-value branch, database write, state transition, audit effect, or external API call is asserted because those behaviours are not proved by the accepted canonical row. The postcondition is that the style JSON response is returned.

Evidence: canonical BL-001 row `GET /offline-map/style.json`; `logs/runs/INVOCATION-20260823-160000.md` / LANE-02.

Approval is pending explicit user decision for the exact fingerprint above.
