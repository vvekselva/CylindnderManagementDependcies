# STORY-0079 — Set Customer Active

- Release: R1
- Endpoint: `POST /setCustomerActive`
- Controller: `ToggleCustomerActiveStatusController.setCustomerActive`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Review state: READY_FOR_USER_REVIEW
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

As an operator on the Customer List, I can reactivate an inactive customer without recreating or replacing the customer row. `confirmActivate(customerId, customerName)` opens the activation confirmation modal, writes the selected row identity into hidden `#activate-form-id`, and submits `#activate-form` to `POST /setCustomerActive` after confirmation.

The standard form posts required `customerId`, `returnPage`, and `itemsPerPage`, with CSRF when available. It does not source-prove a posted `searchTerm`, although the controller accepts one optionally.

The controller calls `CustomerActiveStateUpdateService.updateActiveStatus(customerId, true)`. The transactional service invokes `CustomerJpaDao.updateActiveStatus(customerId, true)`. The repository uses JPQL `UPDATE CustomerDo c SET c.active = :status WHERE c.customerId = :id`; therefore the exact persistence effect is to set the identified `public.tbl_customer` row's active flag true without inserting or deleting the customer.

When a row is updated, flash `message` is `Customer activated successfully`; when no row matches, flash `error` is `Customer not found.` Both paths redirect to `/fetchCustomerByPage` with posted page/page-size, appending searchTerm only if one is supplied to the controller.

## Completion and approval gate

The recovered ZIP confirms the modal/browser event, selected identity propagation, exact service/repository update, database effect and visible outcomes. STORY-0079 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Fan-out: BL-004, BL-005, BL-009 and BL-011, subject to post-approval conformance.
- No test execution or coverage is inferred.
