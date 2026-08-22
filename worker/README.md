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
```

## Meaning

- `inputs/` contains the task definition supplied to the Worker.
- `runs/` contains the human-readable `init -> service -> close` record.
- `results/` contains the evidence/result returned to the caller.

## Important rules

1. One input file represents one Worker execution request.
2. The Worker must not perform work that is not described by the input.
3. The input file becomes immutable once `init()` succeeds.
4. A changed or additional task requires a new Worker Input ID.
5. The Worker is independent of `LANE-01` through `LANE-10`.
6. The Worker does not update shared orchestration files directly.
7. Blockers are written in simple English.
8. Project-specific task logic belongs in the input file, not in the Worker component.
