# STORY-0001 — Display the login page

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `86f9d1e462553f6d69f78afef2770737931a267253ccef8d0c0d4075489cf624`  
**Matrix row:** `GET /login`  
**Controller:** `LoginController.showLoginPage`

## Story

When a caller requests `GET /login`, the request is handled by `LoginController.showLoginPage`. The accepted BL-001 trace proves a direct terminal-view flow: the controller returns the login form view. No service, DAO, database, file or external API dependency is proved for this endpoint.

No request value, normalization rule, validation rule, persistence operation, state transition or alternate branch is asserted because the accepted evidence does not prove one for this flow.

## Main flow

1. A caller sends `GET /login`.
2. `LoginController.showLoginPage` handles the request.
3. The login form view is returned.

## Data effects

None proved.

## Output and postcondition

The caller receives the login form view. No persistence-side postcondition is proved.

## Evidence

- `traceability/controller-traceability.md` — `GET /login`
- `logs/runs/INVOCATION-20260823-160000.md` / `LANE-01`

## Candidate downstream assertion

`UNIT_CANDIDATE`: `GET /login` resolves to the login form view without a proved persistence dependency.

User approval is required before this Story becomes `APPROVED`.
