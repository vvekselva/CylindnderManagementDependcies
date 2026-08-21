# Controller Traceability Design

## Purpose

This document defines exactly how `WF-001-controller-traceability` must discover and trace exposed HTTP endpoints in `vvekselva/CylinderManagement`.

The goal is to answer, for every exposed endpoint:

> When this URL is called, which controller or REST component receives it, which application components are called next, and what final database, external service, file, module or other dependency is reached?

The trace must be based on source evidence. Workers must not guess missing layers or database objects.

## Source baseline

One CylinderManagement commit is frozen before discovery begins.

Every worker uses that same commit for the complete workflow.

If the source repository changes while the workflow is running, the current workflow continues against the frozen commit. The later source change is handled by `WF-002-source-artifact-sync`.

## Discovery scope

The discovery job inspects production Java source under `src/main/java` in the application web modules.

It must include classes that actually expose Spring web requests, including classes using:

- `@Controller`;
- `@RestController`;
- `@RequestMapping` at class or method level;
- `@GetMapping`;
- `@PostMapping`;
- `@PutMapping`;
- `@DeleteMapping`;
- `@PatchMapping`.

The discovery job must not rely only on filenames ending with `Controller.java`.

A production package whose name contains `test` is still inspected when it is under `src/main/java`. Files under `src/test/java` are test code and are not included in the exposed-controller inventory.

## Controller identity

Every exposed component receives a stable Controller ID:

```text
CTL-001
CTL-002
CTL-003
...
```

The inventory records:

- Controller ID;
- class name;
- source module;
- source file;
- class-level mapping, when present;
- exposure type (`MVC`, `REST`, or `MIXED`);
- endpoint count;
- source baseline;
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
- source evidence;
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

One worker owns one controller work item at a time.

The worker traces every exposed endpoint in that controller vertically from the exposed method to the final dependency.

The worker follows the source as it actually exists. It does not force a fixed architecture.

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

Every hop must be supported by source evidence.

For each hop record:

- source component;
- source method;
- next component called;
- method or operation called;
- source file;
- evidence statement.

A class field alone does not prove that a specific endpoint uses that dependency. The worker should trace the actual endpoint method and the calls reachable from that method.

## Database trace rule

If the final dependency is database-backed, the trace does not stop at a repository name.

Continue through the evidence that identifies the physical database object, for example:

```text
Repository
  -> Entity / @Table
  -> PostgreSQL
  -> schema.table
```

or:

```text
Repository
  -> @Query / native SQL / JdbcTemplate
  -> PostgreSQL
  -> table / view / function
```

Record every database object proved to be used by that endpoint.

If the repository delegates query construction to another component, continue into that component before naming a table or view.

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

- `COMPLETE` - the endpoint has been traced to a final dependency with evidence;
- `UNRESOLVED` - the trace stopped at a known component because the next dependency could not yet be proved;
- `BLOCKED` - work cannot continue until missing information or a decision is supplied;
- `FAILED` - the trace action itself could not produce a valid result because of an execution failure.

`UNRESOLVED` must include the last proven component, the missing information, why guessing would be unsafe, and the next investigation step.

## Worker lifecycle

Every controller work item uses the mandatory Worker Service Contract:

```text
init()
  -> service()
  -> close()
```

### init()

The worker records in simple English:

- lane;
- workflow and job;
- assigned Controller ID and class;
- source baseline;
- endpoint count being traced;
- actions it will perform;
- expected artifact path.

The coordinator opens the human-readable log event.

### service()

The worker traces each endpoint, captures hop evidence, identifies final dependencies, and records unresolved items without guessing.

### close()

The worker always closes the run and records:

- endpoints completed;
- endpoints unresolved;
- outputs produced;
- evidence produced;
- blocker/failure explanation when applicable;
- final worker result;
- next action;
- log state `CLOSED`.

## Worker output

Each controller work item creates one artifact:

```text
traceability/controllers/CTL-###-<ControllerClass>.md
```

The format is defined in `traceability/controller-trace-template.md`.

Workers do not directly update the consolidated report, global TaskStatus, shared log, story or synchronization register. The coordinator owns those shared files.

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
2. `GATE-TRC-002` - production web-source scope is enumerated;
3. `GATE-TRC-003` - every exposed controller is inventoried;
4. `GATE-TRC-004` - every exposed endpoint is inventoried;
5. `GATE-TRC-005` - every endpoint has a controller trace result;
6. `GATE-TRC-006` - every COMPLETE hop has source evidence;
7. `GATE-TRC-007` - unresolved endpoints contain a clear stopping point and next action;
8. `GATE-TRC-008` - coverage is 100%;
9. `GATE-TRC-009` - source-to-artifact sync register is updated;
10. `GATE-TRC-010` - human-readable log/story is closed and current.

## Synchronization after the baseline

After the initial workflow is verified, `WF-002-source-artifact-sync` compares newer CylinderManagement source commits to the baseline represented by the artifacts.

Internal implementation changes that do not alter the exposed API or recorded dependency path do not require an artifact refresh.

Changes to the recorded dependency path refresh the affected artifact.

Changes to exposed APIs, addition/removal of exposed components, or changes whose impact cannot be confirmed require user notification according to `governance/source-artifact-sync-policy.md`.
