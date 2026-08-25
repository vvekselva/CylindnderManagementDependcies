# STORY-0035 — View the customer-demand dashboard

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `806fdc490be60e31f7abddf4ffb12d06c3698ea7789f71db7ec04a2a099af029`  
**Matrix row:** `GET /customer-demands`

## Purpose
Display the source-proved customer-demand dashboard using demand dashboard/daily metrics plus customer, address and product data.

## Trigger and inputs
A caller opens `GET /customer-demands`. Filtering/query inputs are not enumerated in the accepted evidence, so required parameters/defaults are not invented.

## Main flow
1. `CustomerDemandController.dashboard` receives the request.
2. `CustomerDemandService.fetchPage` and `fetchMetrics` execute.
3. The service reads the demand dashboard/daily metrics views and related customer/address/product data.
4. The controller renders `final-version-1/CustomerDemandDashboard`.

## Data effects
This flow reads the proved metrics and related customer/address/product data. No persistence write is asserted.

## Alternate/error flows
No caller-input validation or alternate/error behavior is explicitly proved in the accepted checkpoint.

## Output/postconditions
The customer-demand dashboard view is rendered from the source-proved reads.

## Evidence
- `traceability/controller-traceability.md` — `GET /customer-demands`
- `logs/runs/PRODUCTION-FIRE-20260824-181810.md`

## Downstream test assertion
Integration: the endpoint must read the proved metrics and related data and render the demand dashboard.

## Approval
Pending explicit user approval for the exact fingerprint above.
