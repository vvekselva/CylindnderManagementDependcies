# Generic Worker Component Contract

## Purpose

The Worker is a reusable execution component that is independent of the orchestration worker pool.

The Worker itself does **not** contain Controller Traceability logic, source-analysis logic, database-migration logic, or any other project-specific task logic.

Its job is simple:

> Read one approved Worker Input file, execute exactly the work described in that file, return evidence/results, and close the run.

The actual task is always supplied through an input file.

## Architectural position

```text
ORCHESTRATION / CONTROL PLANE
Workflow -> Job -> Action -> LANE-01 ... LANE-10
                    |
                    | creates/selects Worker Input file
                    v
              GENERIC WORKER
             independent service
                    |
             init -> service -> close
                    |
                    v
              Worker Result
                    |
                    v
         Orchestration consumes result
```

The Generic Worker is **not** `LANE-11` and does not consume one of the ten orchestration lanes.

## Worker identity versus task identity

The Worker has a fixed execution behaviour.

The task changes through the input file.

Examples:

```text
Same Worker
  + input: discover exposed controllers
  + input: list endpoint mappings
  + input: trace one endpoint call path
  + input: inspect database-object evidence
  + input: compare two source commits
  + input: inspect a configuration dependency
```

Nothing in the Worker implementation should need to change when the task changes.

## Mandatory input file

The Worker must not start actual work without one approved input file.

Input files live under:

```text
worker/inputs/
```

The standard structure is defined by:

```text
worker/worker-input-template.yaml
```

Every input must define at least:

- Worker Input ID;
- requesting Workflow and Job, when applicable;
- task name and purpose;
- target repository/resource;
- exact source baseline/ref when the task depends on source code;
- scope;
- permissions;
- ordered Actions;
- expected output;
- evidence requirements;
- completion check;
- blocker rules.

## Mandatory lifecycle

Every Worker Input execution uses:

```text
init()
   -> service()
   -> close()
```

### init()

The Worker reads the input file and records in simple English:

1. which input file it received;
2. what task it is about to perform;
3. why the task was requested;
4. what repository/resource and baseline it will use;
5. what scope it is allowed to inspect/change;
6. what permissions are allowed;
7. what Actions it will perform;
8. what output is expected;
9. what completion rule must pass.

If the input file is missing, invalid, ambiguous, or requests a permission not allowed by policy, the Worker does not run `service()`. It runs `close()` with `BLOCKED_BEFORE_SERVICE`.

### service()

The Worker executes only the Actions present in the input file and in the listed order unless the input explicitly permits another order.

The Worker must not invent extra tasks.

The Worker must not broaden the source scope, write permissions, database permissions, or output scope beyond the input file.

When the input asks for source inspection, `service()` may read source and return source facts.

When a future input asks for another permitted task, the same Worker executes that task instead.

### close()

`close()` always runs after `init()`.

It records:

- Worker Input ID;
- Actions completed;
- Actions not completed;
- outputs produced;
- evidence produced;
- blocker/failure in simple English;
- alternatives, when useful;
- final result;
- next requested input, when another task is needed;
- end state `CLOSED`.

## Result states

Use:

- `COMPLETED` - all required Actions and completion checks passed;
- `PARTIAL` - useful results were produced but some required work remains;
- `BLOCKED` - required information/permission/decision is missing;
- `FAILED` - the requested Action was attempted but could not produce a valid result.

For individual facts produced by inspection tasks, use:

- `PROVED`;
- `UNRESOLVED`;
- `NOT_APPLICABLE`.

## Plain-English blocker rule

A Worker must never report only a technical symptom.

It must explain:

1. what the input asked it to do;
2. where it stopped;
3. what is missing or preventing progress;
4. why continuing would require guessing or unsafe behaviour;
5. what input, information, permission, or decision would allow work to continue;
6. reasonable alternatives when available.

## Permissions are input-driven but policy-limited

The input file states requested permissions, for example:

```yaml
permissions:
  source_read: true
  source_write: false
  database_read: false
  database_write: false
```

The Worker may use only permissions that are both:

1. requested by the input; and
2. allowed by repository governance.

An input file can restrict permissions further, but it cannot override governance to grant a forbidden capability.

## Separation from orchestration

The Worker does not:

- choose which Workflow runs next;
- assign Jobs to lanes;
- change Job priority;
- edit `TaskStatus.md` directly;
- edit the shared automation log directly;
- make user-notification decisions;
- silently choose remediation or architecture changes.

The orchestration layer creates/selects the Worker Input and decides how to use the closed result.

## Runtime files

Each execution uses three files:

```text
worker/inputs/WI-####.yaml   # what the Worker must do
worker/runs/WI-####.md       # init/service/close human-readable run
worker/results/WI-####.md    # result/evidence returned to caller
```

The input file is immutable once execution begins. A changed task requires a new Worker Input ID.

## No hard-coded task rule

The Generic Worker contract must contain execution behaviour only.

Project-specific instructions belong in input files or Workflow definitions.

Therefore terms such as "discover controllers", "trace repositories", or "find tables" may appear in Controller Traceability input files, but they must not be built into the Worker component as permanent responsibilities.
