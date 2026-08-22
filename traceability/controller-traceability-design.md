# Controller Traceability Design

## Purpose

`WF-001-controller-traceability` must prove, for every exposed HTTP endpoint in `vvekselva/CylinderManagement`:

> Which component receives the request, which application calls follow, and what final database, external service, file, cache, module or other dependency is reached?

No trace may be completed by guessing.

## Generic Worker principle

Controller Traceability does not use a special-purpose source-analysis worker.

It uses the same independent **Generic Worker** used by other automation tasks.

The Generic Worker is defined by:

```text
automation/worker-component-contract.md
```

The Controller Traceability task is supplied through input files:

```text
worker/inputs/WI-####.yaml
```

Therefore:

```text
WORKER = reusable execution engine
INPUT FILE = actual task
RESULT FILE = evidence returned from that task
```

## Separation from orchestration

```text
COORDINATOR
    |
    +--------------------------+
    |                          |
    v                          v
10 ORCHESTRATION LANES     WORKER INPUT
                               |
                               v
                         GENERIC WORKER
                     init -> service -> close
                               |
                               v
                         WORKER RESULT
    |                          |
    +------------<-------------+
    |
    v
TRACEABILITY ARTIFACTS
```

The Generic Worker is not one of `LANE-01` through `LANE-10`.

The orchestration layer decides what task is needed and supplies an input file. The Worker only executes that input.

## Source baseline

Before source-dependent inputs run, one CylinderManagement commit is frozen.

Every Worker Input for this workflow that reads source must specify that same exact commit.

Current frozen baseline:

```text
3ae6e61442132d94a307275b08dd65fcef228d89
```

A later source change is handled separately by `WF-002-source-artifact-sync`.

## Input-driven discovery

The initial Controller Traceability inputs are:

```text
WI-0001 - determine production web source boundary
WI-0002 - verify first exposed-component batch
WI-0003 - verify remaining exposed components
```

Later Jobs create additional Worker Inputs for:

- endpoint mapping extraction;
- endpoint call-path tracing;
- deeper component-call tracing;
- repository/entity/query inspection;
- physical database-object proof;
- source-change comparison.

These responsibilities belong to input files, not to the Worker component.

## Controller discovery rule

The Controller inventory is built only from closed Worker results that prove actual Spring HTTP exposure.

Discovery must consider production classes under the Spring component-scanned runtime boundary and may use evidence such as:

- `@Controller`;
- `@RestController`;
- `@RequestMapping`;
- `@GetMapping`;
- `@PostMapping`;
- `@PutMapping`;
- `@DeleteMapping`;
- `@PatchMapping`.

A filename ending in `Controller.java` is only a candidate, not proof.

A production package containing the word `test` remains in scope when it lives under `src/main/java` and Spring component-scans it. Real test code under `src/test/java` is excluded.

## Controller identity

Every proved exposed component receives a stable ID:

```text
CTL-001
CTL-002
CTL-003
...
```

The Controller inventory records:

- Controller ID;
- class name;
- source module/path;
- exposure type (`MVC`, `REST`, `MIXED`);
- class-level mapping if any;
- endpoint count;
- source baseline;
- Worker Input/Result evidence IDs;
- trace state.

## Endpoint identity

Every caller-visible HTTP method/path combination receives an Endpoint ID:

```text
CTL-007
  EP-007-01
  EP-007-02
  EP-007-03
```

The Endpoint inventory records:

- Endpoint ID;
- Controller ID;
- HTTP method;
- full URL path;
- handler class/method;
- input/output type when proved;
- Worker Input/Result evidence;
- trace state.

For unrestricted `@RequestMapping`, record HTTP method `ANY` unless a narrower method is proved.

## Full URL rule

Combine class-level and method-level mappings.

Example:

```text
Class:  /cylindermanagement
Method: /vehicle-loads/list
Result: /cylindermanagement/vehicle-loads/list
```

## Vertical trace rule

One orchestration lane owns one Controller artifact at a time.

For each endpoint, the lane requests evidence through one or more Worker Inputs.

Example:

```text
LANE-04 owns CTL-007
       |
       v
WI-0042: inspect EP-007-01 handler call
       |
       v
Worker Result: handler calls TripService.process(...)
       |
       v
WI-0043: inspect TripService.process(...)
       |
       v
Worker Result: service calls TripRepository.find...
       |
       v
WI-0044: inspect repository/entity/query mapping
       |
       v
Worker Result: PostgreSQL object proved
       |
       v
CTL-007 artifact updated
```

Each deeper task is explicit in a new input file.

## Hop evidence rule

Every COMPLETE hop must reference a CLOSED Worker result.

For each hop record:

- current component;
- current method;
- next component/operation;
- source file/location;
- Worker Input ID;
- Worker Result Fact ID;
- confidence (`PROVED`, `UNRESOLVED`, `NOT_APPLICABLE`).

An injected field alone does not prove a handler uses that dependency. The Worker Input must ask the Worker to inspect the actual reachable call path.

## Database trace rule

Database-backed traces do not stop at a Repository name.

Additional Worker Inputs continue until source evidence proves the physical object through, for example:

```text
Repository -> Entity -> @Table -> schema.table
```

or:

```text
Repository -> @Query/native SQL/JdbcTemplate/query builder -> table/view/function
```

If the exact object cannot be proved, the result remains `UNRESOLVED` and records the last proved source location.

## Final dependency types

Use:

- `DATABASE`;
- `EXTERNAL_API`;
- `MESSAGE_QUEUE`;
- `FILE_SYSTEM`;
- `EMAIL`;
- `OBJECT_STORAGE`;
- `CACHE`;
- `ANOTHER_MODULE`;
- `TERMINAL_APPLICATION_ACTION`;
- `UNKNOWN`.

## Trace states

- `COMPLETE` - final dependency proved;
- `UNRESOLVED` - trace stopped at a known point and the next fact is not yet proved;
- `BLOCKED` - missing information/permission/decision prevents progress;
- `FAILED` - the requested execution itself failed.

For `UNRESOLVED`, record:

- last proved component;
- what is still unknown;
- why continuing would require guessing;
- next Worker Input/task needed.

## Generic Worker lifecycle inside this workflow

Every Worker Input uses:

```text
init()
  -> read input and state task/scope/permissions
service()
  -> execute only input Actions
close()
  -> record result/blocker/evidence and close run
```

The run and result are stored as:

```text
worker/runs/WI-####.md
worker/results/WI-####.md
```

A result from an unclosed run cannot be used as traceability evidence.

## Orchestration lane lifecycle

The ten orchestration lanes continue to use `automation/worker-service-contract.md` for their assigned Workflow Jobs:

```text
init -> service -> close
```

The lane owns the workflow artifact. The Generic Worker owns only execution of the individual input file.

## Worker output references

Each Controller artifact must record the Worker Input/Result IDs used to prove its endpoints and hops.

Per-controller artifact path:

```text
traceability/controllers/CTL-###-<ControllerClass>.md
```

## Shared output ownership

Neither an orchestration lane nor the Generic Worker directly edits shared coordinator files during parallel work.

Coordinator-owned files include:

- `TaskStatus.md`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `traceability/controller-inventory.md`;
- `traceability/endpoint-inventory.md`;
- `traceability/controller-traceability.md`;
- `traceability/unresolved-traceability.md`;
- `sync/source-artifact-sync-register.yaml`.

## Coverage and resolution

Coverage:

```text
endpoints with any trace result / total exposed endpoints * 100
```

Coverage must reach 100%.

Resolution:

```text
COMPLETE endpoints / total exposed endpoints * 100
```

Resolution may be below 100% when unresolved items are clearly documented.

## Quality gates

1. `GATE-TRC-001` - one source baseline frozen;
2. `GATE-TRC-002` - production web-source scope proved;
3. `GATE-TRC-003` - exposed Controller inventory complete;
4. `GATE-TRC-004` - exposed Endpoint inventory complete;
5. `GATE-TRC-005` - every Endpoint has a trace result;
6. `GATE-TRC-006` - every COMPLETE hop references CLOSED Worker evidence;
7. `GATE-TRC-007` - unresolved items have a stopping point and next task;
8. `GATE-TRC-008` - coverage is 100%;
9. `GATE-TRC-009` - source-to-artifact sync register updated;
10. `GATE-TRC-010` - all Worker/orchestration runs used by the workflow are CLOSED and story is current.

## Synchronization

`WF-002-source-artifact-sync` may also use the same Generic Worker with change-comparison input files.

The synchronization Workflow, not the Worker, decides whether a change is `INTERNAL_ONLY`, `TRACE_CHANGED`, `EXPOSED_API_CHANGED`, `COMPONENT_ADDED_OR_REMOVED` or `IMPACT_NOT_CONFIRMED`.
