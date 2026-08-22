# Controller Traceability Design

## Purpose

`WF-001-controller-traceability` proves, for every exposed HTTP endpoint in `vvekselva/CylinderManagement`:

> Which component receives the request, which application calls follow, and what final database, external service, file, cache, module or other dependency is reached?

No trace may be completed by guessing.

## First baseline rule

The **first** Controller Traceability baseline uses a strict two-stage source-analysis sequence:

```text
COMPLETE SOURCE REPOSITORY CHECK
             |
             | must finish COMPLETED + CLOSED
             v
   COMPLETE TRACEABILITY MATRIX
```

The Traceability Matrix must not be assembled from partial source-check batches during the initial baseline.

The first baseline therefore uses one complete Worker Input:

```text
worker/inputs/WI-0004.yaml
```

The accepted Worker result becomes:

```text
traceability/source-repository-check.md
```

Only after that artifact is accepted and `JOB-002` is VERIFIED may `JOB-003 Complete Traceability Matrix` start.

## Generic Worker principle

Controller Traceability does not use a special-purpose source-analysis worker.

The independent component is a reusable **Generic Worker** defined by:

```text
automation/worker-component-contract.md
```

The actual task is always supplied through:

```text
worker/inputs/WI-####.yaml
```

Therefore:

```text
WORKER = reusable execution engine
INPUT FILE = actual task
RUN FILE = what the Worker did
RESULT FILE = evidence/result returned by the Worker
```

## First baseline data flow

```text
JOB-001 Freeze Source Baseline
          |
          v
worker/inputs/WI-0004.yaml
          |
          v
       WORKER
 init -> service -> close
          |
          +--> worker/runs/WI-0004.md
          +--> worker/results/WI-0004.md
          |
          v
traceability/source-repository-check.md
          |
          | JOB-002 must be VERIFIED
          v
JOB-003 Complete Traceability Matrix
          |
          +--> traceability/controller-inventory.md
          +--> traceability/endpoint-inventory.md
          +--> traceability/controller-traceability.md
          +--> traceability/unresolved-traceability.md
          |
          v
JOB-004 Register Initial Source Artifact Baseline
          |
          v
JOB-005 Close Initial Traceability Run
```

## Source baseline

The current frozen source baseline is:

```text
3ae6e61442132d94a307275b08dd65fcef228d89
```

The complete repository check and every initial Traceability Matrix row must describe this exact commit.

If the source changes while the initial baseline is being created, the baseline run remains on this commit. Later changes are handled by `WF-002-source-artifact-sync`.

## What WI-0004 must inspect

The complete repository check must inspect the complete frozen repository tree for the source areas needed to establish Controller Traceability, including:

- production modules and relevant configuration;
- Spring Boot bootstrap/component-scan configuration;
- every candidate production MVC/REST web component;
- every actual exposed HTTP mapping;
- every exposed handler method;
- actual downstream calls reachable from those handlers;
- mediators, handlers, services, repositories, DAOs and adapters reached by those calls;
- entity mappings and query evidence for database-backed paths;
- physical tables, views or functions when they can be proved;
- external services, file-system, cache and module terminal dependencies when present;
- unresolved final dependencies with the exact last proven source point.

The repository check is read-only.

## Complete repository-check output

`WI-0004` may close as `COMPLETED` only when its result contains:

1. repository/source scope inventory;
2. complete exposed-component inventory;
3. complete exposed-endpoint inventory;
4. one trace result for every exposed endpoint;
5. evidence for every proved source hop;
6. final dependency evidence for every COMPLETE trace;
7. an explicit unresolved record for every trace whose final dependency cannot be proved;
8. the frozen source commit;
9. a CLOSED Worker run.

An unresolved endpoint does **not** make repository coverage incomplete when the Worker has fully inspected the available source path and clearly records the last proven point. It remains `UNRESOLVED` rather than guessed.

A result is not acceptable for the first baseline when it is merely `PARTIAL` because some candidate files or endpoints were not inspected.

## Earlier partial inputs

The earlier files:

```text
WI-0001
WI-0002
WI-0003
```

are not allowed to unlock the initial Traceability Matrix.

- `WI-0001` and `WI-0002` are retained as historical evidence.
- `WI-0003` is superseded by `WI-0004`.
- `WI-0004` must revalidate the complete source scope needed for the initial baseline.

## Traceability Matrix Job

`JOB-003 Complete Traceability Matrix` starts only when:

```text
JOB-002 = VERIFIED
WI-0004 result = COMPLETED
WI-0004 run = CLOSED
traceability/source-repository-check.md = ACCEPTED
```

The matrix Job does not perform another source-inspection Worker task during the initial baseline. It transforms the accepted complete source-repository-check output into controlled traceability artifacts.

## Controller identity

Every exposed component receives a stable Controller ID:

```text
CTL-001
CTL-002
CTL-003
...
```

The Controller inventory records at least:

- Controller ID;
- class name;
- source module/file;
- exposure type (`MVC`, `REST`, or `MIXED`);
- class-level mapping when present;
- endpoint count;
- frozen source baseline;
- Worker evidence reference.

## Endpoint identity

Every exposed caller-visible HTTP method/path combination receives a stable Endpoint ID under its Controller ID:

```text
CTL-007
  EP-007-01
  EP-007-02
  EP-007-03
```

The Endpoint inventory records at least:

- Endpoint ID;
- Controller ID;
- HTTP method;
- full URL path;
- handler method;
- request/input type where provable;
- response/output type where provable;
- Worker evidence reference.

## Traceability Matrix

The initial matrix is written to:

```text
traceability/controller-traceability.md
```

Each endpoint appears exactly once and records:

| Endpoint | Controller | Intermediate Components | Repository/DAO | Final Dependency | DB Objects | State | Evidence |
|---|---|---|---|---|---|---|---|

Valid endpoint states are:

- `COMPLETE`;
- `UNRESOLVED`;
- `BLOCKED`;
- `FAILED`.

For an initial baseline to pass the coverage gate, every exposed endpoint must have a matrix row. `UNRESOLVED` rows are allowed only when the source check fully inspected the available path and explains the stopping point.

## Database rule

A database-backed trace does not stop at a repository name when the physical object can be proved from source.

Valid proof may include:

```text
Repository -> Entity/@Table -> schema.table
```

or:

```text
Repository -> @Query/native SQL/JdbcTemplate/query builder -> table/view/function
```

A table/view/function must never be inferred from a repository or class name alone.

## Coverage and resolution

Two separate values are required.

### Coverage

```text
Endpoints with a matrix trace result / total exposed endpoints * 100
```

Initial baseline requirement: **100%**.

### Resolution

```text
Endpoints with COMPLETE final dependency / total exposed endpoints * 100
```

Resolution may be below 100% when the unresolved endpoints are explicitly and correctly recorded.

## Runtime state

The first run is controlled under:

```text
workflows/WF-001-controller-traceability/runtime/
```

The runtime files record the current run, Job states, queue, Worker Input register, gate states and lane assignments. They prevent `JOB-003` from becoming READY before the complete repository-check gate passes.

## After the first baseline

After the initial matrix and source-artifact baseline are closed, later source changes may use targeted Worker Inputs under `WF-002-source-artifact-sync`.

The strict whole-repository check is required for establishing the first trusted baseline; later checks may be incremental when the previous baseline is already verified.
