# Controller Traceability Design

## Purpose

This document defines exactly how `WF-001-controller-traceability` discovers and traces exposed HTTP endpoints in `vvekselva/CylinderManagement`.

The goal is to answer, for every exposed endpoint:

> When this URL is called, which controller or REST component receives it, which application components are called next, and what final database, external service, file, module or other dependency is reached?

The trace must be based on source evidence. No worker may guess missing layers or database objects.

## Separation between orchestration and source analysis

Controller Traceability uses two different kinds of workers.

```text
ORCHESTRATION
Coordinator + LANE-01 ... LANE-10
        |
        | requests source facts
        v
INDEPENDENT SOURCE ANALYSIS WORKER
Read-only analysis of one exact source commit
        |
        v
Source Facts Package
        |
        v
ORCHESTRATION builds/updates traceability artifacts
```

The independent Source Analysis Worker is defined by `automation/source-analysis-worker-contract.md`.

It does not consume one of the ten orchestration lanes.

The Source Analysis Worker reads source code and returns proved facts. The orchestration workers use those facts to perform Workflow Jobs, create artifacts, explain blockers and satisfy gates.

This separation means controller-tracing workers do not independently invent their own interpretation of source structure.

## Source baseline

One CylinderManagement commit is frozen before discovery begins.

Every orchestration worker and every Source Analysis request uses that same commit for the complete workflow.

If the source repository changes while the workflow is running, the current workflow continues against the frozen commit. The later change is handled by `WF-002-source-artifact-sync`.

## Source Analysis requests used by this workflow

The workflow uses the independent Source Analysis Worker at several depths.

### Discovery request

Purpose: identify production source areas and Spring components that actually expose HTTP requests.

### Endpoint request

Purpose: identify handler methods, HTTP methods, class/method mappings and full caller-visible paths.

### Call-path request

Purpose: follow one endpoint from its handler method to the next component and onward through the actual calls.

### Database-object request

Purpose: continue database-backed paths through repository/DAO/query/entity evidence until the physical table, view or function can be proved.

A deeper request is created when the earlier result returns `UNRESOLVED` but identifies a safe next source location to inspect.

## Discovery scope

The Source Analysis Worker inspects production Java source under `src/main/java` in application packages that are actually component-scanned by the Spring Boot application.

It must include classes that actually expose Spring web requests, including classes using:

- `@Controller`;
- `@RestController`;
- `@RequestMapping` at class or method level;
- `@GetMapping`;
- `@PostMapping`;
- `@PutMapping`;
- `@DeleteMapping`;
- `@PatchMapping`.

Discovery must not rely only on filenames ending with `Controller.java`.

A production package whose name contains `test` is still inspected when it is under `src/main/java` and is component-scanned. Files under `src/test/java` are test code and are not included in the exposed-controller inventory.

## Controller identity

Every exposed component receives a stable Controller ID:

```text
CTL-001
CTL-002
CTL-003
...
```

The orchestration layer creates the Controller Inventory from Source Analysis facts.

The inventory records:

- Controller ID;
- class name;
- source module;
- source file;
- class-level mapping, when present;
- exposure type (`MVC`, `REST`, or `MIXED`);
- endpoint count;
- source baseline;
- Source Analysis evidence;
- trace state.

## Endpoint identity

Every exposed handler method receives an Endpoint ID derived from its Controller ID:

```text
CTL-007
  EP-007-01
  EP-007-02
  EP-007-03
```

If one annotation exposes multiple paths or multiple HTTP methods, each caller-visible method/path combination is represented explicitly so coverage can be measured correctly.

The endpoint inventory records:

- Endpoint ID;
- Controller ID;
- HTTP method;
- full URL path;
- controller class;
- controller method;
- request/input type where provable;
- response/output type where provable;
- Source Analysis evidence;
- trace state.

For `@RequestMapping` without an HTTP method restriction, record the HTTP method as `ANY` unless a narrower method can be proved elsewhere.

## Full URL rule

The final endpoint path is the combination of class-level and method-level mappings.

Example:

```text
Class:  @RequestMapping("/cylindermanagement")
Method: @GetMapping("/vehicle-loads/list")

Final path:
/cylindermanagement/vehicle-loads/list
```

Do not record only the method-level path when a class-level prefix exists.

## Vertical trace rule

One orchestration lane owns one controller work item at a time.

That lane is responsible for the traceability artifact and Workflow result, but it asks the independent Source Analysis Worker for the actual source facts needed to trace each endpoint.

The source path is followed as it actually exists. A fixed architecture is not forced.

Valid examples include:

```text
Controller -> Service -> Repository -> Entity -> PostgreSQL table
```

```text
Controller -> Mediator -> Handler -> Service -> Repository -> View
```

```text
Controller -> Service -> External REST API
```

```text
Controller -> Service -> File system
```

## Hop evidence rule

Every hop must be supported by a `PROVED` Source Analysis fact.

For each hop record:

- source component;
- source method;
- next component called;
- method or operation called;
- source file;
- Source Analysis Request/Fact ID;
- evidence statement.

A class field alone does not prove that a specific endpoint uses that dependency. Endpoint-specific analysis must follow the actual handler method and calls reachable from that method.

## Database trace rule

If the final dependency is database-backed, the trace does not stop at a repository name.

The orchestration lane requests deeper Source Analysis until evidence identifies the physical database object, for example:

```text
Repository
  -> Entity / @Table
  -> PostgreSQL
  -> schema.table
```

or:

```text
Repository
  -> @Query / native SQL / JdbcTemplate / query builder
  -> PostgreSQL
  -> table / view / function
```

Record every database object proved to be used by that endpoint.

If a repository delegates query construction to another component, the Source Analysis Worker continues into that component before a table or view can be named.

## Final dependency types

Use one of these values:

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

## Endpoint trace states

Use:

- `COMPLETE` - endpoint traced to final dependency with evidence;
- `UNRESOLVED` - analysis stopped at a known component because the next dependency could not yet be proved;
- `BLOCKED` - work cannot continue until missing information or a decision is supplied;
- `FAILED` - the requested analysis/execution could not produce a valid result.

`UNRESOLVED` must include the last proven component, missing information, why guessing would be unsafe, and the next investigation step.

## Orchestration worker lifecycle

Every controller work item uses the mandatory Worker Service Contract:

```text
init()
  -> service()
  -> close()
```

### init()

The orchestration worker records:

- lane;
- Workflow and Job;
- assigned Controller ID and class;
- source baseline;
- endpoint count being traced;
- Source Analysis requests it expects to need;
- expected artifact path.

The coordinator opens the human-readable automation log event.

### service()

The orchestration worker requests/consumes source facts, assembles the endpoint traces, identifies COMPLETE/UNRESOLVED results, and produces its controller artifact.

The orchestration worker does not substitute guesses when the Source Analysis Worker returns `UNRESOLVED`.

### close()

The orchestration worker always closes the run and records:

- endpoints completed;
- endpoints unresolved;
- Source Analysis Request IDs used;
- outputs produced;
- evidence produced;
- blocker/failure explanation when applicable;
- final worker result;
- next action;
- log state `CLOSED`.

## Source Analysis Worker lifecycle

Each source-analysis request independently uses:

```text
init()
  -> validate request, baseline and source scope
service()
  -> read source and return evidence-backed facts
close()
  -> summarize PROVED and UNRESOLVED facts and close its run
```

Source Analysis run/result records live under `source-analysis/` and are separate from the orchestration log.

## Worker output

Each controller work item creates one orchestration artifact:

```text
traceability/controllers/CTL-###-<ControllerClass>.md
```

The format is defined in `traceability/controller-trace-template.md`.

Orchestration workers do not directly update the consolidated report, global TaskStatus, shared log, story or synchronization register. The coordinator owns those shared files.

The Source Analysis Worker also does not update those shared files.

## Coordinator outputs

The coordinator creates and maintains:

- `traceability/controller-inventory.md`;
- `traceability/endpoint-inventory.md`;
- `traceability/controller-traceability.md`;
- `traceability/unresolved-traceability.md`;
- `sync/source-artifact-sync-register.yaml`;
- `logs/automation-log.md`;
- `logs/automation-story.md`;
- `TaskStatus.md`.

## Coverage and resolution

Two percentages are required.

### Coverage

```text
Endpoints with a trace result / total exposed endpoints discovered * 100
```

The workflow cannot complete unless coverage is 100%.

### Resolution

```text
Endpoints with COMPLETE trace / total exposed endpoints discovered * 100
```

Resolution may be less than 100% when unresolved endpoints are clearly recorded.

## Quality gates

The workflow must pass these gates in order:

1. `GATE-TRC-001` - one source baseline is frozen;
2. `GATE-TRC-002` - production/component-scanned source scope is proved by Source Analysis;
3. `GATE-TRC-003` - every exposed controller is inventoried from proved facts;
4. `GATE-TRC-004` - every exposed endpoint is inventoried from proved facts;
5. `GATE-TRC-005` - every endpoint has a controller trace result;
6. `GATE-TRC-006` - every COMPLETE hop references Source Analysis evidence;
7. `GATE-TRC-007` - unresolved endpoints contain a clear stopping point and next action;
8. `GATE-TRC-008` - coverage is 100%;
9. `GATE-TRC-009` - source-to-artifact sync register is updated;
10. `GATE-TRC-010` - all source-analysis and orchestration runs used by the workflow are closed, and the human story is current.

## Synchronization after the baseline

After the initial workflow is verified, `WF-002-source-artifact-sync` compares newer CylinderManagement commits to the baseline represented by the artifacts.

The independent Source Analysis Worker can be asked to classify what changed at source level. The orchestration/synchronization workflow decides the impact:

- internal implementation change with same API and same trace: no artifact refresh;
- dependency-path change: refresh affected artifact;
- exposed API change: notify user and refresh artifact;
- exposed component added/removed: notify user and update inventories/artifacts;
- impact cannot be proved: notify user and require review.
