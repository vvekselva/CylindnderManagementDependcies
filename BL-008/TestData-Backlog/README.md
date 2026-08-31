# BL-008 V185 TestData Backlog

Status: ACTIVE TEST DATA BASELINE
Database baseline: V185 FROZEN

This folder is the canonical reusable test-data source for BL-008 service, integration and UI testing.

Files:
- `BL008_V185_Test_Data.csv` — canonical reusable parties/cylinders/negative datasets.
- `BL008_V185_Service_UI_Test_Cases.csv` — 30 acceptance cases BL008-SUI-001..030.
- `BL008_V185_Test_Data_Human_Readable.md` — readable explanation of the datasets.
- `BL008_V185_Test_Execution_Order.md` — six-stage execution order.

Rules:
1. Operational transactions always use the logical cylinder ID (`fk_cylinder`).
2. Company-owned cylinders use one identity only.
3. Supplier/customer-owned cylinders use a stable logical ID plus current/historical physical IDs.
4. Test data must not be silently changed during execution. If a case needs different data, add a new named dataset.
5. Every automated test must carry the matching `BL008-SUI-xxx` test-case ID in its display name or method documentation.
6. Database remains frozen at V185; service/UI failures are corrected in application code first unless a test proves a database-model defect.

Automation source is maintained in the `CylinderManagement` source repository under the BL-008 test-automation branch and mirrored by the delta package recorded in the BL-008 SSOT.
