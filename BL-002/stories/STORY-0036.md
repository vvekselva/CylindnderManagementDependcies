# STORY-0036 — Yard Audit

- Release: R1
- Endpoint: `GET /yard-audit-dashboard`
- Functional area: Yard Audit
- Approval: PENDING_USER_APPROVAL
- Review state: NEEDS_CLARIFICATION
- Traceability state: COMPLETE
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Human-readable story

As an authorized Cylinder Management user, I want to open the Yard Audit Dashboard and optionally filter it by audit date or audit ID so that I can review daily yard audits, the selected audit, yard-gate status, scanned-cylinder details, third-party cylinder alerts, and the audit event timeline.

## Source-proved controller and request contract

Frozen source proves `YardAuditDashboardController` as the controller for `GET /yard-audit-dashboard`.

- Controller: `YardAuditDashboardController`
- Method: `doGet(Long stockCheckId, String gateDate)`
- Optional request parameters: `stockCheckId`, `gateDate`
- `stockCheckId` is copied to `YardAuditDashboardFetchRequestDto.stockCheckId`.
- Nonblank `gateDate` is parsed as `LocalDate` and copied to `YardAuditDashboardFetchRequestDto.gateDate`.
- View: `final-version-1/YardAuditDashboard`
- Model attributes established by the controller: `backLink`, `selectedStockCheckId`, `selectedGateDate`, `dashboard`.
- If `CylinderManagementApplicationException` is raised by the application service, the controller renders the same view with `dashboardLoadError`.

Frozen-source controller evidence:
`cylindermanagement.web/src/main/java/com/sreyas/datamatics/cylindermanagement/misc/web/controller/YardAuditDashboardController.java`

## Source-proved service behavior

The injected application-service specialization resolves to `YardAuditDashboardFetchService`, whose `processRequest(...)` method builds `YardAuditDashboardDto` and delegates the read side to `YardQualityGateJpaDao`.

The service proves the following behavior:

- resolves the selected/latest audit using `fetchLatestAuditSummary(stockCheckId)`;
- derives the reporting date from `gateDate`, or from the selected audit when no date was supplied;
- retrieves the day's audit list with `fetchAuditSummariesByDate(reportingDate)`;
- retrieves the daily count with `countAuditsByCheckDate(reportingDate)`;
- falls back to the first daily audit when no explicit selected audit was resolved;
- retrieves selected-audit gate records through `findByYardStockCheckIdOrderByOpenedAtDesc(selectedStockCheckId)`;
- retrieves line-level audit details with `fetchAuditLines(selectedStockCheckId)`;
- retrieves audit timeline events with `fetchAuditEvents(selectedStockCheckId)`;
- retrieves recent third-party-cylinder alerts with `fetchThirdPartyAlerts()`;
- returns `YardAuditDashboardFetchResponseDto` with SUCCESS response code and the populated dashboard DTO.

Frozen-source service evidence:
`cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/services/YardAuditDashboardFetchService.java`

## Source-proved DAO and database read identities

DAO: `YardQualityGateJpaDao`.

The applicable flow is read/reporting only; no database write is required by this GET dashboard story.

Proved database objects and relevant read identities include:

- `public.tbl_yard_stock_check`
  - `pk_stock_check_id`, `check_date`, `checked_by`, `check_status`, `check_context`, `audit_context`, `created_at`, `completed_at`;
- `public.tbl_yard_stock_check_line`
  - `pk_stock_check_line_id`, `fk_stock_check`, `fk_cylinder`, `observed_cylinder`, `fk_observed_cylinder_state`, `system_state_name`, `fk_system_cylinder_state`, `state_matches_system`, `scanned_at`, `auditor_notes`;
- `public.tbl_yard_quality_gate`
  - latest/selected gate state including `gate_status`, `status_reason` and the entity-backed selected-audit gate rows;
- `public.tbl_cylinder_states`
  - `pk_cylinder_state_id`, `cylinder_state` for observed-state naming;
- `public.tbl_yard_check_event`
  - `pk_event_id`, `fk_stock_check`, `event_type`, `event_at`, `performed_by`, `fk_cylinder`, `fk_variance`, `event_remarks`, `cumulative_scanned`.

The native queries prove latest-audit selection, date-scoped audit summaries and count, line details, event ordering, and third-party-cylinder alert retrieval. `YardQualityGateDo` supplies the entity-backed yard-quality-gate records.

Frozen-source DAO evidence:
`cylinder.management.dao/src/main/java/com/sreyas/datamatics/application/jpa/dao/YardQualityGateJpaDao.java`

## Source-proved UI behavior

Template: `cylindermanagement.web/src/main/resources/templates/final-version-1/YardAuditDashboard.html`.

Visible/interactive behavior is proved for:

- Audit Date filter (`gateDate`);
- Audit ID filter (`stockCheckId`);
- Apply Filter and Reset actions;
- New Yard Audit navigation to `/ingestYardStockCheck`;
- controller error display through `dashboardLoadError`;
- empty-dashboard outcome: `No yard audits found.`;
- daily audit-list empty outcome: `No audits for selected date.`;
- selected audit metrics: total audits/day, audit ID, status, checked-by, known cylinders, third-party count;
- audit list with per-row View links back to `/yard-audit-dashboard` using `stockCheckId` and `gateDate`;
- selected-audit gate status and empty-gate outcome;
- third-party-cylinder alerts and empty-alert outcome;
- audit line details including observed/system states and match/mismatch/N/A display;
- selected-audit event timeline.

## Strict completion decision

`STRICT_FIELD_UI_COMPLETE`.

The complete applicable read-side implementation chain is now source-proved from the frozen baseline:

`GET /yard-audit-dashboard`
→ `YardAuditDashboardController.doGet(...)`
→ `YardAuditDashboardFetchService.processRequest(...)`
→ `YardQualityGateJpaDao`
→ `tbl_yard_stock_check` / `tbl_yard_stock_check_line` / `tbl_yard_quality_gate` / `tbl_cylinder_states` / `tbl_yard_check_event`
→ `YardAuditDashboardDto`
→ controller model
→ `final-version-1/YardAuditDashboard`.

No write-side persistence chain is applicable to this GET reporting endpoint. No missing write behavior is inferred.

The canonical BL-001 matrix already identifies `YardAuditDashboardController`, `YardAuditDashboardFetchService`, `YardQualityGateJpaDao`, and the same database object set for this endpoint. BL-001 remains complete/read-only; no BL-001 source-integrity regression requiring reopening was found.

Approval remains `PENDING_USER_APPROVAL`. The register-level `NEEDS_CLARIFICATION` value is not auto-cleared by strict source completion and remains unchanged until separately reconciled under the review-state policy.
