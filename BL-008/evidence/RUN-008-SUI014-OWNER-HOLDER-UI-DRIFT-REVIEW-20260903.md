# BL-008 SUI-014 Owner vs Current Holder UI Drift Review — RUN-008

Run: `CYLINDER-PRODUCTION-FIRE-20260903-143500-IST-RUN-008`
Source baseline: frozen local ZIP SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
Implementation gate: **EXPLICIT USER APPROVAL REQUIRED FOR THIS EXACT MANIFEST**

## Current vs approved behavior

BL008-SUI-014 requires the customer cylinder/custody UI to show **Owner Customer A** and **Current Holder Customer B** separately. The active `/party-custody-traceability` route renders `final-version-1/PartyCustodyTraceabilityDashboard` from `PartyCustodyTraceabilityController`. Its row DTO contains only the custody party (`partyName`, `customerId`/`supplierId`); the underlying immutable `OwnershipObligationDetailViewDo` subselect joins the current custody party but does not project `tbl_cylinder.owner_customer_id` or owner customer name. The template consequently renders one generic `Party` column and has no owner-vs-holder fields.

Approved V185 behavior keeps ownership and custody independent; a CUSTOMER_OWNED logical asset may be held by a different customer and the UI must not label the holder as the owner.

## Business impact

For cross-customer custody, users cannot distinguish the permanent owner from the current holder in the traceability screen. This obscures the exact relationship V185 introduced and can lead to incorrect operational interpretation of custody as ownership.

## Exact proposed code-change manifest

Repository/ref: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`.

1. File: `cylinder.management.dao/src/main/java/com/sreyas/datamatics/application/jpa/virtual/view/entity/OwnershipObligationDetailViewDo.java`
   - Component: immutable `@Subselect` projection and entity fields.
   - Anchor: subselect lines ~17-42 and fields around ~45-85.
   - Proposed change: project `cyl.owner_customer_id` plus owner-customer name through an additional LEFT JOIN to `tbl_customer` using the cylinder owner customer id; add immutable projection fields/getters for owner customer ID/name. Preserve the current custody-party columns unchanged.
   - Reason: supply both ownership and current-holder identities from the already-frozen V185 tables without schema mutation.

2. File: `Cylinder.management.dto/src/main/java/com/sreyas/datamatics/application/dashboard/dto/OwnershipObligationDashboardDto.java`
   - Nested component: `PartyObligationRowDto`.
   - Anchor: fields/getters around lines ~32-93.
   - Proposed change: add `ownerCustomerId` and `ownerCustomerName` fields/getters/setters; retain `partyName` as the actual custody holder/party.
   - Reason: carry owner and holder independently to the active UI.

3. File: `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/mapper/OwnershipObligationDashboardMapper.java`
   - Component: detail-row mapping method(s) from `OwnershipObligationDetailViewDo` to `PartyObligationRowDto`.
   - Proposed change: map the two new owner-customer fields while preserving current party/custody mapping.
   - Reason: complete the source-bound projection-to-UI path.

4. File: `cylindermanagement.web/src/main/resources/templates/final-version-1/PartyCustodyTraceabilityDashboard.html`
   - Component: result table under `dashboard.obligationRows`.
   - Anchor: current table columns `Cylinder`, `Party`, `Status`, `Entry Trace`, `Exit Trace`, `Times` around the main results block.
   - Proposed change: for customer custody rows show explicit `Owner Customer` and `Current Holder` values/labels; do not relabel the current `partyName` as owner. Supplier rows may retain supplier party semantics without inventing a customer owner.
   - Reason: satisfy SUI-014 and make V185 ownership/custody separation visible.

No database migration, controller route change, custody mutation, or new write endpoint is authorized. If implementation requires changing V185 schema/views rather than the Java immutable subselect projection, stop and request expanded approval.

## Tests

- Mapper unit test: customer-owned asset owner A / active custody holder B maps both independently.
- MVC/template test: `/party-custody-traceability` displays Owner Customer A and Current Holder Customer B separately.
- Regression: same-customer owner/holder remains understandable; supplier custody display continues to work; no ownership mutation occurs.

## Database impact

READ-ONLY QUERY PROJECTION ONLY. No Flyway migration or schema/data modification.

State: `DRIFT_REVIEW_READY_FOR_USER_APPROVAL`.
Application/test/database code changed by RUN-008: **NO**.
BL-010 rework created by RUN-008: **NO**.
