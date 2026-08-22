# Automation Backlog

The Backlog is the top-level work queue for the automation framework.

Each Backlog Item has a specific Completion Path. The Orchestrator analyses the item, creates an execution plan, generates Worker Input files, schedules their execution, consumes Worker results, validates the required gates, and closes the item.

## Flow

```text
BACKLOG
  |
  v
SELECT ELIGIBLE ITEM
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
BACKLOG ITEM VERIFIED / CLOSED
```

## Static files

- `backlog.yaml` - authoritative Backlog register.
- `backlog-item-template.yaml` - standard Backlog Item shape.
- `paths/*.yaml` - Completion Paths for registered Backlog Items.

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
