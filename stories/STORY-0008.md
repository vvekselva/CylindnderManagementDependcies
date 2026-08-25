# STORY-0008 — Retrieve a challan page photo

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `4f33f3f68b8797e03962b8775008ee72f6848e98784f5de754d86fec344f550a`

A caller requests `GET /challan-page-photo/{challanPagePhotoId}` and supplies `challanPagePhotoId` in the path. The request reaches `ChallanPagePhotoController.retrieveChallanPagePhoto`. The accepted trace reads `public.tbl_challan_page_photo`.

When the persisted photo is available, the endpoint returns a binary HTTP response. The accepted trace also proves a not-found terminal path returning HTTP 404. No additional input-validation rule, business rule, write operation, state transition, or audit side effect is asserted.

Evidence: canonical BL-001 row `GET /challan-page-photo/{challanPagePhotoId}`; `logs/runs/PRODUCTION-FIRE-20260824-053325.md`.

Approval is pending explicit user decision for the exact fingerprint above.
