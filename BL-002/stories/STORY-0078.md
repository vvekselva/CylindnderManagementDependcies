# STORY-0078 — Set Customer Inactive

- Release: R1
- Endpoint: `POST /setCustomerInactive`
- Controller: `ToggleCustomerActiveStatusController.setCustomerInactive`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Review state: READY_FOR_USER_REVIEW
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Business behavior

As an operator on the Customer List, I can set a customer inactive without deleting customer data. `confirmInactive(customerId, customerName)` opens the confirmation modal, writes the selected row ID into hidden `#inactive-form-id`, and submits hidden form `#inactive-form` to `POST /setCustomerInactive` after confirmation.

The form posts required `customerId`, `returnPage`, and `itemsPerPage`, plus CSRF when available. The inspected standard form does not post `searchTerm`, although the controller accepts it optionally, so preservation of an active search term is not claimed for this browser path.

The controller calls `CustomerActiveStateUpdateService.updateActiveStatus(customerId, false)`. The service is transactional and calls `CustomerJpaDao.updateActiveStatus(customerId, false)`. The repository is a direct JPQL modifying query: `UPDATE CustomerDo c SET c.active = :status WHERE c.customerId = :id`. `CustomerDo` maps the customer row in `public.tbl_customer`, so the exact persistence effect is to set the identified customer's active flag false without deleting the row.

When at least one row is updated, flash `message` is `Customer deactivated successfully`; when no row matches, flash `error` is `Customer not found.` Both paths redirect to `/fetchCustomerByPage` with posted page/page-size, appending searchTerm only if one was actually supplied to the controller.

## Completion and approval gate

The recovered ZIP confirms the modal/browser event, request identity, exact service/repository update, database row effect and visible success/not-found outcomes. STORY-0078 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Fan-out: BL-004, BL-005, BL-009 and BL-011, subject to post-approval conformance.
- No test execution or coverage is inferred.
