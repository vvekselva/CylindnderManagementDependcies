# BL-002 Use Case Review — Current Approval Delta 2026-09-02

[Back to Screen / Use Case Review Register](screen-usecase-register.md)

> Story approval is independent of Use Case membership. The same Story keeps its Story-level approval status wherever it is reused. Durable Story approval evidence in `BL-002/approval-evidence/` is authoritative.

> The global lookup/insertion review rule is `lookup-insertion-precheck-policy.yaml` and applies across all 134 Stories.

<a id="suc-005"></a>
## SUC-005 — Challan Book Maintenance

**Release:** R1  
**Use-case approval:** Approved

| Story | Role | Approval |
|---|---|---|
| [STORY-0012](stories/STORY-0012.md) | Primary — registration form | **APPROVED_AFTER_REWORK** |
| [STORY-0013](stories/STORY-0013.md) | Primary — save/persistence | **APPROVED_AFTER_REWORK** |

STORY-0013 still contains documented current-state development gaps, including the missing explicit duplicate Book Code pre-check. Approval of the Story does not mean those gaps are implemented.

<a id="suc-036"></a>
## SUC-036 — Domain Lookup Management

**Release:** R1  
**Use-case approval:** Partially approved

| Story | Role | Approval |
|---|---|---|
| [STORY-0108](stories/STORY-0108.md) | Primary — domain lookup screen | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0109](stories/STORY-0109.md) | Primary — Product Category save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0110](stories/STORY-0110.md) | Primary | PENDING_USER_APPROVAL |
| [STORY-0111](stories/STORY-0111.md) | Primary | PENDING_USER_APPROVAL |
| [STORY-0112](stories/STORY-0112.md) | Primary | PENDING_USER_APPROVAL |
| [STORY-0113](stories/STORY-0113.md) | Primary | PENDING_USER_APPROVAL |
| [STORY-0114](stories/STORY-0114.md) | Primary | PENDING_USER_APPROVAL |
| [STORY-0092](stories/STORY-0092.md) | Dependency — driver search | PENDING_USER_APPROVAL |
| [STORY-0098](stories/STORY-0098.md) | Dependency — product-category search | PENDING_USER_APPROVAL |
| [STORY-0099](stories/STORY-0099.md) | Dependency — product search | PENDING_USER_APPROVAL |
| [STORY-0100](stories/STORY-0100.md) | Dependency — product UOM search | PENDING_USER_APPROVAL |
| [STORY-0103](stories/STORY-0103.md) | Dependency — vehicle search | PENDING_USER_APPROVAL |

STORY-0108 and STORY-0109 are approved and their requested BL-004, BL-005 and BL-009 fan-out is recorded. Remaining mapped Stories are still pending approval.

<a id="suc-039"></a>
## SUC-039 — Lookup / Lookup Management

**Release:** R1  
**Use-case approval:** Partially approved

| Story | Role | Approval |
|---|---|---|
| [STORY-0127](stories/STORY-0127.md) | Primary — legacy lookup redirect | **APPROVED_AFTER_REWORK** |
| [STORY-0128](stories/STORY-0128.md) | Primary — lookup management screen | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0129](stories/STORY-0129.md) | Primary — Address Type save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0130](stories/STORY-0130.md) | Primary — Country save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0131](stories/STORY-0131.md) | Primary — State save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0132](stories/STORY-0132.md) | Primary — City save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0087](stories/STORY-0087.md) | Dependency — address-type search | PENDING_USER_APPROVAL |
| [STORY-0089](stories/STORY-0089.md) | Dependency — city search | PENDING_USER_APPROVAL |
| [STORY-0090](stories/STORY-0090.md) | Dependency — country search | PENDING_USER_APPROVAL |
| [STORY-0101](stories/STORY-0101.md) | Dependency — state search | PENDING_USER_APPROVAL |

STORY-0127 through STORY-0132 are approved current-state contracts. STORY-0128 through STORY-0132 have requested testing fan-out recorded. Shared search dependencies remain pending, so this Use Case remains partially approved.

### Lookup / insertion rule retained

When the user types a lookup/master-data candidate such as Address Type, database-backed matches must be shown before insertion where applicable. Submit-time service validation remains authoritative and must reject normalized business-equivalent duplicates while excluding the current row on update. The cross-story rule remains `lookup-insertion-precheck-policy.yaml`.
