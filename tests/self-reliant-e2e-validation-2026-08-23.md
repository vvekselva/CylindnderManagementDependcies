# Self-Reliant End-to-End Execution Validation — 23 August 2026

## Scope

This report records the validation performed before promoting the self-reliant Cylinder execution architecture. The private application source used for source-integrity tests was `vvekselva/CylinderManagement` at frozen BL-001 commit `3ae6e61442132d94a307275b08dd65fcef228d89`.

No result in this report automatically changes the accepted BL-001 endpoint checkpoint. Worker output remains evidence for Primary Orchestrator validation.

## Architecture under test

- GitHub role: Version Control System + durable persistence.
- Execution owner: Primary Automation Tool / Orchestrator.
- Default source provider: `ORCHESTRATOR_STAGED_SNAPSHOT`.
- Optional source provider: `LOCAL_GIT_CHECKOUT`.
- Worker backend: `LOCAL_PROCESS_POOL`, maximum 10 workers.
- Workers receive no GitHub credential.
- Source integrity: frozen baseline + manifest + Git blob SHA verification.
- Source closure: explicit recursive source/binding requests until zero remain.
- Recovery: execution journal + dispatch fingerprint + idempotent PENDING_SYNC handling.

## Test results

| Test | Expected | Result |
|---|---|---|
| Private controller source staged at frozen commit | Exact source available without a local checkout | PASS |
| Controller Git blob verification | Worker accepts unchanged source | PASS |
| Deliberate staged-controller tamper | BLOCK_BEFORE_SERVICE | PASS |
| Manifest baseline mismatch | Executor rejects before worker fire | PASS |
| Duplicate lane in dispatch | Executor rejects batch | PASS |
| Stale transient lane log | Executor rejects batch until recovery/cleanup | PASS |
| JPA canary recursive source closure | Zero missing source/binding requests | PASS |
| Correct Spring interface binding | Implementation source/signature/qualifier accepted | PASS |
| Deliberately wrong interface binding | Source binding rejected | PASS |
| Transient lane logs after aggregate | Zero remain | PASS |
| Worker output auto-accept disabled | No automatic canonical trace completion | PASS |
| Recovery/idempotency state decisions | 5/5 expected decisions | PASS |
| Local worker backend capacity | 10/10 overlapping SERVICE workers in capacity probe | PASS |

## Real-source canary

Execution: `E2E-STAGED-20260823-151800`

A staged snapshot was completed for `ChallanPagePhotoController` and its source-proved persistence chain. Manifest-verified source included:

- `ChallanPagePhotoController`
- `ChallanPagePhotoJpaDao`
- `ChallanPagePhotoDo`
- `ChallanPageAuditLedgerDo`
- `ChallanBookRegistryDo`

Observed result:

- phase: `CLOSED_READY_FOR_VALIDATION`
- workers started/results: `1/1`
- worker failures: `0`
- `QG-SOURCE-001`: `SOURCE_CLOSURE_COMPLETE`
- missing source requests: `0`
- missing binding requests: `0`
- peak SERVICE concurrency: `1/1`
- residual transient lane logs: `0`
- trace evidence auto-accepted: `false`

The source-proved physical dependency candidates included `public.tbl_challan_page_photo`, `public.tbl_challan_page_audit_ledger` and `public.tbl_challan_book_registry`.

## Ten-worker real-source discovery batch

Latest execution: `E2E-STAGED-20260823-151810`

Observed result:

- phase: `CLOSED_RESTAGE_REQUIRED`
- workers started: `10`
- worker results: `10`
- worker failures: `0`
- controller roots integrity verified: PASS
- source closure complete: `false`
- explicit missing source requests: `21`
- missing binding requests in this discovery iteration: `0` because several interface source files themselves still require staging before binding resolution is evaluated
- peak natural SERVICE concurrency: `4/10`
- average natural SERVICE concurrency: `0.26`
- `QG-LANE-001`: `UNDERUTILIZED`
- residual transient lane logs: `0`
- canonical trace progress automatically accepted: `0`

Interpretation: this is correct fail-closed behavior. The engine did not require a local source checkout and did not guess the missing source. It produced exact restaging work for the Orchestrator. The natural workload was too short to demonstrate full ten-way SERVICE overlap; this is a performance-governance observation, not a source-integrity failure. A separate process-pool capacity test proved the backend can reach `10/10` overlapping SERVICE workers.

## Source-resolution examples proven against the frozen commit

- `com.sreyas.datamatics.application.service.ICylinderManagementApplicationService` -> `framework/src/main/java/com/sreyas/datamatics/application/service/ICylinderManagementApplicationService.java`
- `com.sreyas.datamatics.application.service.ICylinderManagementApplicationMediator` -> `framework/src/main/java/com/sreyas/datamatics/application/service/ICylinderManagementApplicationMediator.java`
- `com.sreyas.datamatics.cylinder.management.services.TripReturnWorkflowService` -> `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/services/TripReturnWorkflowService.java`
- `com.sreyas.datamatics.cylindermanagement.offlinemap.service.CustomerAddressLocationOfflineMapService` -> `cylindermanagement.offlinemap/src/main/java/com/sreyas/datamatics/cylindermanagement/offlinemap/service/CustomerAddressLocationOfflineMapService.java`
- `com.sreyas.datamatics.application.jpa.entity.ChallanPagePhotoDo` -> `cylinder.management.dao/src/main/java/com/sreyas/datamatics/application/jpa/entity/ChallanPagePhotoDo.java`

## Binding validation

The positive binding test used source-verified Spring/interface bindings from `AddStopController`. A binding was accepted only after the implementation source at the frozen commit proved the declared interface/generic signature and qualifier/default bean identity.

A deliberately incorrect binding of `challanHeatmapFetchService` to `SummaryMetricLookupFetchService` was rejected with `IMPLEMENTATION_SIGNATURE_MISMATCH`.

## Recovery and idempotency validation

Five state-machine cases passed:

1. same dispatch + `PENDING_SYNC` -> `RETRY_SYNC_ONLY`, no worker restart;
2. interrupted `RUNNING` execution with no live workers -> `RECOVER_INTERRUPTED_EXECUTION`, reject partial output;
3. closed evidence awaiting validation -> `VALIDATE_EXISTING_EVIDENCE`, no worker restart;
4. changed dispatch fingerprint -> `START_NEW_EXECUTION`;
5. already synchronized closed execution -> `NOOP_ALREADY_COMMITTED`.

## Promotion decision

**PASS FOR ARCHITECTURE PROMOTION.**

The tested architecture removes GitHub Actions and mandatory local source checkout as production execution dependencies. Remaining BL-001 source requests are normal recursive staging work, not an infrastructure blocker.

Promotion does not waive any BL-001 traceability gate. `QG-SOURCE-001`, `QG-LOG-001`, `QG-LANE-001`, the BL-001 trace gates and explicit user acceptance remain fail-closed according to their defined responsibilities.
