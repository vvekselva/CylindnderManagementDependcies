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
- Orchestration lane: `<LANE-##>`
- Run ID: `<RUN-...>`
- Final lane result: `COMPLETED | PARTIAL | BLOCKED | FAILED`

## init()

### What this lane is starting

<Simple-English statement of the assigned Controller trace.>

### Planned actions

1. Read the assigned Controller and Endpoint IDs.
2. Create/select Worker Input files for the evidence needed.
3. Consume only CLOSED Worker results.
4. Assemble the traceability artifact.

### Expected result

<Expected artifact/result.>

## Controller Summary

- Controller ID: `CTL-###`
- Class: `<class>`
- Class-level mapping: `<path or none>`
- Exposed endpoint count: `<n>`
- Controller discovery Worker Input/Result: `<WI-####>`

## Endpoint EP-###-01

### Exposure

- HTTP method: `<GET | POST | PUT | DELETE | PATCH | ANY>`
- Full path: `<path>`
- Controller method: `<method>`
- Request/input type: `<type or NOT YET CONFIRMED>`
- Response/output type: `<type or NOT YET CONFIRMED>`
- Endpoint-discovery Worker Input/Result: `<WI-####>`

### service() - Call Path

| Hop | Current Component | Current Method | Calls / Reaches | Worker Input / Fact | Status |
|---:|---|---|---|---|---|
| 1 | `<Controller>` | `<method>` | `<next component>` | `<WI-#### / fact>` | PROVED |
| 2 | `<component>` | `<method>` | `<next component>` | `<WI-#### / fact>` | PROVED |

### Final Dependency

- Type: `<DATABASE | EXTERNAL_API | MESSAGE_QUEUE | FILE_SYSTEM | EMAIL | OBJECT_STORAGE | CACHE | ANOTHER_MODULE | TERMINAL_APPLICATION_ACTION | UNKNOWN>`
- Final component: `<component>`
- Database/schema/object, when applicable: `<schema.table/view/function or NOT APPLICABLE>`
- Endpoint trace state: `COMPLETE | UNRESOLVED | BLOCKED | FAILED`
- Final evidence Worker Input/Result: `<WI-####>`

### If unresolved or blocked

- Last proven component: `<component>`
- What is missing: `<simple-English explanation>`
- Why work stopped: `<why continuing would require guessing or unsafe action>`
- Next Worker Input/task required: `<task description or WI-####>`
- Alternatives: `<reasonable alternatives>`

## Additional Endpoints

Repeat the Endpoint section for every exposed endpoint in this Controller.

## Worker Evidence Used

| Worker Input | Run | Result | Purpose | State |
|---|---|---|---|---|
| `WI-####` | `worker/runs/WI-####.md` | `worker/results/WI-####.md` | `<task>` | CLOSED |

Only CLOSED Worker runs may be used as final traceability evidence.

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

<Coordinator verification, follow-up Worker Input, decision, or no further action.>

### Log state

`CLOSED`
```

## Rules

- Do not remove `init()`, `service()` or `close()` sections.
- The Generic Worker task must come from a `worker/inputs/WI-*.yaml` file.
- Do not call a trace COMPLETE without evidence for every hop to the final dependency.
- Do not accept evidence from an unclosed Worker run.
- Do not guess a database table because of a repository or class name.
- Record multiple database objects when the endpoint provably uses multiple objects.
- Keep the main explanation readable in simple English.
