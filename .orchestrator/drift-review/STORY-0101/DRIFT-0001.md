# STORY-0101 — Drift Review Revalidation

- Story: `STORY-0101 — State Search`
- Prepared by run: `CYLINDER-PRODUCTION-FIRE-II-20260903-032808-IST-RUN-001`
- Status: `AWAITING_EXPLICIT_USER_APPROVAL`
- Authoritative exact code-change manifest: `BL-002/evidence/STORY-0101-state-search-service-code-drift-review-20260902-2205.yaml`
- Governed repository/ref: `vvekselva/CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Governed source SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Application-code mutation performed: **NO**
- BL-010 rework created/executed: **NO**

## Local revalidation

Fresh extracted local source still shows both anchors documented by the authoritative packet:

1. `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/search/services/StateSearchService.java`, `StateSearchService.searchWithText(...)`, around lines 47–49, still passes `PRODUCT_UOM_SEARCH_SERVICE` to `SearchRequestValidator` during State lookup.
2. `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/search/validator/SearchRequestValidator.java`, `isStateRequiredService(...)`, around lines 81–87, still uses broad `serviceCode.name().contains("STATE")` inference.

The approved STORY-0101 behavior remains an independent read-only State reference lookup and must not require `queryData[state]`.

## Governing implementation scope

This revalidation does not introduce or replace the exact manifest. The authoritative manifest remains the three-location proposal already recorded in `BL-002/evidence/STORY-0101-state-search-service-code-drift-review-20260902-2205.yaml`:

- add explicit `STATE_SEARCH_SERVICE` in `CylinderManagementServiceCode.java`;
- use that explicit code from `StateSearchService.searchWithText(...)`;
- replace the validator's broad name-based STATE inference with an explicit allow-list for cylinder searches that truly require the state filter.

The authoritative packet also governs unit/integration/regression test impact and records database impact as `NONE`.

No implementation may start until the user explicitly approves that exact manifest. Any expansion beyond those three production-code locations requires a new approval.
