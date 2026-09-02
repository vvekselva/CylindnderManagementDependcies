# STORY-0117 — Customer Density Bubble Map

- Release: R2
- Endpoint: `GET /delivery-planning/customer-density-bubble-map`
- Controller: `DeliveryPlanningController.showCustomerDensityBubbleMap`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0117-local-source-business-behavior-20260902-1652.yaml`

The parameterless GET returns `with-menu/CustomerDensityBubbleMap`. The controller performs no DTO mapping, DAO/service call, validation, branch, persistence mutation or model population for this endpoint. Its applicable server contract is navigation/rendering of the bubble-map screen; data APIs used by that screen are separate governed stories.

The recovered governed ZIP independently confirms this exact navigation-only handler and absence of server-side mutation. STORY-0117 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
