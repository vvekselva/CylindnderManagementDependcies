# BL-009 / STORY-0109 — Save Product Category Test Catalogue

- Source Story: `BL-002/stories/STORY-0109.md`
- Approval: `APPROVED_AFTER_REWORK`
- Code conformance: PASS for approved current-state contract; separately documented remediation remains user-approval gated.
- Test data: `BL-009/test-data/STORY-0109.csv`
- Executable mapping: `BL-009/generated-tests/STORY-0109/Story0109TestDataDrivenTest.java`

## Test intent
Validate the approved current controller/save contract without implementing the separate duplicate/update remediation manifest.

| ID | Scenario | Expected current-source result |
|---|---|---|
| TC-0109-01 | Add ` industrial ` with description ` desc ` | Controller sends `INDUSTRIAL` / `desc`, refreshes Product Category cache, redirects to productCategory tab. |
| TC-0109-02 | Update with nonzero id | Identity is preserved and update-specific PRG path remains the same. |
| TC-0109-03 | Current duplicate service behavior | Contains/ignore-case duplicate finding rejects the request under current approved source behavior. |
| TC-0109-04 | Successful persistence | Current service maps and saves ProductCategoryDo; no schema change is part of this test work. |

The exact duplicate/update correction remains governed by `BL-002/evidence/STORY-0109-product-category-update-drift-review-20260902.yaml` and is not implemented here.
