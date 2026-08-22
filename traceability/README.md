# Controller Traceability Artifacts

This folder contains the controlled outputs of `WF-001-controller-traceability`.

The purpose is to answer, for every exposed endpoint:

> When this URL is called, which controller receives it, which application components are called next, and what final database, external service, file, cache, module or other dependency is reached?

## Initial baseline input

For the first trusted baseline, source inspection is completed before the Traceability Matrix Job begins.

The Generic Worker produces the canonical machine-readable Source Check Output:

```text
worker/results/WI-0004.yaml
```

That YAML file is the formal `SOURCE_CHECK_OUTPUT` input consumed by `JOB-003 Complete Traceability Matrix`.

Its schema/acceptance contract is:

```text
workflows/WF-001-controller-traceability/source-check-output-contract.yaml
```

The Traceability Orchestrator does not re-read the CylinderManagement source repository during the initial matrix build. It organizes the accepted Source Check Output into controlled artifacts.

## Expected artifacts

`JOB-003` creates:

- `source-repository-check.md` - human-readable representation of the accepted canonical Source Check Output;
- `controller-inventory.md` - list of exposed controllers with stable `CTL-###` IDs;
- `endpoint-inventory.md` - list of exposed endpoints with stable Endpoint IDs;
- `controller-traceability.md` - consolidated endpoint-to-dependency Traceability Matrix;
- `unresolved-traceability.md` - endpoints whose final dependency remains unresolved;
- `controllers/CTL-*.md` - optional/detailed per-controller trace artifacts when required by the workflow.

## Data lineage

Every initial matrix conclusion must be traceable through this chain:

```text
Traceability Matrix row
        |
        v
Endpoint / Controller inventory entry
        |
        v
SOURCE_CHECK_OUTPUT endpoint/component
        |
        v
Evidence ID
        |
        v
CylinderManagement source at frozen commit
```

The Orchestrator adds stable IDs and artifact organization but does not change the source conclusions returned by the Worker.

## Important source rule

The Worker follows the source as it really exists. It does not assume that every path contains a mediator, service or repository.

Valid paths may include:

```text
Controller -> Service -> Repository -> Database
```

```text
Controller -> Mediator -> Handler -> Service -> Repository -> Database
```

```text
Controller -> Service -> External API
```

The trace continues until the final dependency can be proved or the last provable source point is reached.

If the final dependency cannot be proved, the Worker records the last proven component, explains what is missing in simple English and marks the endpoint unresolved instead of guessing. The Orchestrator must preserve that unresolved state.

## Coverage

The initial Source Check Output must have 100% trace coverage across the complete exposed endpoint set before `JOB-003` becomes READY.

The Matrix must then contain exactly one row for every endpoint in the accepted Source Check Output.

Coverage and resolution are separate: the Matrix may contain explicit `UNRESOLVED` rows while still having 100% coverage.

## Synchronization

After the initial Traceability Matrix is verified, its artifacts are registered in `sync/source-artifact-sync-register.yaml` against the frozen CylinderManagement source commit.

Later source changes are handled by `WF-002-source-artifact-sync` and may use targeted Worker Inputs because a trusted baseline already exists.
