# Cylinder Orchestrator Startup and End-of-Orchestration Reconciliation

## Problem fixed

The earlier bootstrap design required the Primary Orchestrator to rewrite `backlog/runtime/invocation-registry.yaml`, write a durable START log, write an initial GitHub heartbeat, and read those writes back before any backlog analysis or execution could begin.

That rule correctly separated `SCHEDULER_FIRED` from `ORCHESTRATOR_STARTED`, but it created a new bottleneck: if the shared invocation registry could not be safely rewritten, the Production Fire stopped before doing useful BL-001, BL-002 or BL-008 work.

The shared registry is now removed from the critical START path.

## New lifecycle

The Primary Orchestrator follows this lifecycle:

```text
Scheduler / Manual fire
        |
        v
Pin authoritative branch
        |
        v
Read governance + Level 1/2/3 SSOT + prior durable evidence
        |
        v
Generate invocation ID in execution memory
        |
        v
Classify prior health / recoverable ownership
        |
        v
Build execution plan
        |
        v
Build END UPDATE SET
(list every shared file expected to change at the end)
        |
        v
Select eligible BL-001 / BL-002 / BL-008 work
        |
        v
Acquire only execution-critical locks
(BL-008 DB lock immediately before DB mutation)
        |
        v
ORCHESTRATOR_STARTED
        |
        v
PLAN -> EXECUTE -> VALIDATE -> REPLAN -> REFILL
        |
        v
END_OF_ORCHESTRATION_RECONCILIATION
        |
        v
Update shared canonical files + runtime + registry + durable log
        |
        v
Read back final files -> release locks -> terminalize
```

## What happens at the beginning

Startup is read/plan/classify work. The Orchestrator must know, before dispatch, which files are expected to be updated at the end.

The in-memory End Update Set contains, at minimum:

- backlog item and work unit;
- candidate output files;
- canonical SSOT files that may change;
- Level-3 runtime files that may change;
- status / statistics files that may change;
- durable log/evidence files that may change;
- locks or claims that must be released;
- expected validation/read-back checks.

The End Update Set is not itself required to be written to GitHub before execution. It is part of the invocation execution journal.

## What is not written at startup

The Orchestrator does **not** rewrite the following merely to prove that it started:

- `backlog/runtime/invocation-registry.yaml`;
- shared backlog status files;
- matrix/story shared progress files;
- execution statistics;
- durable run summary logs.

This prevents a large shared bookkeeping file from blocking productive work.

## Runtime heartbeat

The Primary Orchestrator still maintains a heartbeat at least every 60 seconds while it owns execution. The heartbeat is runtime-first. GitHub does not need a heartbeat commit every minute.

The final health/terminal projection is written during end reconciliation.

## Concurrency and claims

Current invocation concurrency is singleton: one Primary Orchestrator invocation at a time. Therefore normal work ownership is maintained inside the invocation execution plan and does not require a shared GitHub claim before every dispatch.

If overlapping invocations are re-enabled later, a proven atomic durable claim mechanism must be implemented before overlap is allowed.

BL-008 remains stricter: the global database-write lock has capacity 1 and must be acquired immediately before a database mutation. Exactly one Flyway requirement is active at a time.

## End-of-Orchestration Reconciliation

After productive work stops, the Primary Orchestrator performs one governed reconciliation phase:

1. Stop new dispatch.
2. Collect all worker/executor terminal results.
3. Validate evidence and item gates.
4. Reject invalid or incomplete partial output.
5. Build the final canonical update set.
6. Acquire the shared SSOT single-writer lock.
7. Apply validated canonical updates.
8. Update Level-3 runtime state.
9. Update backlog status only where derived truth changed.
10. Append/update the final invocation record in `backlog/runtime/invocation-registry.yaml`.
11. Update execution statistics.
12. Write the durable run log.
13. Release locks/claims.
14. Read back every updated shared file.
15. Verify transient lane logs are zero.
16. Terminalize.

If final reconciliation cannot be completed safely, the last valid shared state is preserved and the invocation returns `PARTIAL_CONTINUE_REQUIRED` with `ORCHESTRATOR_END_RECONCILIATION_FAILURE`.

## Production progress rule

A successful Production Fire is not one that merely checked status. If eligible work exists and there is free worker capacity, the Orchestrator must continue:

`REPLAN -> SELECT -> DISPATCH -> VALIDATE`

until the productive window closes or no eligible/recoverable work remains.

## BL-001

BL-001 must reconcile exactly 134 unique HTTP method/path keys with zero duplicates. Validated canonical projection artifacts are synchronized together in the end reconciliation transaction.

## BL-002

BL-002 consumes only accepted/materialized/non-stale BL-001 evidence. Release 1 remains before Release 2. Missing field contracts go through `UI_SOURCE_ANALYSIS`; unproved meaning remains `NEEDS_CLARIFICATION`. Stories and Use Cases are never auto-approved.

## BL-008

BL-008 uses Neon TEST `main` only, creates no Neon branch, uses Flyway only, performs exactly one database requirement at a time, and keeps database write parallelism at 1.

## Failure classes

- `ORCHESTRATOR_BOOTSTRAP_READ_FAILURE`: authoritative startup inputs cannot be read safely.
- `ORCHESTRATOR_BOOTSTRAP_PLAN_FAILURE`: an executable plan or End Update Set cannot be built.
- `ORCHESTRATOR_EXECUTION_LOCK_FAILURE`: a lock required for the specific operation cannot be acquired.
- `ORCHESTRATOR_END_RECONCILIATION_FAILURE`: validated work exists but shared durable reconciliation cannot be completed safely.
- `ORCHESTRATOR_TERMINAL_ACK_FAILURE`: final shared files were written but read-back verification failed.

The old `SCHEDULER_TO_ORCHESTRATOR_START_FAILURE` caused only by inability to rewrite the shared invocation registry before analysis is superseded by this lifecycle.
