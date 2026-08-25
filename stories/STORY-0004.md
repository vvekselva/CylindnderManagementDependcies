# STORY-0004 — Display the walk-in sale page

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `9d3ea0526fd00ed34ae346a87aa384c6864be62819db08e9873eb4f3f193da5c`

A caller requests `GET /walkin-sale`. The request reaches `WalkinSaleIngestionController.doGet`, which returns the terminal view `final-version-1/WalkinSaleIngestion`.

No request values, normalization, validation, persistence read/write, state change, audit effect, file access, or external API call is proved for this GET endpoint. No additional business rule is inferred. The postcondition is that the walk-in sale page is rendered.

Evidence: canonical BL-001 row `GET /walkin-sale`; `logs/runs/INVOCATION-20260823-145512.md` / LANE-03.

Approval is pending explicit user decision for the exact fingerprint above.
