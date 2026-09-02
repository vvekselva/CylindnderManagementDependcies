# BL-009 / STORY-0108 — Domain Lookup Page Test Catalogue

- Source Story: `BL-002/stories/STORY-0108.md`
- Approval: `APPROVED_AFTER_REWORK`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Test data: `BL-009/test-data/STORY-0108.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0108/Story0108TestDataDrivenTest.java`
- Runtime state: generated/mapped; not executed because Maven/JUnit runtime is unavailable in the current ChatGPT execution environment.

## Test intent
Validate the approved cache-backed read/render contract of `GET /domainLookup` independently of the six separate save Stories.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0108-01 | Default product-category tab invocation | View is `final-version-1/DomainLookup`; `activeTab=productCategory`. |
| TC-0108-02 | Explicit `vehicle` tab invocation | Same view; explicit tab is preserved. |
| TC-0108-03 | Page model | Contains product categories/UOMs, vehicles, drivers, products, cylinders and the Product/Cylinder option collections from `LookupDataCache`. |
| TC-0108-04 | GET execution | No targeted cache refresh/write method is invoked by `showDomainLookupPage`. |

Save/update drift for Product Category, Product UOM, Product, Cylinder, Vehicle and Driver remains separately approval-gated and does not redefine this GET catalogue.
