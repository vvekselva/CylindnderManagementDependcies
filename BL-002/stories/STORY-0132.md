# STORY-0132 — Save City

- Release: R1
- Endpoint: `POST /lookupManagement/city/save`
- Controller: `LookupManagementController.saveCity`
- Approval: APPROVED_AFTER_REWORK
- Approval evidence: `BL-002/approval-evidence/STORY-0132-approval-20260902.md`
- Review state: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Fan-out: REQUESTED_TO_BL004_BL005_BL009
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0132-city-save-drift-review-20260902.yaml`

## Business behavior

The City tab lets an operator add or edit a City reference. `POST /lookupManagement/city/save` accepts optional `cityId` and required `cityName` and `description`. The controller preserves the ID, trims the city name, copies description into `CityDto`, wraps it in `CityIngestionRequestDto`, and delegates to `CityIngestionService`. Null/zero ID is create; nonzero ID is update.

On success the controller refreshes the City cache and redirects to `/lookupManagement?tab=city` with create/update-specific success text. A user-input validation exception carrying the expected City request is rendered directly through the Lookup Management view with the City tab/form open, the failed City DTO retained and lookup collections restored. Other failures redirect with an error flash.

## Exact service and persistence behavior

`CityIngestionService.processRequest(...)` validates request/City DTO/city name, but the null/blank branch currently emits validation evidence using a **CountryIngestionRequestDto** instead of `CityIngestionRequestDto`, followed by another generic validation-failure call. This conflicts with the controller's expected City-specific inline validation branch.

The service then rejects any request for which `CityJpaDao.findByCityNameContainingIgnoreCase(cityName)` returns a row. When validation passes, `CityMapper` maps to `CityDo` and `CityJpaDao.saveAndFlush(...)` persists it. `CityDo` maps `public.tbl_city`, primary key `pk_city_id`, sequence `public.pk_city_id_serial`, unique non-null `city`, and non-null `description`. The saved City is mapped into a SUCCESS response.

## Source-proved drift

Two current defects are source-bound:

1. Invalid City input emits the wrong request DTO type, which can prevent the controller's intended inline City validation path.
2. Duplicate validation uses contains/ignore-case and does not exclude the submitted `cityId` on update, so same-row and substring false-positive duplicates can occur.

The database already enforces exact uniqueness on the City column; no schema change is required. The exact service/repository/test correction is isolated in `BL-002/evidence/STORY-0132-city-save-drift-review-20260902.yaml`. Story approval does not by itself authorize implementation of that separate exact drift manifest.

## Approval and fan-out gate

**APPROVED_AFTER_REWORK.** The user explicitly approved this Story on 2026-09-02 and explicitly requested fan-out. BL-004, BL-005 and BL-009 fan-out is requested under the governed post-approval conformance/testing policy. The documented current-state defects remain part of the approved contract until separately authorized remediation is implemented and tested.
