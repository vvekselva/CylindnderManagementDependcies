# STORY-0005 — Display customer address location upload page

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `b7fc11260c26f85a28abbc33f5540674cd05084e92f9dd0de58f4b2e535a2b0d`

A caller requests `GET /customer-address-location/upload`. The request reaches `CustomerAddressLocationController.showUpload`, which returns the customer-address location upload view.

No request values, normalization/defaulting, validation, persistence read/write, state change, audit effect, file access, or external API call is proved for this endpoint. No additional business rule is inferred. The postcondition is that the upload page is rendered.

Evidence: canonical BL-001 row `GET /customer-address-location/upload`; `logs/runs/PRODUCTION-FIRE-20260824-020143.md`.

Approval is pending explicit user decision for the exact fingerprint above.
