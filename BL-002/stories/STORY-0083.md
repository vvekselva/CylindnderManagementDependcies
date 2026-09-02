# STORY-0083 — Submit Yard Stock Check

- Release: R1
- Endpoint: `POST /ingestYardStockCheck`
- Controller: `YardStockCheckIngestionController.doPost`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE_WITH_DRIFT_REVIEW
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0083-yard-stock-check-drift-review-20260902.yaml`

## Business behavior and submitted contract

As a yard operator, I can submit the Yard Stock Check form after assembling audit lines. The final template posts header fields for check date, checked-by, created/completed timestamps and remarks, and dynamic line fields for selected cylinder identity, selected physical-state identity and auditor notes.

The controller binds model `yardStockCheck`, logs the request metadata, and delegates to the typed Yard Stock Check ingestion application service. On successful service completion it redirects to the configured back link. `InvalidInputParameterException` re-renders `final-version-1/YardStockCheckIngestion` with the submitted request, back link and refreshed cylinder-state lookup so validation evidence can be shown. A general application exception returns the same view but the controller catch branch does not source-prove the same model repopulation.

## Exact current validation and persistence path

`YardStockCheckIngestionService.processRequest(...)` is transactional. It calls `YardStockCheckIngestionRequestValidator`, maps/saves the header through `YardStockCheckJpaDao.saveAndFlush`, sets `createdAt=now`, `checkStatus=IN_PROGRESS`, clears completedAt, then processes lines. After line processing it sets the header `checkStatus=COMPLETED`, `completedAt=now` and saves/flushed again.

The current validator requires check date, checked-by, created-at and at least one line. For each line it expects `observedCylinder` plus `observedCylinderState.cylinderStateId` resolving through `CylinderStateJpaDao`.

The current service creates `YardStockCheckLineDo`, links the saved stock-check header, resolves and sets `observedCylinderState`, sets `scannedAt`, copies `observedCylinder`, and saves through `YardStockCheckLineJpaDao`.

Persistence identities are source-bound to `public.tbl_yard_stock_check` and `public.tbl_yard_stock_check_line`. The line entity/schema already supports the stock-check relation, `fk_cylinder`, `observed_cylinder`, `fk_observed_cylinder_state`, `fk_system_cylinder_state`, `state_matches_system`, `auditor_notes` and scanned timestamp.

## Source-proved drift / current broken boundary

The recovered final template posts the selected state using `yardStockCheckDto.checkLines[i].cylinderState.cylinderStateId`, but `YardStockCheckLineDto` has no `cylinderState` property; its matching field is `observedCylinderState`. The template also posts `cylinder.cylinderId` and auditor notes but does not post `observedCylinder`, even though the validator requires that string.

The validator dereferences `getObservedCylinderState().getCylinderStateId()` for logging/DAO lookup before its null guard, so failed binding can produce an uncontrolled null dereference instead of controlled validation evidence.

The service currently does not copy/resolve the submitted cylinder relation onto `YardStockCheckLineDo`, nor copy auditor notes, system cylinder state or `stateMatchesSystem`, although those fields exist in the line model/schema. Therefore the current browser-to-persistence contract is materially incomplete.

The exact proposed application repair, file/method/template anchors, tests, impact and zero-schema-change assessment are isolated in the referenced drift packet. No code/BL-010 implementation is authorized until the user explicitly approves that exact manifest.

## Completion and approval gate

The user flow, controller branches, transaction/header behavior, exact line validation/persistence behavior, database identities and the material current-source defects are now fully source-bound. A Story may describe current defective behavior without authorizing a fix; the defect remains separately code-approval-gated.

STORY-0083 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`. Approval remains pending. No application code was changed and no BL-010 work was created or executed.
