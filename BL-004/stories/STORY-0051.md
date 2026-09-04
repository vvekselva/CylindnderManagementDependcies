# BL-004 / STORY-0051 — Add Stop Page Unit-Test Plan

Source contract: `BL-002/stories/STORY-0051.md`  
Approval: `APPROVED_AFTER_REWORK`  
Code conformance: `CODE_CONFORMANCE_VERIFIED_PASS`

## Unit scenarios
1. GET /add-stop requires vehicleLoadId and actionType.
2. Trip status is resolved from Vehicle Load -> Vehicle Trip -> Trip Status.
3. Only Returned or Proceeding permits challan-entry page rendering.
4. Any other/null status redirects to /vehicle-load/fetch with the governed error message.
5. CustomerStop loads DELIVERY_CHALLAN and EMPTY_PICKUP_CHALLAN assigned books and page windows.
6. Supplier branch loads FILLING_NOTE assigned books and page windows.
7. ChallanHeatmapFetchService failure yields empty structures plus the branch-specific error message.
8. vehicleLoadId is always available to successful branch views.
9. GET /add-stop performs no database mutation.
10. Unknown/non-CustomerStop actionType follows the current supplier-branch behavior.

## Execution
Plan created by fan-out. Runtime execution and JaCoCo coverage remain NOT_EXECUTED.
