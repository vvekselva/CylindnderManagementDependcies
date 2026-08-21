# Controller Traceability Artifacts

This folder will contain the output of `WF-001-controller-traceability`.

The purpose is to answer a simple question for every exposed endpoint:

> When this URL is called, which controller receives it, which application components are called next, and what final database, external service, file, module or other dependency is reached?

## Expected artifacts

The workflow will create:

- `controller-inventory.md` - list of exposed controllers;
- `endpoint-inventory.md` - list of exposed endpoints and their controller methods;
- `controller-traceability.md` - consolidated endpoint-to-dependency trace;
- `unresolved-traceability.md` - items that could not yet be fully proved;
- `controllers/CTL-*.md` - detailed trace for each controller.

## Important rule

The automation follows the source as it really exists.

It does not assume that every path contains a mediator, service or repository.

Valid paths may look different:

```text
Controller -> Service -> Repository -> Database
```

or:

```text
Controller -> Mediator -> Handler -> Service -> Repository -> Database
```

or:

```text
Controller -> Service -> External API
```

The trace continues until the final dependency can be proved.

If the automation cannot prove the final dependency, it records the last proven component, explains what is missing in simple English, and marks the path unresolved instead of guessing.

## Synchronization

After the initial traceability workflow finishes, every controller artifact will be registered in `sync/source-artifact-sync-register.yaml` with the CylinderManagement source commit against which it was verified.

Later source changes will be classified using `governance/source-artifact-sync-policy.md` so the automation can decide whether the artifact remains correct, needs a quiet refresh, or requires a user notification.
