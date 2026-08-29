# STORY-0083 — Submit Yard Stock Check

- Release: R1
- Endpoint: `POST /ingestYardStockCheck`
- Controller: `YardStockCheckIngestionController.doPost`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As a yard operator, I can complete the stock-check form after assembling cylinder audit lines. Spring binds audit metadata and each indexed cylinder/state/note line into `YardStockCheckIngestionRequestDto`; the controller sends the DTO to the typed application service. Success redirects to the configured back/home link. Validation failure keeps the submitted DTO and cylinder-state lookup available and re-renders the form.

## Exact submitted contract

`POST /ingestYardStockCheck` binds model attribute `yardStockCheck`. Header fields are `yardStockCheckDto.checkDate`, `checkedBy`, `createdAt`, `completedAt`, `remarks`. Each dynamic line submits `yardStockCheckDto.checkLines[i].cylinder.cylinderId`, `yardStockCheckDto.checkLines[i].cylinderState.cylinderStateId`, and `yardStockCheckDto.checkLines[i].auditorNotes`. Client removal re-indexes all remaining list names before submit.

## Controller/service contract

Controller logs the incoming DTO. If `yardStockCheckDto` is non-null it logs check date, checked-by, and line count (0 when `checkLines` is null). It calls `ICylinderManagementApplicationService<YardStockCheckIngestionRequestDto,YardStockCheckIngestionResponseDto>.processRequest(requestDto)`.

## Branch / visible outcome

- Success: returns `redirect:` + configured `BACK_LINK`.
- `InvalidInputParameterException`: re-renders `final-version-1/YardStockCheckIngestion` with submitted `yardStockCheck`, `backLink`, and refreshed `CYLINDER_STATES` from `LookupDataCache`; submitted values are therefore retained for rendering rather than replaced with a blank DTO.
- `CylinderManagementApplicationException`: logs the application error and returns the same view name, but the catch branch does not add the form/back-link/state model objects; no richer visible error behavior is invented.

## Persistence boundary

The mutation boundary proved here is the typed `yardStockCheckIngestionService.processRequest(requestDto)` call. Exact selected identities are cylinder IDs and cylinder-state IDs propagated from the browser line list. Deeper repository/table behavior is not invented where the inspected frozen source does not expose it.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/YardStockCheckIngestionController.java`
- `cylindermanagement.web/src/main/resources/templates/final-version-1/YardStockCheckIngestion.html`

## Approval boundary

Strict field/UI source enrichment is complete. Approval remains `PENDING_USER_APPROVAL`; no auto-approval, Use Case grouping, or testing-readiness promotion is performed.
