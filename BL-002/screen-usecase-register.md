# BL-002 Screen / Use Case Review Register

> Human-readable projection of `screen-usecase-register.csv`. Approval state is derived from durable Story approval evidence and must not override unit-local evidence.

**Story disposition:** 58 approved, 70 awaiting user approval, 6 superseded/not needed.

**Use Case disposition:** 10 approved, 7 partially approved, 21 pending user approval, 2 superseded/not needed.

**Supersession rule:** STORY-0037 and STORY-0038 are `SUPERSEDED_NOT_NEEDED` because the legacy Cylinder Delivery controller was replaced by the Add Stop customer-delivery flow (STORY-0051 + STORY-0085). STORY-0039, STORY-0040, STORY-0133 and STORY-0134 are also `SUPERSEDED_NOT_NEEDED`; SUC-018 is the canonical combined Vehicle Trip + Load workflow.

| Use Case | Release | Approval |
|---|---|---|
| [SUC-001 — Login](usecase-review.md#suc-001) | R1 | **Approved** |
| [SUC-002 — Offline Map](usecase-review.md#suc-002) | R2 | Pending user approval |
| [SUC-003 — Predefined Delivery Trips](usecase-review.md#suc-003) | R2 | Pending user approval |
| [SUC-004 — Complete Trip](usecase-review.md#suc-004) | R1 | **Approved — fan-out requested / conformance pending** |
| [SUC-005 — Challan Book Maintenance](usecase-review-current-20260902.md#suc-005) | R1 | **Approved** |
| [SUC-006 — Challan Monitoring / Heatmap / Photo](usecase-review.md#suc-006) | R1 | **Approved — fan-out requested / conformance pending** |
| [SUC-007 — Customer Address / Planning Map](usecase-review.md#suc-007) | R2 | Pending user approval |
| [SUC-008 — Yard Location Upload / Map](usecase-review.md#suc-008) | R2 | Pending user approval |
| [SUC-009 — Customer Address Upload / WhatsApp Import](usecase-review.md#suc-009) | R2 | Pending user approval |
| [SUC-010 — Customer Consumption Dashboard](usecase-review.md#suc-010) | R2 | Pending user approval |
| [SUC-011 — Ownership Obligation Dashboard](usecase-review.md#suc-011) | R1 | **Approved** |
| [SUC-012 — Walk-in Sale](usecases/SUC-012.md) | R1 | **Approved** |
| [SUC-013 — Customer Spot Cylinder Check](usecase-review.md#suc-013) | R2 | Pending user approval |
| [SUC-014 — Yard Audit Dashboard](usecase-review.md#suc-014) | R1 | Pending user approval |
| [SUC-015 — Cylinder Delivery — SUPERSEDED](usecases/SUC-015.md) | R1 | **SUPERSEDED_NOT_NEEDED — replaced by Add Stop / Delivery Stop (SUC-020 + SUC-034)** |
| [SUC-016 — Vehicle Load](usecases/SUC-016.md) | R1 | **Superseded by SUC-018** |
| [SUC-017 — Customer Registration](usecases/SUC-017.md) | R1 | **Approved** |
| [SUC-018 — Vehicle Trip Load Wizard](usecases/SUC-018.md) | R1 | **Approved** |
| [SUC-019 — Customer Display / Maintenance](usecases/SUC-019.md) | R1 | **Approved — fan-out requested / conformance pending** |
| [SUC-020 — Add Stop / Challan Photo](usecases/SUC-020.md) | R1 | Partially approved |
| [SUC-021 — Trip Return](usecase-review.md#suc-021) | R1 | Partially approved |
| [SUC-022 — Customer Demands](usecase-review.md#suc-022) | R1 | Pending user approval |
| [SUC-023 — Trip Review](usecase-review.md#suc-023) | R1 | Pending user approval |
| [SUC-024 — Supplier Lookup / List Support](usecase-review.md#suc-024) | R1 | Pending user approval |
| [SUC-025 — Vehicle Loads Listing](usecases/SUC-025.md) | R1 | Partially approved |
| [SUC-026 — Vehicle Trips Listing](usecase-review.md#suc-026) | R1 | Pending user approval |
| [SUC-027 — Party Custody Traceability](usecase-review.md#suc-027) | R1 | Pending user approval |
| [SUC-028 — Reconciliation Command Center](usecase-review.md#suc-028) | R2 | Pending user approval |
| [SUC-029 — Ownership Dashboard](usecase-review.md#suc-029) | MIXED_R1_R2 | Pending user approval |
| [SUC-030 — Delivery Planning Maps / Stops](usecase-review.md#suc-030) | R2 | Pending user approval |
| [SUC-031 — Customer Activation / Deactivation](usecase-review.md#suc-031) | R1 | Pending user approval |
| [SUC-032 — Supplier Ingestion](usecases/SUC-032.md) | R1 | **Approved** |
| [SUC-033 — Yard Stock Check](usecases/SUC-033.md) | R1 | Partially approved |
| [SUC-034 — Delivery Stop Submission](usecase-review.md#suc-034) | R1 | **Approved** |
| [SUC-035 — Shared Screen Search / Lookup APIs](usecase-review.md#suc-035) | R1 | Partially approved |
| [SUC-036 — Domain Lookup Management](usecases/SUC-036.md) | R1 | **Approved** |
| [SUC-037 — Delivery Planning Main Screens](usecase-review.md#suc-037) | R2 | Pending user approval |
| [SUC-038 — Reconciliation Dashboard](usecase-review.md#suc-038) | R2 | Pending user approval |
| [SUC-039 — Lookup / Lookup Management](usecases/SUC-039.md) | R1 | **Approved** |
| [SUC-040 — Add Vehicle Trip](usecases/SUC-040.md) | R1 | **Superseded by SUC-018** |
