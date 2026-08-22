# Source Analysis Worker Workspace

This directory belongs to the independent Source Analysis Worker defined by `automation/source-analysis-worker-contract.md`.

The Source Analysis Worker is a read-only analysis service. It is not one of the ten orchestration worker lanes.

## What it does

It accepts a source-analysis request tied to one exact `CylinderManagement` commit and returns source facts with evidence.

Typical questions include:

- Which Spring components expose HTTP requests?
- Which endpoint mappings are present in this controller?
- Which method is called next by this handler?
- Which service/repository/entity is reached?
- Which physical table, view or function is proved by the source?
- Where does a trace stop when the next dependency cannot be proved?

## What it does not do

It does not schedule workflows, choose priorities, update global TaskStatus, change source code, choose architectural alternatives or decide whether the user should be notified.

## Lifecycle

Every source-analysis request uses:

```text
init()
  -> validate request and baseline
  -> state what source will be analysed
  -> open Source Analysis run record

service()
  -> read and analyse source
  -> return PROVED / UNRESOLVED facts with evidence

close()
  -> summarize result in simple English
  -> record unresolved facts and next analysis step
  -> close Source Analysis run record
```

## Runtime outputs

Runtime records are generated under controlled dynamic paths:

```text
source-analysis/runs/SAR-*.md
source-analysis/results/SAR-*.md
```

A run record explains what the Source Analysis Worker did.

A result file contains the source facts returned to the orchestration layer.

The coordinator or orchestration worker consumes those facts and decides how they affect a Workflow artifact.
