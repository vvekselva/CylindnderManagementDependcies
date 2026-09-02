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
| [STORY-0012](stories/STORY-0012.md) | Primary — registration form | **Approved** |
| [STORY-0013](stories/STORY-0013.md) | Primary — save/persistence | **Approved** |

STORY-0013 still contains documented current-state development gaps, including the missing explicit duplicate Book Code pre-check. Approval of the Story does not mean those gaps are implemented.

<a id="suc-039"></a>
## SUC-039 — Lookup / Lookup Management

**Release:** R1  
**Use-case approval:** Partially approved

| Story | Role | Approval |
|---|---|---|
| [STORY-0127](stories/STORY-0127.md) | Primary — legacy lookup redirect | **Approved** |
| [STORY-0128](stories/STORY-0128.md) | Primary | Pending user approval |
| [STORY-0129](stories/STORY-0129.md) | Primary — Address Type save | **Pending user approval — requirement revised** |
| [STORY-0130](stories/STORY-0130.md) | Primary | Pending user approval |
| [STORY-0131](stories/STORY-0131.md) | Primary | Pending user approval |
| [STORY-0132](stories/STORY-0132.md) | Primary | Pending user approval |

### STORY-0129 review requirement

When the user types an Address Type, database-backed matching Address Types must be searched and displayed before insertion so the operator can see that a value already exists. STORY-0087 is the existing governed Address Type search Story. Submit-time service validation must still perform the authoritative duplicate pre-check, and update must exclude the current record identity.

This same review rule is mandatory for every applicable lookup/master-data maintenance and insert/update Story under `lookup-insertion-precheck-policy.yaml`.
