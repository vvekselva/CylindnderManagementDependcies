# Controller Traceability Artifact Template

Use this format for every per-controller artifact created by `WF-001-controller-traceability`.

```markdown
# CTL-### - <ControllerClass>

## Source Identity

- Source repository: `vvekselva/CylinderManagement`
- Source baseline: `<commit SHA>`
- Source module: `<module>`
- Source file: `<path>`
- Exposure type: `MVC | REST | MIXED`
- Worker lane: `<LANE-##>`
- Run ID: `<RUN-...>`
- Source Analysis requests used: `<SAR-...>`
- Final worker result: `COMPLETED | PARTIAL | BLOCKED | FAILED`

## init()

### What this orchestration worker is starting

<Simple-English statement of the assigned controller trace.>

### Why this controller is being traced

<Reason this work belongs to the Controller Traceability workflow.>

### Planned actions

1. Read the assigned Controller/Endpoint IDs from the workflow inventories.
2. Request the required source facts from the independent Source Analysis Worker.
3. Build the traceability artifact only from proved facts.

### Expected result

<Expected artifact/result.>

## Controller Summary

- Controller ID: `CTL-###`
- Class: `<class>`
- Class-level mapping: `<path or none>`
- Exposed endpoint count: `<n>`
- Exposure Source Fact IDs: `<SAF-...>`

## Endpoint EP-###-01

### Exposure

- HTTP method: `<GET | POST | PUT | DELETE | PATCH | ANY>`
- Full path: `<path>`
- Controller method: `<method>`
- Request/input type: `<type or NOT YET CONFIRMED>`
- Response/output type: `<type or NOT YET CONFIRMED>`
- Source Analysis Request: `<SAR-...>`
- Source Fact IDs: `<SAF-...>`

### service() - Call Path

| Hop | Current Component | Current Method | Calls / Reaches | Source Analysis Fact | Evidence | Status |
|---:|---|---|---|---|---|---|
| 1 | `<Controller>` | `<method>` | `<next component>` | `<SAF-...>` | `<source evidence>` | PROVED |
| 2 | `<component>` | `<method>` | `<next component>` | `<SAF-...>` | `<source evidence>` | PROVED |

### Final Dependency

- Type: `<DATABASE | EXTERNAL_API | MESSAGE_QUEUE | FILE_SYSTEM | EMAIL | OBJECT_STORAGE | CACHE | ANOTHER_MODULE | TERMINAL_APPLICATION_ACTION | UNKNOWN>`
- Final component: `<component>`
- Database/schema/object, when applicable: `<schema.table/view/function or NOT APPLICABLE>`
- Final dependency Source Fact IDs: `<SAF-...>`
- Endpoint trace state: `COMPLETE | UNRESOLVED | BLOCKED | FAILED`

### If unresolved or blocked

- Source Analysis Request: `<SAR-...>`
- Last proven Source Fact: `<SAF-...>`
- Last proven component: `<component>`
- What is missing: `<simple-English explanation>`
- Why the worker stopped: `<why continuing would require guessing or unsafe action>`
- Alternatives: `<reasonable alternatives>`
- Next Source Analysis request or Workflow action: `<next action>`

## Additional Endpoints

Repeat the Endpoint section for every exposed endpoint in this Controller.

## close()

### Work completed

- Endpoints assigned: `<n>`
- Endpoints COMPLETE: `<n>`
- Endpoints UNRESOLVED: `<n>`
- Endpoints BLOCKED: `<n>`
- Endpoints FAILED: `<n>`
- Source Analysis requests consumed: `<SAR-...>`

### Outputs and evidence produced

- `<artifact/evidence>`

### Final result in simple English

<Explain what completed and what did not.>

### What happens next

<Coordinator verification, follow-up, decision, deeper Source Analysis request, or no further action.>

### Log state

`CLOSED`
```

## Rules

- Do not remove `init()`, `service()` or `close()` sections.
- The orchestration worker owns the traceability artifact; the independent Source Analysis Worker owns source-fact generation.
- Do not call a trace COMPLETE unless every hop to the final dependency references PROVED Source Analysis evidence.
- Do not guess a database table because of a repository or class name.
- Record multiple database objects when the endpoint provably uses multiple objects.
- An UNRESOLVED Source Analysis fact must remain unresolved until deeper analysis proves it.
- Keep technical evidence short; the main explanation must remain readable in simple English.
