# Use Cases

Use Cases are the higher-level functional units created by **BL-002** from one or more **user-approved Controller Flow Stories**.

A Use Case is not created directly from class names. It must preserve the approved Story evidence and explain a coherent end-to-end goal, including preconditions, trigger, main flow, alternate/error flows, postconditions and data effects.

## Use Case SSOT

- `usecases/usecase-register.yaml` - authoritative Use Case register.
- `usecases/usecase-schema.yaml` - structured Use Case contract.
- `usecases/UC-*.yaml` - structured Use Case artifacts.
- `usecases/UC-*.md` - human-readable Use Case review artifacts.
- `usecases/usecase-test-scenarios.yaml` - authoritative scenario handoff to downstream testing.
- `usecases/usecase-test-scenario-schema.yaml` - scenario contract.

## Composition rule

One or more `APPROVED` Stories may be combined into a candidate Use Case. Only the user may approve a Use Case as `APPROVED_FOR_TESTING`.

If a Story changes or its approval becomes stale, any Use Case depending on that Story must also become `STALE_REVIEW_REQUIRED` until reconciled and re-approved.

## Downstream testing

- **BL-003 Unit Test Completion** consumes approved Story-level rules/assertions and the Controller Flow Traceability evidence.
- **BL-004 Integration Test Completion** consumes `APPROVED_FOR_TESTING` Use Cases and their test scenarios. BL-004 is responsible for executing Use Case tests across the required controller/service/repository/database boundaries.

No unapproved or stale Story/Use Case may unlock downstream testing.
