# CylinderManagement Automation Governance Policy

## 1. Purpose

`vvekselva/CylindnderManagementDependcies` is the control repository for automation activities executed against `vvekselva/CylinderManagement`.

Automation must obtain its work definition, dependency rules, quality gates and status from this control repository. Source-code inspection may be used to perform or validate an assigned task, but it must not silently create a new task or bypass the declared workflow.

## 2. Hierarchy

The control hierarchy is:

```text
PROGRAM
  -> WORKFLOW
     -> TASK
        -> DEPENDENCIES
        -> RESOURCE LOCKS
        -> EXECUTION
        -> QUALITY GATE
        -> EVIDENCE
        -> STATUS
```

## 3. Worker Model

- One coordinator/scheduler controls execution.
- The coordinator does not consume a worker slot.
- Ten worker lanes are available.
- Maximum normal parallelism is ten tasks.
- Each lane owns at most one active task.
- Dependency and locking rules may reduce active parallelism below ten.

The authoritative worker configuration is `automation/automation-config.yaml`.

## 4. Scheduling Authority

The coordinator may schedule only tasks marked `READY`.

A task becomes `READY` only when:

1. all declared prerequisite tasks are `VERIFIED` or `CLOSED`;
2. all required dependencies are available;
3. no required quality gate is already failed;
4. the task is not blocked;
5. scheduling the task would not violate a resource lock.

A free worker lane is not sufficient reason to start a dependent task early.

## 5. Parallelism

Independent tasks should run in parallel to use available capacity.

By default, no single workflow should occupy more than four workers while other workflows have ready work. Unused global capacity may be reassigned when this does not violate safety or dependency rules.

## 6. Controlled Resources

The following operations are serialized unless a workflow defines a stricter rule:

- production database writes;
- integration/write operations against `main`;
- release/promotion operations;
- overlapping modifications to the same controlled file set.

## 7. Branch Rule

Automation changes to `vvekselva/CylinderManagement` should be created on task branches using:

```text
automation/{run_id}/{task_id}
```

Direct automation writes to `main` are not the default execution path.

## 8. Status Rule

Allowed task lifecycle states are:

```text
YET_TO_DO -> READY -> IN_PROGRESS -> VERIFIED -> CLOSED
                         |               ^
                         v               |
                       FAILED ----------+
                         |
                         v
                       BLOCKED
```

Every status transition must be supported by the task definition and evidence.

## 9. Evidence Rule

No task may be marked `VERIFIED` solely because an automation worker reports success. Objective evidence must be recorded, such as a commit SHA, build/test result, database validation, deployment check or quality-gate result.

## 10. Failure Rule

Failures must preserve evidence. Automatic retries are limited by `automation/automation-config.yaml`. Repeated or unsafe failures move the task to `BLOCKED` and require a recovery decision before dependent work can continue.

## 11. Stale Worker Rule

A stale worker does not imply task failure or success. The coordinator must check for side effects before reassigning the task.

## 12. Catalogue Rule

Every tracked control file must be listed in `repository-catalogue.md`. File additions, deletions and renames must update the catalogue in the same change. The catalogue consistency workflow is the automated quality gate for this rule.

## 13. Completion Rule

A workflow is complete only when:

- all mandatory tasks are `CLOSED`;
- all mandatory workflow gates are PASS;
- no unresolved blocker remains;
- required evidence is recorded;
- the consolidated status has been updated.
