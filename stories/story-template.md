# STORY-#### - <Plain-English Story Title>

**State:** DRAFT  
**Source baseline:** `<frozen commit>`  
**Matrix row:** `<HTTP METHOD> <PATH>`  
**Controller:** `<Controller.method>`

## 1. Business purpose

Explain in simple English what this flow accomplishes. If the business purpose is not proved, state the technical outcome and mark the missing interpretation under Clarifications.

## 2. Trigger and context

Describe who/what invokes the flow and under which preconditions, but only when proved by source or approved project context.

## 3. Inputs

For each material input, describe:

- source: form/body/path/query/session/default/cache/etc.;
- name and type;
- required/optional status when proved;
- normalization/defaulting;
- where the value is passed next.

## 4. Validations

Describe each actual validation in execution order:

1. what value is checked;
2. the condition that makes it valid/invalid;
3. what happens when it is invalid;
4. whether processing stops or follows another branch.

Do not invent a validation from naming conventions or database constraints.

## 5. Main flow

Write the successful path as numbered plain-English steps from controller entry to the final result.

## 6. Component flow

Preserve the source-proved chain, for example:

`Controller.method -> Service.method -> Repository.method -> Entity/Table -> Database`

If there are branches, list each ordered branch separately.

## 7. Data reads and writes

List each proved data operation with READ/INSERT/UPDATE/DELETE/UPSERT, the repository/DAO method and the final table/view/file/API where known.

## 8. Side effects and state changes

Explain proved state transitions, audit records, cache changes, logistics events, generated files, external calls or other effects.

## 9. Alternate and error flows

Explain validation failures, alternate branches, exceptions, fallback behaviour, redirects and error responses.

## 10. Output and postconditions

Describe what the caller receives and what proved application/database state exists after success or failure.

## 11. Evidence

Reference the BL-001 matrix row and the durable source/evidence used for each technical claim.

## 12. Downstream test assertions

List candidate test assertions and classify each as:

- `UNIT_CANDIDATE`;
- `INTEGRATION_REQUIRED`;
- `BOTH`.

## 13. Clarifications

List any business meaning or expected behaviour that cannot be proved and therefore needs user clarification.

## 14. Approval

The Primary Orchestrator may mark the Story technically validated, but only the user may approve it for Use Case composition and downstream testing.
