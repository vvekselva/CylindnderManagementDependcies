# STORY-0050 — Search challan types by text

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `b29a1e8069a5907600247fefd64bb9bf2ee2b4c13ae02d33f38e1cec9b6fc3c2`  
**Matrix flow:** `GET /search/challantype/{searchText}`

A caller supplies `searchText`. `RestfulChallanTypeServices.getChallanTypes` calls the typed search service, whose accepted implementation is `ChallanTypeSearchService`. The service invokes `SearchRequestValidator.validate`, then `ChallanTypeJpaDao.findByChallanTypeContainingIgnoreCase`. The DAO resolves `ChallanTypeDo`, which maps to `public.tbl_challan_type`, and matched rows are mapped into terminal `ChallanTypeSearchResponseDto` JSON.

No request normalization/defaulting or exact validation predicates are proved. Service exceptions are proved to return an empty response DTO; no additional error semantics are invented. The endpoint reads `public.tbl_challan_type` and performs no proved persistence write or state mutation.

**Ordered chain:** `RestfulChallanTypeServices.getChallanTypes → ChallanTypeSearchService.searchWithText → SearchRequestValidator.validate → ChallanTypeJpaDao.findByChallanTypeContainingIgnoreCase → ChallanTypeDo → public.tbl_challan_type → mapper → ChallanTypeSearchResponseDto JSON`.

**Evidence:** `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-233707.md`.

**Approval:** PENDING USER DECISION for the exact fingerprint above.
