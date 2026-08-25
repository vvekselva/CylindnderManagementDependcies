# STORY-0026 — Import WhatsApp location text

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `6a79c858a111273b63f712755936739725a0dd09d97ad68e05ed4e6f8dc5cecf`

A caller submits `POST /customer-address-location/import-whatsapp-export`. The request reaches `CustomerAddressLocationController.importWhatsappText`, which invokes `CustomerAddressLocationOfflineMapService.importWhatsappText`. The accepted trace proves `CustomerLocationImportInboxJpaDao.save -> CustomerLocationImportInboxDo -> public.tbl_customer_location_import_inbox -> CustomerLocationImportInboxMapper.toDto`, followed by a redirect to `/customer-address-location/import-whatsapp-export`.

The accepted evidence does not prove the exact submitted field name, requiredness, normalization, parsing format, field-level validation or invalid-value behavior, so none are invented here.

Postcondition: the source-proved import-inbox persistence operation occurs and the caller is redirected to the WhatsApp import route.

Evidence: canonical BL-001 row `POST /customer-address-location/import-whatsapp-export`; `logs/runs/PRODUCTION-FIRE-20260824-020143.md`.

Approval is pending explicit user decision for the exact fingerprint above.
