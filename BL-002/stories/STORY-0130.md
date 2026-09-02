# STORY-0130 — Save Country

- Release: R1
- Endpoint: `POST /lookupManagement/country/save`
- Controller: `LookupManagementController.saveCountry`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0130-country-update-drift-review-20260902.yaml`

## Business behavior

The Country tab lets an operator add or edit a Country reference row. The form submits optional `countryId` plus required `countryName` and `description` to `POST /lookupManagement/country/save`. The controller trims the country name, trims/uppercases description, places the values into `CountryDto`, wraps it in `CountryIngestionRequestDto`, and delegates to `CountryIngestionService`. Null/zero ID is create; nonzero ID is update.

On successful service completion the controller refreshes only the Country cache and redirects to `/lookupManagement?tab=country`, showing add/update-specific success text. A controlled input-validation exception carrying the expected Country request returns the full Lookup Management view directly with `failedCountryDto`, `formOpen=true`, active Country tab and the lookup collections restored so inline validation survives. Other failures redirect with an error flash.

## Exact service and persistence behavior

`CountryIngestionService.processRequest(...)` validates a non-null request/nested Country DTO and nonblank country name. It then rejects whenever `CountryJpaDao.findByCountryNameContainingIgnoreCase(countryName)` returns any row, attaching `COUNTRY_ALREADY_EXISTS` validation evidence.

When validation passes, `CountryMapper` maps the request to `CountryDo` and `CountryJpaDao.saveAndFlush(...)` persists it. `CountryDo` maps `public.tbl_country`, primary key `pk_country_id`, sequence `public.pk_country_id_serial`, unique non-null `country_name`, and non-null `description`. The saved entity is mapped back into the success response.

## Source-proved update/uniqueness drift

The current duplicate predicate is a contains/ignore-case search and does not exclude the submitted `countryId` on update. Therefore a legitimate edit can be rejected as a duplicate of itself and substring names can be falsely rejected. The database already enforces exact uniqueness on `country_name`; no schema change is required for the proposed application correction.

The exact service/repository/test remediation is isolated in `BL-002/evidence/STORY-0130-country-update-drift-review-20260902.yaml`. No implementation is authorized until explicit user approval of that exact manifest.

## Completion and approval gate

The recovered ZIP binds the complete form/controller contract, cache behavior, validation, repository/entity/table path, visible outcomes and current update defect. STORY-0130 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains `PENDING_USER_APPROVAL`. No application code was changed and no BL-010 work was created or executed.
