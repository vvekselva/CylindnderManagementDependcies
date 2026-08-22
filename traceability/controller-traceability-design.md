# Controller Traceability Design

## Purpose

`WF-001-controller-traceability` proves, for every exposed HTTP endpoint in `vvekselva/CylinderManagement`:

> Which component receives the request, which application calls follow, and what final database, external service, file, cache, module or other dependency is reached?

No trace may be completed by guessing.

## First baseline rule

The first Controller Traceability baseline has one strict handoff:

```text
COMPLETE SOURCE REPOSITORY CHECK
             |
             | produces canonical output
             v
worker/results/WI-0004.yaml
             |
             | formal input
             v
ORCHESTRATOR - JOB-003 TRACEABILITY MATRIX
```

The Source Check Output is the **input to the Orchestrator** for the Traceability Job.

The Traceability Matrix must not be assembled from partial source-check batches and, during the initial baseline, `JOB-003` must not re-read `CylinderManagement` source to recreate missing source facts.

## Source Check producer

The first baseline uses:

```text
worker/inputs/WI-0004.yaml
```

The Generic Worker executes:

```text
init() -> service() -> close()
```

and produces:

```text
worker/results/WI-0004.yaml   # canonical machine-readable Source Check Output
worker/runs/WI-0004.md        # human-readable Worker lifecycle record
```

The required YAML structure is defined by:

```text
workflows/WF-001-controller-traceability/source-check-output-contract.yaml
```

`worker/results/WI-0004.yaml` is immutable once the Worker closes successfully.

## Generic Worker principle

Controller Traceability does not use a special-purpose source-analysis worker.

The independent component is a reusable **Generic Worker** defined by:

```text
automation/worker-component-contract.md
```

The actual task is always supplied through `worker/inputs/WI-####.yaml`.

Therefore:

```text
WORKER = reusable execution engine
INPUT FILE = task to execute
RUN FILE = human-readable lifecycle record
RESULT FILE = canonical result returned to the caller
```

## Complete initial data flow

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
          |
          v
worker/results/WI-0004.yaml
          |
          | validate against source-check-output-contract.yaml
          |
          | JOB-002 VERIFIED
          v
JOB-003 Complete Traceability Matrix
          |
          | INPUT = worker/results/WI-0004.yaml
          |
          +--> traceability/source-repository-check.md
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

## Separation of responsibilities

### Source Check Worker

The Worker is responsible for **source facts**:

- repository/source scope;
- exposed components;
- endpoints;
- actual call-path evidence;
- final dependencies;
- physical database objects when provable;
- unresolved items;
- evidence index;
- coverage/resolution counts.

### Orchestrator Traceability Job

`JOB-003` is responsible for **organizing accepted source facts into controlled traceability artifacts**:

- assign stable `CTL-###` IDs;
- assign stable `EP-###-##` IDs;
- create inventories;
- create the Traceability Matrix;
- create the unresolved report;
- create the human-readable Source Repository Check report;
- verify matrix counts against the Source Check Output.

The Orchestrator does not alter source conclusions from the Worker result.

## Source baseline

The current frozen source baseline is:

```text
3ae6e61442132d94a307275b08dd65fcef228d89
```

The complete Source Check Output and every initial Traceability Matrix row must describe this exact commit.

If the source changes while the initial baseline is being created, this run remains on the frozen commit. Later changes are handled by `WF-002-source-artifact-sync`.

## What WI-0004 must inspect

The complete repository check must inspect the frozen repository for all source areas required to establish Controller Traceability, including:

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

## Canonical Source Check Output

`worker/results/WI-0004.yaml` must contain the sections required by the output contract:

- `execution`;
- `repository_scope`;
- `exposed_components`;
- `endpoints`;
- `unresolved_items`;
- `coverage`;
- `evidence_index`.

`WI-0004` may close as `COMPLETED` only when:

1. the complete defined repository scope was checked;
2. every candidate production web component was classified;
3. every exposed endpoint was inventoried;
4. every exposed endpoint has a trace result;
5. every COMPLETE trace has source evidence to its final dependency;
6. every unproved final dependency is explicitly unresolved rather than guessed;
7. endpoint trace-result count equals exposed-endpoint count;
8. coverage is 100 percent;
9. the YAML result conforms to the output contract;
10. the Worker run is CLOSED.

A result is not acceptable when it is merely `PARTIAL` because some candidate source or endpoint was not checked.

## Earlier partial inputs

The earlier inputs do not unlock the first Traceability Matrix:

```text
WI-0001 -> historical evidence
WI-0002 -> historical evidence
WI-0003 -> superseded
WI-0004 -> authoritative complete Source Check
```

`WI-0004` must revalidate the complete source scope required by the initial baseline.

## Traceability Matrix Job input contract

`JOB-003 Complete Traceability Matrix` starts only when:

```text
JOB-002 = VERIFIED
WI-0004 result = COMPLETED
WI-0004 run = CLOSED
worker/results/WI-0004.yaml = CONTRACT_VALID
coverage_percent = 100
source_baseline = frozen workflow baseline
```

Its formal orchestration input is:

```text
SOURCE_CHECK_OUTPUT = worker/results/WI-0004.yaml
```

During the initial baseline, `JOB-003`:

- must not re-read the source repository for source facts;
- must not create another source-inspection Worker Input;
- must not silently repair or reinterpret unresolved source conclusions;
- must derive all matrix rows from `SOURCE_CHECK_OUTPUT`.

## Controller identity

Every exposed component from `SOURCE_CHECK_OUTPUT.exposed_components` receives a stable Controller ID:

```text
CTL-001
CTL-002
CTL-003
...
```

The Controller inventory records at least class name, source module/file, exposure type, class-level mapping, endpoint count, frozen source baseline and Worker evidence reference.

## Endpoint identity

Every exposed caller-visible HTTP method/path combination from `SOURCE_CHECK_OUTPUT.endpoints` receives a stable Endpoint ID under its Controller ID:

```text
CTL-007
  EP-007-01
  EP-007-02
  EP-007-03
```

The Endpoint inventory records at least HTTP method, full path, handler method, request/response types when provable and Worker evidence reference.

## Traceability Matrix

The initial matrix is written to:

```text
traceability/controller-traceability.md
```

Each endpoint appears exactly once and records:

| Endpoint | Controller | Intermediate Components | Repository/DAO | Final Dependency | DB Objects | State | Evidence |
|---|---|---|---|---|---|---|---|

Valid states are `COMPLETE`, `UNRESOLVED`, `BLOCKED`, and `FAILED`.

For the initial baseline to pass the coverage gate, every exposed endpoint from the accepted Source Check Output must have one matrix row.

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

Coverage and resolution remain separate.

```text
Coverage = endpoints with a trace result / exposed endpoints * 100
Resolution = endpoints with COMPLETE final dependency / exposed endpoints * 100
```

Initial baseline coverage must be 100%. Resolution may be below 100% when unresolved endpoints are explicitly and correctly recorded.

## Runtime state

The first run is controlled under:

```text
workflows/WF-001-controller-traceability/runtime/
```

Runtime files record the current run, Job states, queue, Worker Input/result handoff, gate states and lane assignments. They must keep `JOB-003` locked until the canonical Source Check Output is accepted.

## After the first baseline

After the initial matrix and source-artifact baseline are closed, later source changes may use targeted Worker Inputs under `WF-002-source-artifact-sync`.

The strict complete Source Check Output -> Orchestrator Traceability Job handoff is required for establishing the first trusted baseline.
