# Generic Worker Component Contract

## Purpose

The Worker is a reusable execution component that is independent of the orchestration worker pool.

The Worker itself does **not** contain Controller Traceability logic, source-analysis logic, database-migration logic, or any other project-specific task logic.

Its job is simple:

> Read one approved Worker Input file, execute exactly the work described in that file, return the result in the format/contract required by that input, and close the run.

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
            CANONICAL RESULT
                    |
                    v
         Orchestration consumes result
```

The Generic Worker is **not** `LANE-11` and does not consume one of the ten orchestration lanes.

## Worker identity versus task identity

The Worker has fixed execution behaviour. The task changes through the input file.

Nothing in the Worker implementation should need to change when the task changes.

## Mandatory input file

The Worker must not start actual work without one approved input file under:

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
- exact source baseline/ref when source-dependent;
- scope;
- permissions;
- ordered Actions;
- expected result path and format;
- result contract when a downstream consumer requires structured data;
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
8. what result format/contract is required;
9. what completion rule must pass.

If the input file is missing, invalid, ambiguous, or requests a permission not allowed by policy, the Worker does not run `service()`. It runs `close()` with `BLOCKED_BEFORE_SERVICE`.

### service()

The Worker executes only the Actions present in the input file and in the listed order unless the input explicitly permits another order.

The Worker must not invent extra tasks, broaden scope, or escalate permissions.

When the input requests a machine-readable result contract, the Worker must populate that contract from proved task evidence. It must not fill missing fields by guessing.

### close()

`close()` always runs after `init()`.

It records:

- Worker Input ID;
- Actions completed;
- Actions not completed;
- result file produced;
- result format/contract validation state;
- evidence produced;
- blocker/failure in simple English;
- alternatives, when useful;
- final result;
- next requested input, when another task is needed;
- end state `CLOSED`.

A result is not accepted by orchestration until the Worker run is `CLOSED`.

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

## Result formats

A Worker Input may request:

- `MARKDOWN` for a primarily human-consumed result;
- `YAML` for a machine-consumed orchestration handoff.

The human-readable lifecycle record always remains Markdown under `worker/runs/`.

For machine-consumed results, the input must identify a result contract. The downstream Orchestrator consumes the canonical result file directly rather than reconstructing machine state from the human log.

## Plain-English blocker rule

A Worker must never report only a technical symptom. It must explain what was requested, where it stopped, what prevented progress, why continuing would require guessing or unsafe behaviour, and what would allow continuation.

## Permissions are input-driven but policy-limited

The Worker may use only permissions that are both requested by the input and allowed by governance. An input can restrict permissions further but cannot override governance.

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

A normal execution uses:

```text
worker/inputs/WI-####.yaml      # what the Worker must do
worker/runs/WI-####.md          # init/service/close human-readable run
worker/results/WI-####.<format> # canonical result returned to caller
```

The result extension/format is defined by the Worker Input. A source-check result used directly by orchestration should normally be YAML.

The input file is immutable once execution begins. A changed task requires a new Worker Input ID.

## No hard-coded task rule

The Generic Worker contract contains execution behaviour only. Project-specific instructions and output schemas belong in Worker Inputs and Workflow-specific contracts.
