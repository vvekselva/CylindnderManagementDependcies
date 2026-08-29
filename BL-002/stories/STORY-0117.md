# STORY-0117 — Customer Density Bubble Map

- Release: R2
- Endpoint: `GET /delivery-planning/customer-density-bubble-map`
- Controller: `DeliveryPlanningController.showCustomerDensityBubbleMap`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The exact frozen GET is parameterless and returns `with-menu/CustomerDensityBubbleMap`. The controller performs no DTO mapping, DAO/service call, validation, branch, persistence mutation, or model population for this endpoint. Its applicable server contract is therefore navigation/rendering of the bubble-map screen; data APIs used by that screen are separate stories and are not invented into this handler. No approval occurred.
