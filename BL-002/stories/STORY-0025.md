# STORY-0025 — WhatsApp Location Import Screen

- Release: R2
- Endpoint: `GET /customer-address-location/import-whatsapp-export`
- Controller: `CustomerAddressLocationController.showWhatsappImport`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The user enters the offline/LAN WhatsApp-location staging screen through `GET /customer-address-location/import-whatsapp-export`. The GET accepts no request parameters. The controller creates `with-menu/CustomerAddressLocationImport`, reads `customerAddressLocationOfflineMapService.fetchUnmappedImports()`, adds the returned rows to the model as `unmappedImports`, and renders the page. The service executes a read-only lookup through `CustomerLocationImportInboxJpaDao.findByMappingStatusOrderByImportedAtDesc("UNMAPPED")`, maps the rows to DTOs, and therefore exposes only currently UNMAPPED inbox records ordered newest first. No database row is mutated by this GET.

The visible page title is `Import WhatsApp Locations` / `Paste WhatsApp Export / Message Text`. Its explanatory text states that rows containing coordinates will be staged as unmapped location inbox records. The page contains a POST form to `/customer-address-location/import-whatsapp-export` with visible optional text input named exactly `importedBy`, textarea named exactly `rawText` with 10 rows, and submit button `Import Locations`. There are no HTML `required`, minimum-length, debounce, client-side parsing, enable/disable or hidden-field rules on these controls in this template; the actual import behavior belongs to STORY-0026.

Below the form, `Unmapped Imported Locations` is rendered as a table from model `unmappedImports`. Exact visible columns are Imported At (`row.importedAt`), Latitude (`row.parsedLatitude`), Longitude (`row.parsedLongitude`), Raw Text (`row.rawText`), and Status (`row.mappingStatus`). A flash `successMessage` is conditionally displayed above the form. The underlying read identity is the customer-location import inbox repository filtered by mappingStatus `UNMAPPED`; the GET performs no write and no approval occurred.
