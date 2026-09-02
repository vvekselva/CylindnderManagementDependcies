# STORY-0026 — Import WhatsApp Location Text

- Release: R2
- Endpoint: `POST /customer-address-location/import-whatsapp-export`
- Controller: `CustomerAddressLocationController.importWhatsappText`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0026-local-source-business-behavior-20260902-1642.yaml`

The user submits the `Import Locations` button on the WhatsApp import screen. The form posts to `/customer-address-location/import-whatsapp-export` with request parameters `rawText` and optional `importedBy`. The HTML textarea itself has no required/minimum-length/debounce rule.

The controller passes both values directly to `CustomerAddressLocationOfflineMapService.importWhatsappText(rawText, importedBy)` and uses the returned list size as the imported count. Null or trim-empty text returns an empty list without writing. Otherwise the service splits the text into lines, parses each line for a coordinate pair, skips lines with no coordinate match, and accepts only source-proved valid coordinate pairs.

For each accepted line it creates `CustomerLocationImportInboxDo` with `sourceType=WHATSAPP_EXPORT_IMPORT`, raw line text, parsed latitude/longitude, importedBy, importedAt=now, and `mappingStatus=UNMAPPED`, then saves through `CustomerLocationImportInboxJpaDao`. Customer/address identities are not assigned by this import step.

After processing, the controller flashes `Imported <count> location row(s) from WhatsApp text.` and redirects to the import GET, where the UNMAPPED rows are reread and displayed. There is no local catch branch in this POST handler.

The recovered governed ZIP independently confirms the request fields, per-line parsing/skipping, staged UNMAPPED persistence and visible result. STORY-0026 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
