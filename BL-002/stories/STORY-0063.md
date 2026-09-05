# STORY-0063 — Party Custody Traceability

- Release: R1
- Endpoint: `GET /party-custody-traceability`
- Controller: `PartyCustodyTraceabilityController.showTraceability`
- Approval: APPROVED_AFTER_REWORK — FANOUT_REQUESTED
- Review state: READY_FOR_USER_REVIEW
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source field contract: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## User intent and exact request contract
Opening `/party-custody-traceability` renders the Party Custody Traceability dashboard. The GET accepts four optional query parameters: String `partyType`, String `custodyStatus`, Long `tripId`, and String `searchTerm`. The controller passes those exact values to `OwnershipObligationDashboardService.fetchDashboard` and returns `final-version-1/PartyCustodyTraceabilityDashboard` with model attributes `dashboard`, `selectedPartyType`, `selectedCustodyStatus`, `tripId`, and `searchTerm`.

There is no controller-local validation/defaulting, exception catch, redirect or mutation branch. A non-convertible nonblank tripId cannot bind to the required Long parameter type; no story-specific graceful conversion-error UI is declared here.

## Exact visible controls and browser behavior
The frozen GET form targets `/party-custody-traceability` and exposes: `partyType` select with blank/All, CUSTOMER and SUPPLIER; `custodyStatus` select with blank/All, ACTIVE and CLOSED; number input `tripId`; text input `searchTerm` labelled `Serial / Party`; and `Apply` submit.

The selected party/status and entered trip/search values are repopulated from the controller model. No reset control is present. The frozen template has no story-specific script block, so no AJAX search, keyup/change auto-submit, debounce, minimum-length rule, dependent lookup, hidden party/cylinder ID propagation, or client-side invalidation behavior is source-proved. Filtering occurs on normal GET form submission.

## Service metrics and fixed limits
`OwnershipObligationDashboardService.fetchDashboard` always calculates: total ACTIVE obligations; CUSTOMER+ACTIVE count; SUPPLIER+ACTIVE count; aging-active count; and obligations closed today. Party summaries are limited to the first 50 rows via `PageRequest.of(0,50)` and ordered by activeCount descending. Detail rows are limited to the first 200 via `PageRequest.of(0,200)`.

Only `searchTerm` is normalized by the service, using `trim()`; null stays null and whitespace becomes an empty string. `partyType` and `custodyStatus` are passed unchanged.

## Exact detail filter/sort semantics
`OwnershipObligationDetailJpaDao.findDashboardRows` proves these predicates: blank/null partyType means all, otherwise exact partyType equality; blank/null custodyStatus means all, otherwise exact custodyStatus equality; null tripId means all, otherwise entryTripId OR exitTripId must equal tripId; blank/null searchTerm means all, otherwise case-insensitive contains against cylinderSerial OR partyName. Rows are ordered by custodyId descending.

Aging count means custodyStatus=`ACTIVE`, agingDueAt non-null, and current database timestamp greater than agingDueAt. Closed-today count reads `public.tbl_cylinder_party_custody` where custody_status=`CLOSED` and the exit date equals CURRENT_DATE.

## Read identity and party switching semantics
The immutable detail projection is an `@Subselect` over `public.tbl_cylinder_party_custody` joined to `public.tbl_cylinder`, `public.tbl_customer`, and `public.tbl_supplier`. Its identity is `pk_custody_id`. Cylinder identity/serial come from the custody/cylinder rows. Party name is `COALESCE(customer_name, supplier_name, 'Unknown')`; both customerId and supplierId are projected as stored. The dashboard does not perform a browser-side customer/supplier switch: partyType filtering is the submitted literal CUSTOMER/SUPPLIER value and display data comes from the persisted custody row/projection.

The party-summary immutable projection groups custody rows by partyType and the conditional party ID (`fk_customer` for CUSTOMER, otherwise `fk_supplier`) plus resolved party name. It calculates ACTIVE count and aging ACTIVE count and orders summaries by active count descending.

## Exact visible detail-row contract
The table renders Cylinder, Party, Status, Entry Trace, Exit Trace and Times. Cylinder shows serial plus `(#cylinderId)`. Party shows `partyType - partyName`. Status displays custodyStatus as a badge.

Entry trace is rendered only when at least one of entryEventType/entryTripId/entryLoadId/entryStopId is non-null and shows event type plus trip/load/stop IDs, using `-` for missing components. Exit trace uses the analogous exit fields. If the whole entry/exit trace is absent the visible value is `-`. Entered, exited and aging timestamps are formatted `dd-MM-yyyy HH:mm:ss`, with `-` for null values.

No row drill-down anchor, row click handler, action button, edit/close control, pagination control or per-row enable/disable rule exists in this frozen dashboard template. The service's 200-row cap is therefore not user-pageable from this screen.

## Persistence and error/empty boundary
This GET is read-only: it obtains aggregate/detail/party-summary data from immutable projections/base-table counts and does not persist custody changes. The template iterates `dashboard.obligationRows`; no story-specific explicit empty-table message or controller error-message branch is present in the frozen source. Missing trace/timestamp fields are explicitly rendered as dashes, but a completely empty result simply yields no detail rows under the table header.

## Governed conclusion
The recovered ZIP confirms the filter fields, party identity/switching, aging/status predicates, limits/sorting, row controls, interaction and empty/error boundaries. The user goal and read-only operational impact are source-bound to the business-behavior standard.

STORY-0063 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`. Approval remains `PENDING_USER_APPROVAL`; no code mutation or auto-approval occurred.

## Approval and fan-out disposition

- User decision: **APPROVED AND FAN OUT**
- Approval state: **APPROVED_AFTER_REWORK**
- Recorded: 2026-09-05
- Post-approval source/code conformance is mandatory before downstream executable work becomes eligible.
- Fan-out after conformance: BL-004, BL-005, BL-009 and BL-011.
- No test execution or coverage is inferred.
- Any detected drift remains subject to exact-manifest user approval before application-code mutation.
