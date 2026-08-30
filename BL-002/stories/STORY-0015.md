# STORY-0015 — Update System Settings

- Release: R2
- Endpoint: `POST /system-settings`
- Controller: `SystemSettingsController.updateSettings`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: SOURCE_DETAIL_REVIEW_REQUIRED
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Governed evidence

The BL-002 story register identifies this story as R2 `POST /system-settings`, controller method `SystemSettingsController.updateSettings`, with trace chain `Controller -> SystemSettingsService`, register review state `READY_FOR_REVIEW`, and note `Generated from BL-001 controller dependency matrix`.

## Exact remaining source-detail gap

The physical Story file was absent. Exact submitted setting fields and requiredness, browser validation, DTO/form binding, service guards, DAO/entity/database writes, transaction behavior, reset/invalidation behavior, redirect/error response and visible outcome require frozen authoritative application-source proof and are not inferred from the trace alone.

No strict-field/UI completion is claimed. No approval occurred.
