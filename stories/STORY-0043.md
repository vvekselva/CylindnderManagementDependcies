# STORY-0043 — View ownership obligation dashboard

State: **READY_FOR_USER_REVIEW**  
Endpoint: `GET /ownership-obligation-dashboard`  
Fingerprint: `71574dca5f86ec55b27f094ed8fd3981ee555efdccf413f99302a1fbdb1b2e07`

When the ownership-obligation dashboard is opened, `OwnershipObligationDashboardController.showOwnershipObligationDashboard` invokes `OwnershipObligationDashboardService.fetchDashboard` to assemble the dashboard data.

The service follows three source-proved read branches. The detail branch uses `OwnershipObligationDetailJpaDao` and `OwnershipObligationDetailViewDo`, whose explicit subselect reads `public.tbl_cylinder_party_custody`, `public.tbl_cylinder`, `public.tbl_customer`, and `public.tbl_supplier`. The party-summary branch uses `OwnershipObligationPartySummaryJpaDao.findTopPartySummaries` and `OwnershipObligationPartySummaryViewDo`, whose explicit subselect reads the custody, customer, and supplier tables. The closed-today metric branch uses `OwnershipObligationDetailJpaDao.countClosedTodayObligations`, implemented as native SQL against `public.tbl_cylinder_party_custody`.

The proved detail and summary data are mapped through `OwnershipObligationDashboardMapper`, and the controller renders `final-version-1/OwnershipObligationDashboard`.

No caller-input validation, persistence write, state mutation, or caller-visible error branch is asserted because the accepted trace does not prove one for this GET flow. Those behaviours are therefore not invented.

## Proven postcondition

The dashboard is returned with ownership-obligation detail data, party summaries, and the closed-today metric derived from the proved custody/cylinder/customer/supplier dependencies.

## Evidence

- `traceability/controller-traceability.md`
- `logs/runs/PRODUCTION-FIRE-20260824-033550.md`

## Approval

User approval is required for this exact fingerprint before the Story may become downstream-authoritative or be grouped into a Use Case.
