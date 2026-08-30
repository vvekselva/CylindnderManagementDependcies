# STORY-0026 — Import WhatsApp Location Text

- Release: R2
- Endpoint: `POST /customer-address-location/import-whatsapp-export`
- Controller: `CustomerAddressLocationController.importWhatsappText`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The user submits the `Import Locations` button on the WhatsApp import screen. The form posts to `/customer-address-location/import-whatsapp-export` with request parameters named exactly `rawText` and `importedBy`. `rawText` is declared by the controller as `@RequestParam("rawText")` and is therefore required at request binding; `importedBy` is explicitly optional. The HTML textarea itself has no `required` attribute, so an empty submitted string can still reach the service. There is no browser-side parsing, debounce, minimum length or button enable/disable condition.

The controller passes both values directly to `CustomerAddressLocationOfflineMapService.importWhatsappText(rawText, importedBy)` and uses the returned list size as the imported count. In the service, null or trim-empty rawText returns an empty list without writing. Otherwise the text is split by CRLF/LF into individual lines. Each line is independently passed to the coordinate parser. A line with no coordinate match is skipped; a matching coordinate pair is validated for latitude -90..90 and longitude -180..180. Thus only source lines containing a source-proved valid coordinate pair create inbox records.

For every accepted line the service creates `CustomerLocationImportInboxDo` with `sourceType=WHATSAPP_EXPORT_IMPORT`, `rawText=<that individual line>`, parsed latitude/longitude, the submitted importedBy value, `importedAt=now`, and `mappingStatus=UNMAPPED`, then persists it through `CustomerLocationImportInboxJpaDao.save`. The entity maps to `public.tbl_customer_location_import_inbox`: generated `pk_location_import_inbox_id` using sequence `public.pk_customer_location_import_inbox_id_serial`; non-null source_type and raw_text; parsed_latitude/parsed_longitude; optional sender_name/sender_mobile/message_datetime/imported_by; non-null imported_at and mapping_status; optional fk_customer/fk_customer_address and remarks. This import path does not assign customer/address identities yet, which is why rows are staged as UNMAPPED.

After all lines are processed, the controller sets flash `successMessage` exactly to `Imported <count> location row(s) from WhatsApp text.` and redirects to `/customer-address-location/import-whatsapp-export`. The GET then shows the success message and rereads the UNMAPPED inbox list, so newly created rows become visible in the Imported At / Latitude / Longitude / Raw Text / Status table. The controller defines no local catch branch for this POST; parsing/validation or persistence exceptions are not converted into a page-specific error response by this method. No approval occurred.
