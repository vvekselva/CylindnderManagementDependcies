# BL-009 / STORY-0128 — Lookup Management Screen Test Catalogue

- Source Story: `BL-002/stories/STORY-0128.md`
- Approval: `APPROVED_AFTER_REWORK`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Test data: `BL-009/test-data/STORY-0128.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0128/Story0128TestDataDrivenTest.java`
- Runtime state: generated/mapped; not executed because Maven/JUnit runtime is unavailable in the current ChatGPT execution environment.

## Test intent
Validate the approved read/render boundary of `GET /lookupManagement` without conflating it with the four separate save Stories.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0128-01 | Request page with default/omitted tab semantics | View is `final-version-1/LookupManagement`; active tab resolves to `addressType` through the controller mapping default. |
| TC-0128-02 | Request page with explicit `country` tab | `activeTab=country` is retained and the same Lookup Management view is rendered. |
| TC-0128-03 | Page render | Model contains `addressTypes`, `countries`, `states`, and `cities` supplied by `LookupDataCache`. |
| TC-0128-04 | GET execution | No ingestion service is invoked and no cache refresh/write method is invoked by `showLookupPage`. |

Drift in separate save handlers is tested under their own Story fan-out and does not redefine this GET contract.
