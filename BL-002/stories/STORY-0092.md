# STORY-0092 — Cylinders by Customer

- Release: R1
- Endpoint: `POST /search/cylinder/by-customer`
- Controller: `RestfulCylinderServices.getCylindersByCustomer`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

After Customer Stop customer/address selection, the browser issues `POST /search/cylinder/by-customer` with customer identity in `serachQueryData.CUSTOMER_ID`, requested states EMPTY/FULL, and page 1/50. Returned cylinder rows display serial, current state and quantity and can be selected for pickup. Selected persistent cylinder IDs are materialized as repeated hidden `emptyCylinderIdForYard` fields for the later `/stop` transaction; deselection removes the exact ID.

The recovered ZIP confirms `RestfulCylinderServices.getCylindersByCustomer`, `CylindersByCustomerSearchServiceWithOwnershipModel`, `CustomerHeldCylinderSearchJpaDao.findActiveCustomerHeldCylinders` and ownership/custody projection reads including `public.vw_cylinder_party_custody_with_identifiers`, with cylinder/product identities from the corresponding base entities/tables. Empty and request-failure browser outcomes are explicitly rendered.

This API is read-only. It identifies eligible customer-held cylinders; custody movement occurs only when the downstream stop-ingestion transaction executes.

## Completion and approval gate

The dependent trigger, exact request identity/state payload, selectable persistent IDs, UI propagation, ownership-aware read path and no-result/error behavior are source-bound. STORY-0092 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
