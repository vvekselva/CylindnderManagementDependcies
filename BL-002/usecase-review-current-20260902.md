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

<a id="suc-017"></a>
## SUC-017 — Customer Registration

**Release:** R1  
**Use-case approval:** Approved

Primary Stories STORY-0041 and STORY-0042 are now `APPROVED_AFTER_REWORK` with fan-out requested. Shared City/Country/State search Stories STORY-0089, STORY-0090 and STORY-0101 remain approved/fanned out. All mapped Stories for Customer Registration are now approved.

<a id="suc-019"></a>
## SUC-019 — Customer Display / Maintenance

**Release:** R1  
**Use-case approval:** Partially approved

The shared City/Country/State search Stories STORY-0089, STORY-0090 and STORY-0101 are now `APPROVED_AFTER_REWORK` with fan-out requested. Primary Stories STORY-0045, STORY-0046 and STORY-0047 remain pending.

<a id="suc-032"></a>
## SUC-032 — Supplier Ingestion

**Release:** R1  
**Use-case approval:** Approved

Primary Stories STORY-0080 and STORY-0081 are now `APPROVED_AFTER_REWORK` with fan-out requested. Shared City/Country/State search Stories STORY-0089, STORY-0090 and STORY-0101 remain approved/fanned out. All mapped Stories for Supplier Ingestion are now approved.

<a id="suc-035"></a>
## SUC-035 — Shared Screen Search / Lookup APIs

**Release:** R1  
**Use-case approval:** Partially approved

The approved shared search Stories now include STORY-0087, STORY-0089, STORY-0090, STORY-0092, STORY-0098, STORY-0099, STORY-0100, STORY-0101 and STORY-0103. STORY-0103 remains post-approval code-drift gated; the other unlisted shared search Stories remain pending user approval.

<a id="suc-036"></a>
## SUC-036 — Domain Lookup Management

**Release:** R1  
**Use-case approval:** Approved

| Story | Role | Approval |
|---|---|---|
| [STORY-0108](stories/STORY-0108.md) | Primary — domain lookup screen | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0109](stories/STORY-0109.md) | Primary — Product Category save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0110](stories/STORY-0110.md) | Primary — Product UOM save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED / DRIFT-GATED** |
| [STORY-0111](stories/STORY-0111.md) | Primary — Product save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED / DRIFT-GATED** |
| [STORY-0112](stories/STORY-0112.md) | Primary — Cylinder save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED / DRIFT-GATED** |
| [STORY-0113](stories/STORY-0113.md) | Primary — Vehicle save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED / DRIFT-GATED** |
| [STORY-0114](stories/STORY-0114.md) | Primary — Driver save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED / DRIFT-GATED** |
| [STORY-0092](stories/STORY-0092.md) | Dependency — driver search | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0098](stories/STORY-0098.md) | Dependency — product-category search | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0099](stories/STORY-0099.md) | Dependency — product search | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0100](stories/STORY-0100.md) | Dependency — product UOM search | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0103](stories/STORY-0103.md) | Dependency — vehicle search | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED / DRIFT-GATED** |

All mapped Stories are Story-approved. STORY-0110 through STORY-0114 and STORY-0103 retain separate exact-manifest code-drift approval gates; no application-code mutation is authorized by Story approval alone.

<a id="suc-039"></a>
## SUC-039 — Lookup / Lookup Management

**Release:** R1  
**Use-case approval:** Approved

| Story | Role | Approval |
|---|---|---|
| [STORY-0127](stories/STORY-0127.md) | Primary — legacy lookup redirect | **APPROVED_AFTER_REWORK** |
| [STORY-0128](stories/STORY-0128.md) | Primary — lookup management screen | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0129](stories/STORY-0129.md) | Primary — Address Type save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0130](stories/STORY-0130.md) | Primary — Country save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0131](stories/STORY-0131.md) | Primary — State save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0132](stories/STORY-0132.md) | Primary — City save | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0087](stories/STORY-0087.md) | Dependency — address-type search | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0089](stories/STORY-0089.md) | Dependency — city search | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0090](stories/STORY-0090.md) | Dependency — country search | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |
| [STORY-0101](stories/STORY-0101.md) | Dependency — state search | **APPROVED_AFTER_REWORK — FANOUT_REQUESTED** |

All primary and mapped dependency Stories are explicitly approved. Requested downstream testing/test-data fan-out is recorded for the newly approved shared search Stories.

### Lookup / insertion rule retained

When the user types a lookup/master-data candidate such as Address Type, database-backed matches must be shown before insertion where applicable. Submit-time service validation remains authoritative and must reject normalized business-equivalent duplicates while excluding the current row on update. The cross-story rule remains `lookup-insertion-precheck-policy.yaml`.
