# STORY-0025 — Display unmapped WhatsApp location imports

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `f51765b374af0cd9a9a5ec21aeeafb30b959cbfe64cf572c154b15eb5483d050`

A caller requests `GET /customer-address-location/import-whatsapp-export`. The request reaches `CustomerAddressLocationController.showWhatsappImport`, which invokes `CustomerAddressLocationOfflineMapService.fetchUnmappedImports`. The accepted trace proves `CustomerLocationImportInboxJpaDao.findByMappingStatusOrderByImportedAtDesc -> CustomerLocationImportInboxDo -> public.tbl_customer_location_import_inbox -> CustomerLocationImportInboxMapper.toDto`, followed by the terminal view `with-menu/CustomerAddressLocationImport`.

No caller-supplied request values, input normalization, explicit validation failure path, persistence write, audit mutation, file access or external API call is proved for this GET endpoint. No additional business meaning is inferred beyond the source-proved mapping-status retrieval and ordering.

Postcondition: the import view is returned with source-proved import-inbox data and no database mutation is proved.

Evidence: canonical BL-001 row `GET /customer-address-location/import-whatsapp-export`; `logs/runs/PRODUCTION-FIRE-20260824-020143.md`.

Approval is pending explicit user decision for the exact fingerprint above.
