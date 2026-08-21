# Source-to-Artifact Synchronization Policy

## Purpose

This policy keeps the `CylinderManagement` source repository and the documentation/artifacts in this control repository synchronized.

The automation must be able to answer two questions:

1. What changed in the source repository?
2. Does that change require an artifact update or a user notification?

The source repository is:

`vvekselva/CylinderManagement`

The control and artifact repository is:

`vvekselva/CylindnderManagementDependcies`

## Main synchronization rule

Every controlled artifact must record the source commit against which it was last verified.

When the source repository changes, the synchronization process compares:

```text
Last verified source commit
           |
           v
Changes since that commit
           |
           v
Classify each change
           |
           +--> No relevant impact
           +--> Artifact needs refresh
           +--> Exposed API changed - notify user
           +--> Impact cannot be confirmed - notify for review
```

## Change classification

### Class 1 - INTERNAL_ONLY

This means source code changed inside an implementation, but the exposed API and the trace recorded in the artifact did not change.

Examples:

- variable rename;
- message text change;
- calculation changed inside a private method;
- internal refactoring where the same controller still calls the same service and reaches the same final dependency;
- comments or formatting changes.

Action:

- record the source change in the sync check;
- no user notification is required for controller API traceability;
- no controller artifact update is required if the recorded trace is still correct.

### Class 2 - TRACE_CHANGED

This means the public API did not change, but the internal dependency path recorded in the traceability artifact changed.

Example:

Before:

`Controller -> ServiceA -> RepositoryA -> tbl_trip`

After:

`Controller -> ServiceB -> RepositoryB -> tbl_trip`

The user-facing URL may be exactly the same, but the traceability artifact is now stale.

Action:

- update the affected traceability artifact;
- update the source-artifact sync register;
- record the change in the human-readable automation log;
- a normal user alert is not required unless the workflow marks this component as high-impact.

### Class 3 - EXPOSED_API_CHANGED

This means something visible to a caller changed.

Examples:

- a controller endpoint was added or removed;
- URL path changed;
- HTTP method changed, such as GET to POST;
- request body contract changed;
- response contract changed;
- important response status changed;
- authentication or authorization requirement changed;
- an exposed controller method was renamed or redirected in a way that changes the external contract.

Action:

- mark the affected artifact `OUT_OF_SYNC` immediately;
- notify the user in simple English;
- explain what API changed;
- identify which artifacts are affected;
- update those artifacts;
- verify them against the new source commit;
- mark them `IN_SYNC` only after the update is complete.

### Class 4 - COMPONENT_ADDED_OR_REMOVED

This includes a new exposed controller, removed controller, new exposed endpoint or deleted endpoint.

Action:

- notify the user;
- add or remove the component from the sync register;
- update controller and endpoint inventories;
- update consolidated traceability artifacts.

### Class 5 - IMPACT_NOT_CONFIRMED

This means the automation can see a source change but cannot safely decide whether the exposed API or the recorded trace was affected.

Action:

- do not guess;
- mark the item `REVIEW_REQUIRED`;
- explain in simple English why the impact cannot be confirmed;
- notify the user because the system cannot guarantee that the artifact is still correct.

## Important distinction: function change versus API change

A change inside a function is not automatically important to the controller API artifact.

For example:

```java
public List<Trip> findTrips() {
    // internal calculation changed here
}
```

If the endpoint, request/response contract and recorded dependency path are unchanged, this is `INTERNAL_ONLY`.

However, if the same function change causes the controller to call a different service, repository or database object, the traceability artifact has changed even though the API did not. That is `TRACE_CHANGED`.

Therefore the rule is:

```text
Internal logic changed only
        |
        +--> exposed API same
        +--> recorded trace same
        = no artifact problem

Internal logic changed
        |
        +--> exposed API same
        +--> recorded trace changed
        = refresh artifact, normally no user alert

Exposed API changed
        = notify user and refresh artifact
```

## Sync register

The machine-readable synchronization list is stored in:

`sync/source-artifact-sync-register.yaml`

Every controlled source component must eventually record:

- component ID;
- source path;
- component type;
- exposed endpoints, when applicable;
- artifact path;
- last verified source commit;
- synchronization state;
- last impact classification;
- last checked time or run ID.

## Synchronization states

Use:

- `NOT_INITIALIZED` - the artifact has not yet been built from a source baseline;
- `IN_SYNC` - the artifact was verified against the recorded source commit;
- `CHECK_REQUIRED` - newer source changes exist and have not yet been classified;
- `OUT_OF_SYNC` - the source changed in a way that requires the artifact to change;
- `REVIEW_REQUIRED` - the automation cannot safely classify the change;
- `UPDATE_IN_PROGRESS` - the artifact is being refreshed.

## Notification wording

Notifications must be understandable without reading Git diffs.

Bad:

> Mapping annotation changed in commit abc123.

Better:

> The public URL for the vehicle-trip operation changed. The traceability artifact still describes the old URL, so it is now out of sync. The affected controller and endpoint records need to be updated.

## Completion rule

A synchronization run is complete only when every changed source item has one of these outcomes:

- confirmed as `INTERNAL_ONLY` with no artifact impact;
- artifact updated and verified after a `TRACE_CHANGED` change;
- user notified and artifact updated after an `EXPOSED_API_CHANGED` change;
- user notified and item recorded as `REVIEW_REQUIRED` when impact cannot be confirmed.
