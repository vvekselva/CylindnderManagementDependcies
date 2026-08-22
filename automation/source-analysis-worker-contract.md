# Independent Source Analysis Worker Contract

## Purpose

The Source Analysis Worker is a separate, read-only component whose only responsibility is to understand source files and return proven source facts.

It is deliberately independent of the orchestration worker pool.

It does **not** consume one of `LANE-01` through `LANE-10`.

It does **not** decide which Workflow or Job should run next.

It does **not** change application source code.

It does **not** update shared orchestration files such as `TaskStatus.md`, `logs/automation-log.md`, `repository-catalogue.md` or the source-artifact synchronization register.

The orchestration layer decides what business/workflow work is required. The Source Analysis Worker only answers source-code questions with evidence.

## Separation of responsibilities

```text
ORCHESTRATION / CONTROL PLANE
Task -> Workflow -> Job -> Action -> 10 Worker Lanes
                    |
                    | asks for source facts
                    v
           SOURCE ANALYSIS WORKER
           independent read-only service
                    |
                    v
             Source Facts Package
                    |
                    v
         Orchestration consumes facts
```

### Orchestration owns

- workflow priorities;
- dependencies between Jobs;
- assigning Jobs to the ten worker lanes;
- deciding whether a Job is READY, BLOCKED, FAILED or COMPLETE;
- shared human-readable automation log;
- TaskStatus;
- quality gates;
- source-to-artifact synchronization decisions;
- user notification decisions.

### Source Analysis Worker owns

- reading source files at a specified immutable commit;
- indexing classes, methods and annotations;
- identifying exposed request mappings;
- identifying method calls and dependency references that can be proved from source;
- following source calls when specifically requested;
- identifying entity/table/query evidence when specifically requested;
- producing source evidence references;
- reporting when a requested source fact cannot be proved.

## Read-only rule

The Source Analysis Worker is read-only against `vvekselva/CylinderManagement`.

It must never:

- edit source files;
- create a source branch;
- commit to the source repository;
- run database writes;
- choose an alternative architecture;
- repair code automatically as part of source analysis.

If analysis discovers a problem, it reports the problem. A separate orchestration Job decides what to do about it.

## Analysis request contract

Every request to the Source Analysis Worker must contain:

- Analysis Request ID;
- caller Workflow ID;
- caller Job ID;
- target repository;
- exact source commit SHA;
- analysis scope;
- question(s) to answer;
- expected source facts;
- allowed depth;
- output path or response owner;
- whether unresolved findings are allowed.

Example:

```text
Analysis Request ID: SAR-0001
Workflow: WF-001-controller-traceability
Job: JOB-002
Repository: vvekselva/CylinderManagement
Source commit: <SHA>
Scope: cylindermanagement.web/src/main/java
Question: Which production Spring components expose HTTP requests?
Expected facts: class, source path, Spring exposure annotation, class-level mapping
Allowed depth: package/class discovery
```

## Worker lifecycle

The Source Analysis Worker has its own mandatory lifecycle:

```text
init()
   -> service()
   -> close()
```

This lifecycle is separate from the lifecycle of orchestration worker lanes.

### init()

`init()` must:

1. validate the Analysis Request ID;
2. validate the repository and exact source commit;
3. confirm that the source scope exists;
4. state in simple English what source question is about to be answered;
5. state which source area will be read;
6. state what result is expected;
7. open the Source Analysis run record.

If the baseline or scope is unavailable, `service()` must not start. `close()` still runs with `BLOCKED_BEFORE_SERVICE`.

### service()

`service()` performs only source analysis.

Depending on the request, this may include:

- enumerate files;
- inspect Spring annotations;
- inspect method declarations;
- inspect fields/constructor dependencies;
- inspect actual method calls;
- follow calls into another component;
- inspect repositories/DAO classes;
- inspect entities and `@Table` mappings;
- inspect `@Query`, native SQL, JdbcTemplate or query-builder code;
- identify external adapters, files, caches or other terminal dependencies.

The worker must distinguish a **candidate** from a **proved fact**.

Example:

```text
Candidate:
Class name ends with Controller.

Proved fact:
The class is component-scanned and has @Controller or an exposed request mapping.
```

A field injected into a class does not by itself prove that every endpoint in that class calls that dependency. Endpoint-specific trace requests must follow the actual handler method.

### close()

`close()` always runs after `init()`.

It records:

- question asked;
- source scope read;
- files examined;
- proven facts returned;
- facts that remain unresolved;
- last proven source location for unresolved facts;
- why the worker stopped;
- safe next source-analysis request, when useful;
- result: `COMPLETED`, `PARTIAL`, `BLOCKED` or `FAILED`;
- Source Analysis run state: `CLOSED`.

## Human-readable problem reporting

When source analysis cannot prove something, do not return only a technical symptom.

Bad:

```text
Symbol resolution failed.
```

Good:

```text
The controller calls TripQueryRepository, but the final SQL is created in another query-building class. I can prove the request reaches TripQueryRepository, but I cannot yet prove which table or view is used. A deeper source-analysis request should inspect that query-building class. I have not guessed the table name.
```

## Source Facts Package

The Source Analysis Worker returns a package containing only source-derived facts.

The package may contain:

- source baseline;
- analyzed scope;
- file index;
- exposed-component facts;
- endpoint/mapping facts;
- class/method call facts;
- entity/table facts;
- query/database-object facts;
- unresolved facts;
- evidence references.

The package does **not** contain workflow decisions such as which Job should run next.

## Result confidence

Every returned fact must use one of:

- `PROVED` - directly supported by source evidence;
- `UNRESOLVED` - the requested fact could not yet be proved;
- `NOT_APPLICABLE` - the requested type of fact does not apply.

Do not use `PROBABLY`, `LIKELY`, `ASSUMED` or similar guesses in an artifact used for traceability.

## Relationship to Controller Traceability

For `WF-001-controller-traceability`:

1. the coordinator freezes the CylinderManagement source baseline;
2. the Source Analysis Worker receives source-analysis requests against that baseline;
3. it discovers and proves exposed components/endpoints;
4. orchestration builds the Controller and Endpoint inventories from those source facts;
5. during ten-lane controller tracing, a lane requests deeper source facts from the Source Analysis Worker instead of independently guessing/parsing source structure;
6. the lane uses returned source facts to create the controller traceability artifact;
7. the coordinator verifies coverage and consolidates results.

The Source Analysis Worker is therefore reusable by later Workflows as well; it is not a controller-traceability-only worker.

## Concurrency

The Source Analysis Worker is outside the ten-lane worker count.

It may serve multiple read-only analysis requests when the source baseline is the same and the requests do not compete for mutable output files.

The initial implementation uses one logical Source Analysis Worker service with serialized writes to its own run records. Its source reads may be parallelized internally when safe.

## Shared-file restriction

The Source Analysis Worker must not directly write:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `repository-catalogue.md`;
- `sync/source-artifact-sync-register.yaml`;
- consolidated traceability files.

It may write only its dedicated source-analysis run/output paths or return results to the coordinator.
