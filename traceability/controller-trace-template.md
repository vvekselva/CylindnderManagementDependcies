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
- Final worker result: `COMPLETED | PARTIAL | BLOCKED | FAILED`

## init()

### What this worker is starting

<Simple-English statement of the assigned controller trace.>

### Why this controller is being traced

<Reason this work belongs to the Controller Traceability workflow.>

### Planned actions

1. <action>
2. <action>
3. <action>

### Expected result

<Expected artifact/result.>

## Controller Summary

- Controller ID: `CTL-###`
- Class: `<class>`
- Class-level mapping: `<path or none>`
- Exposed endpoint count: `<n>`

## Endpoint EP-###-01

### Exposure

- HTTP method: `<GET | POST | PUT | DELETE | PATCH | ANY>`
- Full path: `<path>`
- Controller method: `<method>`
- Request/input type: `<type or NOT YET CONFIRMED>`
- Response/output type: `<type or NOT YET CONFIRMED>`

### service() - Call Path

| Hop | Current Component | Current Method | Calls / Reaches | Evidence | Status |
|---:|---|---|---|---|---|
| 1 | `<Controller>` | `<method>` | `<next component>` | `<source evidence>` | PROVED |
| 2 | `<component>` | `<method>` | `<next component>` | `<source evidence>` | PROVED |

### Final Dependency

- Type: `<DATABASE | EXTERNAL_API | MESSAGE_QUEUE | FILE_SYSTEM | EMAIL | OBJECT_STORAGE | CACHE | ANOTHER_MODULE | TERMINAL_APPLICATION_ACTION | UNKNOWN>`
- Final component: `<component>`
- Database/schema/object, when applicable: `<schema.table/view/function or NOT APPLICABLE>`
- Endpoint trace state: `COMPLETE | UNRESOLVED | BLOCKED | FAILED`

### If unresolved or blocked

- Last proven component: `<component>`
- What is missing: `<simple-English explanation>`
- Why the worker stopped: `<why continuing would require guessing or unsafe action>`
- Alternatives: `<reasonable alternatives>`
- Next investigation step: `<next action>`

## Additional Endpoints

Repeat the Endpoint section for every exposed endpoint in this Controller.

## close()

### Work completed

- Endpoints assigned: `<n>`
- Endpoints COMPLETE: `<n>`
- Endpoints UNRESOLVED: `<n>`
- Endpoints BLOCKED: `<n>`
- Endpoints FAILED: `<n>`

### Outputs and evidence produced

- `<artifact/evidence>`

### Final result in simple English

<Explain what completed and what did not.>

### What happens next

<Coordinator verification, follow-up, decision, or no further action.>

### Log state

`CLOSED`
```

## Rules

- Do not remove `init()`, `service()` or `close()` sections.
- Do not call a trace COMPLETE without evidence for every hop to the final dependency.
- Do not guess a database table because of a repository or class name.
- Record multiple database objects when the endpoint provably uses multiple objects.
- Keep technical evidence short; the main explanation must remain readable in simple English.
