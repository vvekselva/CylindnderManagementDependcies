# BL-008 V185 Test Execution Order

1. Stage 1 Registration: BL008-SUI-001..005
2. Stage 2 Search/Key Preservation: BL008-SUI-006..010
3. Stage 3 Custody/Location: BL008-SUI-011..014
4. Stage 4 Replacement/Loss/Recovery: BL008-SUI-015..021
5. Stage 5 Customer Closure: BL008-SUI-022..025
6. Stage 6 Regression/E2E: BL008-SUI-026..030

Run service/integration tests before UI tests. Fix application defects in code first. Reopen the frozen V185 database only if a test proves a genuine database defect.
