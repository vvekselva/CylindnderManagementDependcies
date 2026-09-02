# BL-002 Screen / Use Case Review Register

> Human-readable review entry point. The CSV remains the machine-readable register. Select a Use Case to review all mapped Stories and their approval status.

**Approval source:** Story-level durable approval evidence in `BL-002/approval-evidence/` and the corresponding Story documents. Aggregate projections such as `enrichment-progress.yaml` may lag unit-local evidence and must be reconciled rather than overriding explicit Story approval evidence.

**Cross-story lookup/insertion review rule:** `BL-002/lookup-insertion-precheck-policy.yaml` applies to all 134 Stories. Applicable lookup/master-data entry must expose database-backed search while typing, and applicable insert/update operations must perform a service-level duplicate pre-check before persistence.

**Latest approval/rework delta:** [Current Use Case Review — 2026-09-02](usecase-review-current-20260902.md)

| Use Case | Release | Approval |
|---|---|---|
| [SUC-001 — Login](usecase-review.md#suc-001) | R1 | Approved |
| [SUC-002 — Offline Map](usecase-review.md#suc-002) | R2 | Pending user approval |
| [SUC-003 — Predefined Delivery Trips](usecase-review.md#suc-003) | R2 | Pending user approval |
| [SUC-004 — Complete Trip](usecase-review.md#suc-004) | R1 | Pending user approval |
| [SUC-005 — Challan Book Maintenance](usecase-review-current-20260902.md#suc-005) | R1 | Approved |
| [SUC-006 — Challan Monitoring / Heatmap / Photo](usecase-review.md#suc-006) | R1 | Pending user approval |
| [SUC-007 — Customer Address / Planning Map](usecase-review.md#suc-007) | R2 | Pending user approval |
| [SUC-008 — Yard Location Upload / Map](usecase-review.md#suc-008) | R2 | Pending user approval |
| [SUC-009 — Customer Address Upload / WhatsApp Import](usecase-review.md#suc-009) | R2 | Pending user approval |
| [SUC-010 — Customer Consumption Dashboard](usecase-review.md#suc-010) | R2 | Pending user approval |
| [SUC-011 — Ownership Obligation Dashboard](usecase-review.md#suc-011) | R1 | Pending user approval |
| [SUC-012 — Walk-in Sale](usecase-review.md#suc-012) | R1 | Pending user approval |
| [SUC-013 — Customer Spot Cylinder Check](usecase-review.md#suc-013) | R2 | Pending user approval |
| [SUC-014 — Yard Audit Dashboard](usecase-review.md#suc-014) | R1 | Pending user approval |
| [SUC-015 — Cylinder Delivery](usecase-review.md#suc-015) | R1 | Pending user approval |
| [SUC-016 — Vehicle Load](usecase-review.md#suc-016) | R1 | Pending user approval |
| [SUC-017 — Customer Registration](usecase-review.md#suc-017) | R1 | Pending user approval |
| [SUC-018 — Vehicle Trip Load Wizard](usecase-review.md#suc-018) | R1 | Pending user approval |
| [SUC-019 — Customer Display / Maintenance](usecase-review.md#suc-019) | R1 | Pending user approval |
| [SUC-020 — Add Stop / Challan Photo](usecase-review.md#suc-020) | R1 | Pending user approval |
| [SUC-021 — Trip Return](usecase-review.md#suc-021) | R1 | Pending user approval |
| [SUC-022 — Customer Demands](usecase-review.md#suc-022) | R1 | Pending user approval |
| [SUC-023 — Trip Review](usecase-review.md#suc-023) | R1 | Pending user approval |
| [SUC-024 — Supplier Lookup / List Support](usecase-review.md#suc-024) | R1 | Pending user approval |
| [SUC-025 — Vehicle Loads Listing](usecase-review.md#suc-025) | R1 | Pending user approval |
| [SUC-026 — Vehicle Trips Listing](usecase-review.md#suc-026) | R1 | Pending user approval |
| [SUC-027 — Party Custody Traceability](usecase-review.md#suc-027) | R1 | Pending user approval |
| [SUC-028 — Reconciliation Command Center](usecase-review.md#suc-028) | R2 | Pending user approval |
| [SUC-029 — Ownership Dashboard](usecase-review.md#suc-029) | MIXED_R1_R2 | Pending user approval |
| [SUC-030 — Delivery Planning Maps / Stops](usecase-review.md#suc-030) | R2 | Pending user approval |
| [SUC-031 — Customer Activation / Deactivation](usecase-review.md#suc-031) | R1 | Pending user approval |
| [SUC-032 — Supplier Ingestion](usecase-review.md#suc-032) | R1 | Pending user approval |
| [SUC-033 — Yard Stock Check](usecase-review.md#suc-033) | R1 | Pending user approval |
| [SUC-034 — Delivery Stop Submission](usecase-review.md#suc-034) | R1 | Pending user approval |
| [SUC-035 — Shared Screen Search / Lookup APIs](usecase-review.md#suc-035) | R1 | Pending user approval |
| [SUC-036 — Domain Lookup Management](usecase-review.md#suc-036) | R1 | Pending user approval |
| [SUC-037 — Delivery Planning Main Screens](usecase-review.md#suc-037) | R2 | Pending user approval |
| [SUC-038 — Reconciliation Dashboard](usecase-review.md#suc-038) | R2 | Pending user approval |
| [SUC-039 — Lookup / Lookup Management](usecase-review-current-20260902.md#suc-039) | R1 | Partially approved |
| [SUC-040 — Add Vehicle Trip](usecase-review.md#suc-040) | R1 | Pending user approval |
