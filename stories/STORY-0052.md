# STORY-0052 — Search countries by name text

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `385002c2e8dc6643c621c462fd76e26025c5ec3ca33c09a1ef6299573e0b97db`  
**Matrix flow:** `GET /search/country/{searchText}`

A caller supplies `searchText`. `RestfulCountryServices.getCountries` calls the typed search service. `CountrySearchService` is the accepted active implementation; it invokes `SearchRequestValidator.validate` and then `CountryJpaDao.findByCountryNameContainingIgnoreCase`. `CountryJpaDao` is a `JpaRepository<CountryDo, Long>` and `CountryDo` maps to `public.tbl_country`. The mapped results terminate as `CountrySearchResponsesDto` JSON.

No request normalization/defaulting or exact validator predicates are proved. Service exceptions return an empty response DTO according to the accepted evidence. No persistent write or state mutation is proved.

**Ordered chain:** `RestfulCountryServices.getCountries → CountrySearchService.searchWithText → SearchRequestValidator.validate → CountryJpaDao.findByCountryNameContainingIgnoreCase → CountryDo → public.tbl_country → mapper → CountrySearchResponsesDto JSON`.

**Evidence:** `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-233707.md`.

**Approval:** PENDING USER DECISION for the exact fingerprint above.
