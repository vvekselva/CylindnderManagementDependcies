# BL-008 V185 Test-Automation Self-Consistency Drift Review — RUN-008

This packet covers **test automation only**. It does not authorize application-code, database, or BL-010 mutation. Explicit user approval is required before changing the listed test/resource files.

Recovered test package: `BL008_V185_Test_Automation_Delta_20260831.zip` (`file_000000007e988211b8e86d09c97c1a3d`), SHA-256 `30708ed546b6cd3c7dc2ce7162b3b2a9f46bab130560677c892185d2cc6d3c61`.

## Current vs intended behavior

A static-equivalent evaluation of `BL008V185SourceContractTest` against its supplied frozen-contract resource produces 19 true assertions and 11 false assertions. Six failures correspond to genuine application/UI drift and are governed by separate application drift packets. Five failures are caused by exact-token assertions that do not match the supplied contract resource itself: SUI-011, SUI-012, SUI-017, SUI-019 and SUI-030.

Business impact: the Stage-1 source suite cannot become fully green solely by correcting application behavior; unrelated contract-text mismatches would remain red and could be misclassified as application defects.

## Exact proposed test-code/resource manifest

Repository/ref target: the governed BL-008 test-automation baseline represented by the recovered delta; when applying to `CylinderManagement`, use the exact branch/ref containing these files and stop if paths/content differ materially.

1. File: `cylindermanagement.custommapper.service/src/test/java/com/sreyas/datamatics/cylinder/management/bl008/BL008V185SourceContractTest.java`
   - Methods: `sui011_customerOwnerMayDifferFromHolder`, `sui012_custodyHistoryRetained`, `sui017_customerHolderReplacement`, `sui019_externalLostKeepsLogicalAsset`, `sui030_mixedOwnershipHarmony`.
   - Anchors: methods labelled BL008-SUI-011, -012, -017, -019 and -030.
   - Proposed change: replace brittle exact prose-token checks with assertions for stable governed semantic markers actually present in the frozen resource, while preserving each case’s business meaning. For SUI-030 specifically, replace the raw negative substring assertion on `fk_physical_cylinder` with a semantic check that no operational FK definition uses that name; do not fail merely because explanatory prose says such an FK does not exist.
   - Reason: prevent explanatory wording from making the source contract test self-contradictory.

2. File: `cylindermanagement.custommapper.service/src/test/resources/bl008/BL008_V185_Frozen_Database_Contract.md`
   - Scope: only if a stable semantic marker required by the approved 30-case catalogue is genuinely absent after test assertion cleanup.
   - Proposed change: add concise canonical markers for custody history, replacement party context and external loss behavior only where required to express the already-approved V185 contract; do not alter business semantics.
   - Reason: test resource and source assertions must describe the same frozen contract.

3. File: `cylindermanagement.custommapper.service/src/test/java/com/sreyas/datamatics/cylinder/management/bl008/BL008V185SupplierReplacementServiceTest.java`
   - Method: `currentRefillSupplierMayReplaceWithoutBecomingOwner` and helper `line(...)`.
   - Anchor: BL008-SUI-015 test.
   - Proposed change: construct a persisted-style `SupplierRefillCollectionLineDo` with `SupplierRefillCollectionDo.supplier` matching the refill supplier, so the test actually supplies the custody/refill context required by V185; retain permanent owner as a different supplier and verify it remains unchanged.
   - Reason: the current helper sets only collectionLineId, so it cannot validate the intended actual-refill-context rule after the application drift is corrected.

No other test class/resource is included. Expansion beyond these locations requires new approval.

## Tests and DB impact

After approved repair, run `BL008V185TestCatalogTest` and `BL008V185SourceContractTest` first, then the two behavior suites. Catalogue expectations remain 30 unique SUI cases and all required datasets. Database impact: **NONE**; V185 remains frozen.

State: `TEST_AUTOMATION_DRIFT_REVIEW_READY_FOR_USER_APPROVAL`.
Test/application code changed by RUN-008: **NO**.
