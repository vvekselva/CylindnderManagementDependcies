# Controller Flow Stories

This directory contains the human-readable functional Story layer produced by **BL-002** from the final validated Controller Dependency Matrix.

A Story is an evidence-backed explanation of one controller/endpoint flow. It is intended to answer, in plain English:

- what triggers the flow;
- what values/data enter the flow;
- which validations are performed and what happens when values are invalid;
- which controller, service, mediator, DAO/repository and other components are invoked;
- which data is read, persisted, updated or deleted;
- which state/audit/logistics side effects occur;
- what successful result is returned or rendered;
- what alternate/error paths exist;
- which exact matrix/source evidence proves each technical statement;
- which test assertions can later be derived from the approved Story.

## Story SSOT

`stories/story-register.yaml` is the authoritative Story register. Individual structured Stories are stored as `stories/STORY-*.yaml`; matching human-readable review documents are `stories/STORY-*.md`.

The Story schema is `stories/story-schema.yaml`. `stories/story-template.md` defines the review presentation.

## Approval lifecycle

Story states are:

`DRAFT -> TECHNICALLY_VALIDATED -> READY_FOR_USER_REVIEW -> APPROVED`

A Story may instead become `REJECTED`, `NEEDS_CLARIFICATION`, `NOT_APPLICABLE`, or `STALE_REVIEW_REQUIRED`.

Only the user may move a Story into `APPROVED`. The Primary Orchestrator may validate technical evidence but must not auto-approve the narrative. If the upstream source/matrix fingerprint changes, affected approvals become stale until reviewed again.

Only `APPROVED` Stories may be used to build approved Use Cases or become authoritative input to downstream testing.
