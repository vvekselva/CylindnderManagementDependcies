# STORY-0131 — Save State

- Release: R1
- Endpoint: `POST /lookupManagement/state/save`
- Controller: `LookupManagementController.saveState`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0131-state-save-drift-review-20260902.yaml`

## Business behavior

The State tab lets an operator add or edit a State reference. `POST /lookupManagement/state/save` accepts optional `stateId` and required `stateName` and `description`. The controller preserves the ID, trims the state name, copies description into `StateDto`, wraps it in `StateIngestionRequestDto`, and delegates to `StateIngestionService`. Null/zero ID is treated as create and nonzero as update.

On successful application processing the controller refreshes the State cache and redirects to `/lookupManagement?tab=state`, displaying create/update-specific success text. A user-input validation exception carrying the expected State request is rendered directly through the Lookup Management view with `failedStateDto`, the State tab active and the lookup collections restored; other failures redirect with an error flash.

## Exact service and persistence behavior

`StateIngestionService.processRequest(...)` validates request/State DTO/state name, then currently calls `InvalidInputParameterException.throwInputValidationFailure(...)` with a **CountryIngestionRequestDto** for that State validation failure. The same branch also contains a second generic validation-failure call. This is inconsistent with the controller branch that expects `StateIngestionRequestDto` to preserve inline validation evidence.

The service next rejects any request for which `StateJpaDao.findByStateNameContainingIgnoreCase(stateName)` returns a row. When validation passes, `StateMapper` maps to `StateDo` and `StateJpaDao.saveAndFlush(...)` persists the row. `StateDo` maps `public.tbl_state`, primary key `pk_state_id`, sequence `public.pk_state_id_serial`, unique non-null `state_name`, and non-null `description`. The saved State is mapped into a SUCCESS response.

## Source-proved drift

Two current defects are source-bound:

1. Invalid State input emits the wrong request-DTO type (`CountryIngestionRequestDto`), which can prevent the controller's intended inline State-validation branch.
2. Duplicate validation uses contains/ignore-case and does not exclude the submitted `stateId` during update, allowing same-row and substring false-positive duplicate rejection.

The database already enforces exact uniqueness on `state_name`; no schema change is required. The exact service/repository/test remediation is isolated in `BL-002/evidence/STORY-0131-state-save-drift-review-20260902.yaml` and remains implementation-blocked pending explicit user approval.

## Completion and approval gate

The recovered ZIP binds the form/controller behavior, validation branches, repository/entity/table path, cache refresh, visible outcomes and both current defects. STORY-0131 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains `PENDING_USER_APPROVAL`. No application code was changed and no BL-010 work was created or executed.
