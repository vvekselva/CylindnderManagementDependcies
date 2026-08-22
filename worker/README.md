# Generic Worker Workspace

This folder contains the input-driven runtime files for the independent Generic Worker.

The Worker does not know the business task in advance. It reads one input file and performs only the work defined there.

## Folder structure

```text
worker/
  worker-input-template.yaml
  inputs/
    WI-####.yaml
  runs/
    WI-####.md
  results/
    WI-####.md
    WI-####.yaml
```

## Meaning

- `inputs/` contains the task definition supplied to the Worker.
- `runs/` contains the human-readable `init -> service -> close` record.
- `results/` contains the canonical result returned to the caller.

A result may be Markdown when primarily human-consumed or YAML when another automation component/orchestrator must consume structured data.

## Machine-readable handoff

When a Worker result becomes the input to an Orchestrator Job, the Worker Input must specify:

- the YAML result path;
- the result contract/schema;
- the downstream consumer Job.

Example for the initial Controller Traceability baseline:

```text
worker/inputs/WI-0004.yaml
        |
        v
Generic Worker
        |
        +--> worker/runs/WI-0004.md
        |
        v
worker/results/WI-0004.yaml
        |
        v
Orchestrator JOB-003 Traceability Matrix
```

The Orchestrator consumes the canonical YAML result directly. It does not reconstruct machine state from the human-readable run log.

## Important rules

1. One input file represents one Worker execution request.
2. The Worker must not perform work that is not described by the input.
3. The input file becomes immutable once `init()` succeeds.
4. A changed or additional task requires a new Worker Input ID.
5. The Worker is independent of `LANE-01` through `LANE-10`.
6. The Worker does not update shared orchestration files directly.
7. Blockers are written in simple English.
8. Project-specific task logic belongs in the input file, not in the Worker component.
9. A structured result must conform to its declared result contract before the Orchestrator accepts it.
10. The Worker run must be CLOSED before its result may be consumed as final input.
