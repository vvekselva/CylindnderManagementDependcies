# STORY-0082 — Yard Stock Check Form

- Release: R1
- Endpoint: `GET /ingestYardStockCheck`
- Controller: `YardStockCheckIngestionController.doGet`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As a yard operator, I can open a new Yard Stock Check, with today's audit date prefilled and the configured cylinder states loaded. I can search a cylinder by serial text, see its current system state, select/confirm an observed physical state, add it to the audit list with optional notes, remove/re-index lines, and finally submit the assembled stock-check DTO.

## GET/controller contract

`GET /ingestYardStockCheck` accepts no request parameters. Controller creates `YardStockCheckIngestionRequestDto` + `YardStockCheckDto`, sets `checkDate = LocalDate.now()`, renders `final-version-1/YardStockCheckIngestion`, and exposes `yardStockCheck`, `backLink`, and `CYLINDER_STATES = lookupDataCache.getCylinderStates()`.

## Exact visible/form contract

Form action is `POST /ingestYardStockCheck`, object `${yardStockCheck}`, id `stockCheckForm`. Visible header fields bind `yardStockCheckDto.checkDate`, `checkedBy`, `createdAt`, `completedAt`, and `remarks`. Cylinder search input is `#serialSearch`; physical state selector `#physicalStateSelector` is populated from `CYLINDER_STATES`. The current system state is displayed in disabled `#systemStateValue` after a cylinder selection.

## Search/event contract

On every `input` event, browser trims the serial query. If length is `< 1`, suggestions are hidden and no request occurs. Otherwise it immediately calls `GET /search/cylinder/{encodeURIComponent(query)}` and reads `data.cylinderDtos`. Although a source comment says “Debounced search”, the implementation contains no debounce timer/delay in this handler; therefore no debounce interval is claimed.

Each suggestion visibly shows `cyl.cylinderSerial` and `cyl.currentState || 'UNKNOWN'`. Selecting one sets `currentCyl`, copies its serial into the search box, displays `Current System State: <state>`, and auto-selects the physical-state option when a `CYLINDER_STATES` entry has `cylinderState === cyl.currentState`.

## Add/remove line propagation

`Add to Audit List` requires both `currentCyl` and a selected physical state; otherwise browser alert is exactly `Please select a cylinder and its physical state.` Added rows post hidden `yardStockCheckDto.checkLines[i].cylinder.cylinderId`, select `yardStockCheckDto.checkLines[i].cylinderState.cylinderStateId`, and text `yardStockCheckDto.checkLines[i].auditorNotes`. After add, `currentCyl`, search text, physical state, and system-state display are reset. Remove deletes the row and rewrites every remaining `[index]` in input/select names for Spring list binding; if none remain, the `No cylinders scanned...` empty row is shown.

## Persistence / outcome

This GET performs no persistence. `Complete Stock Check` submits the assembled POST; that mutation is STORY-0083. `Cancel` uses `${backLink}`.

## Frozen source evidence

- `cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/YardStockCheckIngestionController.java`
- `cylindermanagement.web/src/main/resources/templates/final-version-1/YardStockCheckIngestion.html`

## Approval boundary

Strict field/UI source enrichment is complete. Approval remains `PENDING_USER_APPROVAL`; no auto-approval, Use Case grouping, or testing-readiness promotion is performed.
