# BL-008 Domain Lookup Identity UI Drift Review — RUN-008

Run: `CYLINDER-PRODUCTION-FIRE-20260903-143500-IST-RUN-008`
Source: frozen local ZIP SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
Implementation gate: **EXPLICIT USER APPROVAL REQUIRED FOR THIS EXACT MANIFEST**

## Current vs approved behavior

The active Domain Lookup view is `final-version-1/DomainLookup` from `DomainLookupController.VIEW`. Its cylinder form supports COMPANY_OWNED, SUPPLIER_OWNED and CUSTOMER_OWNED plus owner selectors, but the identity labels are `Serial No. *` and `Actual Identifier *`. The physical/actual identifier input is always visible and `required`, including COMPANY_OWNED. The template contains no user-visible `Logical` or `Physical` identity wording.

The V185 acceptance contract requires COMPANY_OWNED to have one identity with no separate active-primary physical identifier, while supplier/customer-owned assets distinguish the stable logical cylinder identity from the exchangeable physical identifier. `BL008V185SourceContractTest.sui002_companyUiSingleIdentity` explicitly checks that Domain Lookup names both logical and physical concepts.

## Business impact

Users can be prompted to enter what appears to be a second identifier for company-owned cylinders even though V185 defines no logical/physical split for company assets. For external assets the generic labels do not make clear which value is the stable logical transaction identity and which is the replaceable physical identifier, increasing the risk of identity confusion during registration/editing.

## Exact proposed code-change manifest

Repository/ref: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`.

1. File: `cylindermanagement.web/src/main/resources/templates/final-version-1/DomainLookup.html`
   - Component: Cylinder form identity block.
   - Anchor: `cy-serial`, ownership selector and `cy-actual-identifier`, approximately lines 911-953.
   - Proposed change: make the stable identity label explicitly identify logical cylinder identity for external assets while retaining company cylinder serial semantics; rename the external field to `Physical Identifier`; wrap the physical-identifier form group with a stable DOM id so ownership-driven visibility can be controlled.
   - Reason: V185 requires explicit logical/physical distinction for supplier/customer assets and no second physical identity for company assets.

2. Same file/template.
   - Component: `handleAssetOwnershipChange()` / identity synchronization JavaScript.
   - Anchor: approximately lines 1656-1690.
   - Proposed change: for COMPANY_OWNED hide/disable the physical-identifier group and remove its `required` constraint; for SUPPLIER_OWNED/CUSTOMER_OWNED show and require the physical identifier. Keep owner Supplier/Customer conditional behavior intact. Do not introduce a second company identifier.
   - Reason: align visible/required inputs with ownership-specific V185 identity rules.

No controller, service, DAO, database, or alternate template change is authorized by this manifest. If runtime proves the active view differs from `final-version-1/DomainLookup`, stop and request expanded approval rather than editing another template.

## Tests

- `BL008V185SourceContractTest.sui002_companyUiSingleIdentity` must pass.
- Add/extend MVC/template validation for COMPANY_OWNED showing a single identity and external ownership showing logical + physical identity.
- Verify SUPPLIER_OWNED still requires Supplier owner and CUSTOMER_OWNED still requires Customer owner.
- Verify edit/re-display preserves ownership and correct identity fields.

## Database impact

NONE. V185 stays frozen; no Flyway migration or data rewrite is proposed.

State: `DRIFT_REVIEW_READY_FOR_USER_APPROVAL`.
Application code/template changed by this run: **NO**.
BL-010 rework created by this run: **NO**.
