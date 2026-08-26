# STORY-0051 — Search cities by name text

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `833c4f4664ef6d7e0b82e88cd602e766f8e6f419ed356cfbbe84545007bdd180`  
**Matrix flow:** `GET /search/city/{searchText}`

A caller supplies `searchText`. `RestfulCityServices.getCities` calls the typed search service. `CitySearchService` is the accepted active implementation; it invokes `SearchRequestValidator.validate` and then `CityJpaDao.findByCityNameContainingIgnoreCase`. `CityJpaDao` is a `JpaRepository<CityDo, Long>` and `CityDo` maps to `public.tbl_city`. The mapped results terminate as `CitySearchResponseDto` JSON.

No request normalization/defaulting or exact validator predicates are proved. Service exceptions return an empty response DTO according to the accepted evidence. No persistent write or state mutation is proved.

**Ordered chain:** `RestfulCityServices.getCities → CitySearchService.searchWithText → SearchRequestValidator.validate → CityJpaDao.findByCityNameContainingIgnoreCase → CityDo → public.tbl_city → mapper → CitySearchResponseDto JSON`.

**Evidence:** `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-233707.md`.

**Approval:** PENDING USER DECISION for the exact fingerprint above.
