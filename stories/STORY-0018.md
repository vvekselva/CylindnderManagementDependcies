# STORY-0018 — Display the challan-book add form with summary metrics

State: **READY_FOR_USER_REVIEW**  
Fingerprint: `bd08d06f1e9ed1b6589fe755869a8f70065acfb4ad6d5f5ba505cbc2e7d8221e`

A caller requests `GET /logistics/challan-books/add-form`. The request reaches `ChallanBookWebController.showAddBookForm`, which invokes `SummaryMetricLookupFetchService` for challan-book total, active and unused-page metrics. The accepted trace proves the ordered read path `SummaryMetricLookupFetchService -> SummaryMetricLookupJpaDao.findByLookUpKeyIn -> SummaryMetricLookupDo -> public.tbl_summary_metric_lookup -> SummaryMetricLookupMapper` before the terminal view `final-version-1/add-challan-book.html` is returned.

No caller-supplied request values, input normalization, explicit validation failure path, persistence write, state transition, audit mutation, file access or external API call is proved for this GET endpoint. No extra business rule is inferred.

Postcondition: the add-challan-book page is returned with source-proved summary metrics and no proved database mutation.

Evidence: canonical BL-001 row `GET /logistics/challan-books/add-form`; `logs/runs/PRODUCTION-FIRE-20260824-003111.md`.

Approval is pending explicit user decision for the exact fingerprint above.
