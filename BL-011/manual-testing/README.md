# Manual Database and User-Story Testing

Current source baseline: `Harinandhan-Cylinder-Backup(20260905-071920).zip`  
Governed SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

## Purpose

This folder is the durable manual-testing control surface for the current Cylinder workspace. It does not replace BL-008 or BL-009; it gives the tester one place to execute and record database and approved-user-story tests manually.

## Files

- `database-manual-test-register.csv` — the 30 BL-008 V185 database/service/UI acceptance cases, with manual result/evidence columns.
- `database-manual-test-data.csv` — the named V185 reusable database datasets, with setup/cleanup tracking.
- `user-story-manual-test-register.csv` — every currently approved BL-002 Story and its current BL-009 test-case/test-data linkage.
- `manual-execution-results.csv` — append-only result ledger for manual execution evidence.

## Execution rule

1. Keep the previously accepted V185 database baseline intact unless a source/database-impact delta is proven.
2. For database testing, use the named BL-008 datasets and execute the 30 acceptance cases in their governed phase order.
3. For user Stories, execute only Stories with `APPROVED_AFTER_REWORK`. The BL-002 Story is the behavioral authority.
4. Where BL-009 detailed cases/data already exist, execute them directly.
5. Where the register says `PENDING_DETAILED_BL009_CATALOGUE` or `PENDING_STORY_TEST_DATA`, the Story is approved but its detailed BL-009 artefact is still incomplete. Do not call that Story's manual test design complete until those artefacts are generated.
6. Record PASS only from observed behavior. Capture screen/API evidence and before/after database evidence whenever persistence is involved.
7. A database failure does not automatically reopen V185. First classify whether the failure is application/service/UI code, test-data/setup, or a genuine database-model defect.

## Current inventory

- Approved BL-002 Stories in this register: **84**
- Approved Stories already having a BL-009 detailed Story catalogue: **35**
- Approved Stories still needing detailed BL-009 catalogue/test-data completion: **49**
- BL-008 manual database acceptance cases: **30**
- BL-008 named reusable data rows: **19**

The immediate preparation gap is therefore the detailed BL-009 case/data generation for the approved Stories that are still marked pending in `user-story-manual-test-register.csv`.
