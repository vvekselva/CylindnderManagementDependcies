# BL-010 — Development Changes / Story Implementation

## Purpose
BL-010 is the governed application-development backlog for changes discovered or requested while BL-002 Stories are being reworked and reviewed.

BL-002 owns the human-readable business contract and explicit user approval state. BL-010 owns implementation work required to make application code/UI conform to the requested Story behavior. BL-004, BL-005 and BL-009 remain testing/validation fan-out backlogs and do not substitute for development implementation.

## Lifecycle

`BL-002 requirement/rework -> BL-010 development change -> BL-002 source/readback reconciliation -> explicit user approval/reapproval -> BL-004 unit + BL-005 integration + BL-009 test-data/runtime fan-out -> JaCoCo/acceptance`

A user-requested development correction may be implemented in BL-010 while its BL-002 Story remains NOT_APPROVED. Implementation does not imply Story approval. Revised testing fan-out remains blocked until explicit user approval/reapproval.

## Development-change gate
Every BL-010 item must record:
- source Story ID and release;
- user-required target behavior;
- current-state defect/gap;
- exact application source files/components once source-bound;
- reusable service/API/pattern to be reused;
- frontend behavior and selected-ID propagation;
- backend validation/relationship guards;
- implementation state;
- source commit/branch/evidence after implementation;
- BL-002 reconciliation state;
- explicit approval state;
- downstream fan-out eligibility.

## Reference-selector rule
For Customer, Product, Supplier, Vehicle, Driver, Address and other large reference datasets, prefer an existing application search REST service/pattern over a large static list box when an established reusable pattern exists. Do not invent duplicate endpoints when an existing service can be reused. Dependent selectors must clear stale child selections when the parent changes and server-side relationship validation must remain enforced.

## First governed item
`DEV-0001 / STORY-0054` — Customer Demand selector UX rework:
- Customer static list -> searchable Customer selector reusing the Walk-in Sale customer-search pattern/service;
- selected Customer -> populate only that Customer's addresses;
- Customer change/clear -> clear Address options and selected Address;
- Product static list -> searchable Product selector reusing the established Product search pattern/service;
- preserve selected Customer/Product IDs in the create-demand request;
- preserve server-side customer/address ownership validation;
- bind exact REST endpoints, parameters, debounce/minimum-length and result mapping from authoritative application source before implementation is declared complete.

## Approval rule
No BL-010 completion auto-approves a BL-002 Story. No revised BL-004/BL-005/BL-009 fan-out is final until explicit user approval/reapproval of the reconciled Story.
