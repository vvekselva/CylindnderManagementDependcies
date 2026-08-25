# STORY-0007 — Return offline map status JSON

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `6861a33eef06f56360008bca455a5aa78bd38718cacc6567fb12868e9f4d9a5f`

A caller requests `GET /offline-map/status-json`. The request reaches the OfflineMapController status-json path. The accepted dependency chain reaches the MBTiles file, SQLite metadata, and frontend classpath resources before terminal JSON is returned.

No input normalization, validation branch, write operation, state transition, audit effect, or external API call is asserted because those behaviours are not proved by the accepted canonical row. The proved data activity is read-oriented only.

Evidence: canonical BL-001 row `GET /offline-map/status-json`; `logs/runs/INVOCATION-20260823-160000.md` / LANE-02.

Approval is pending explicit user decision for the exact fingerprint above.
