# STORY-0025 — WhatsApp Location Import Screen

- Release: R2
- Endpoint: `GET /customer-address-location/import-whatsapp-export`
- Controller: `CustomerAddressLocationController.showWhatsappImport`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0025-local-source-business-behavior-20260902-1644.yaml`

The user enters the offline/LAN WhatsApp-location staging screen through `GET /customer-address-location/import-whatsapp-export`. The GET accepts no request parameters. The controller renders `with-menu/CustomerAddressLocationImport`, reads `customerAddressLocationOfflineMapService.fetchUnmappedImports()`, adds the returned rows to the model as `unmappedImports`, and renders the page. The service performs a read-only lookup filtered to mappingStatus `UNMAPPED`, ordered newest first. No database row is mutated by this GET.

The visible page contains a POST form to `/customer-address-location/import-whatsapp-export` with optional `importedBy`, textarea `rawText`, and submit button `Import Locations`. There are no HTML required/minimum-length/debounce/client-side parsing/enable-disable rules in this template; the actual import behavior belongs to STORY-0026.

Below the form, `Unmapped Imported Locations` renders Imported At, Latitude, Longitude, Raw Text, and Status columns from `unmappedImports`. A flash `successMessage` is conditionally displayed.

The recovered governed ZIP independently confirms the controller, UNMAPPED read filter, exact form fields and visible table. STORY-0025 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
