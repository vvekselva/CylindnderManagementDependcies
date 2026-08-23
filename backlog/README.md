# Automation Backlog

The Backlog is the top-level work queue for the automation framework.

`backlog/backlog.yaml` is the authoritative Backlog register. A Backlog Item may be registered before it is ready to execute, but every Backlog Item must have a valid Statement of Work before the Orchestrator may analyze, plan or execute it.

## Mandatory Statement of Work

Every Backlog Item must declare a `statement_of_work` file under `backlog/sow/`.

The common gate `QG-SOW-001 Statement of Work Completeness Gate` is fail-closed. It must PASS before dependency evaluation, Orchestrator analysis, execution planning, Worker Input generation or execution.

A valid Statement of Work must contain non-placeholder content for at least:

- objective;
- problem statement;
- in-scope work;
- deliverables;
- execution requirements;
- dependencies;
- acceptance criteria;
- quality-gate requirements;
- completion definition.

If the SOW is missing, null, malformed, incomplete or still contains placeholders, the Backlog Item is not executable even when `run_enabled: true`.

The standard contract is `backlog/statement-of-work-template.yaml`.

## Flow

```text
BACKLOG
  |
  v
SELECT RUN-ENABLED ITEM
  |
  v
QG-SOW-001: VALID STATEMENT OF WORK?
  | NO -----------------> BLOCKED / DO NOT EXECUTE
  |
 YES
  |
  v
QG-DEP-001: DEPENDENCIES SATISFIED?
  |
  v
ITEM QUALITY GATE CONFIGURED / APPROVED?
  |
  v
READ COMPLETION PATH
  |
  v
ORCHESTRATOR ANALYSIS
  |
  v
EXECUTION PLAN / WORK UNITS
  |
  v
GENERATE WORKER INPUT FILES
  |
  v
GENERIC WORKER EXECUTION
  |
  v
WORKER RESULTS
  |
  v
ORCHESTRATOR VALIDATION
  |
  v
USER ACCEPTANCE WHEN REQUIRED
  |
  v
BACKLOG ITEM VERIFIED / CLOSED
```

## Static files

- `backlog.yaml` - authoritative Backlog register and SOW references.
- `backlog-item-template.yaml` - standard Backlog Item shape.
- `statement-of-work-template.yaml` - mandatory SOW contract.
- `orchestrator-run-config.yaml` - execution switchboard and eligibility rules.
- `paths/*.yaml` - Completion Paths for registered Backlog Items.

## Per-backlog Statement of Work

```text
backlog/sow/BL-*.yaml
```

BL-001 currently has a valid SOW at `backlog/sow/BL-001-controller-traceability.yaml`. Backlog Items whose SOW reference is null are intentionally non-executable.

## Runtime files

The Orchestrator creates runtime state under:

```text
backlog/runtime/<BL-ID>/
```

Typical runtime files are:

- `analysis.yaml`;
- `execution-plan.yaml`;
- `work-unit-status.yaml`;
- `worker-input-register.yaml`;
- `gate-status.yaml`;
- `decisions.yaml`;
- `result.yaml`.

The runtime files belong to the Orchestrator. Worker execution files stay under `worker/`.
