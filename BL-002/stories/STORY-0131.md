# STORY-0131 — Save State

- Release: R1
- Endpoint: `POST /lookupManagement/state/save`
- Controller: `LookupManagementController.saveState`
- Approval: APPROVED_AFTER_REWORK
- Approval evidence: `BL-002/approval-evidence/STORY-0131-approval-20260902.md`
- Review state: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Fan-out: REQUESTED_TO_BL004_BL005_BL009
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

The database already enforces exact uniqueness on `state_name`; no schema change is required. The exact service/repository/test remediation is isolated in `BL-002/evidence/STORY-0131-state-save-drift-review-20260902.yaml`. Story approval does not by itself authorize implementation of that separate exact drift manifest.

## Approval and fan-out gate

**APPROVED_AFTER_REWORK.** The user explicitly approved this Story on 2026-09-02 and explicitly requested fan-out. BL-004, BL-005 and BL-009 fan-out is requested under the governed post-approval conformance/testing policy. The documented current-state defects remain part of the approved contract until separately authorized remediation is implemented and tested.
