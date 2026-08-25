# STORY-0036 — Create a customer demand request

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `dc183a0c02e57f4d17af6e3ae698e47032251fece58d22238ec2248b0c580bd3`  
**Matrix row:** `POST /customer-demands`

## Purpose
Create a customer demand/order-request record after the source-proved customer, product and address validation reads, then redirect.

## Trigger and inputs
A caller submits `POST /customer-demands`. Customer/product/address values are consumed by `CustomerDemandService.create`; exact field names, normalization and defaults are not enumerated by accepted evidence.

## Validations
The accepted trace proves customer, product and address lookup/validation reads. Exact invalid-value messages are not asserted.

## Main flow
1. `CustomerDemandController.create` receives the request.
2. `CustomerDemandService.create` performs the proved validation reads.
3. `CustomerDemandJpaDao.save` persists `CustomerDemandDo` to `public.tbl_customer_order_request`.
4. The controller follows the proved redirect path.

## Data effects
Reads customer/product/address data and inserts the demand/order-request row.

## Alternate/error flows
Unproved invalid-value response messages and exact error terminal behavior remain unspecified.

## Output/postconditions
On success, a demand row exists in `public.tbl_customer_order_request` and the caller follows the proved redirect.

## Evidence
- `traceability/controller-traceability.md` — `POST /customer-demands`
- `logs/runs/PRODUCTION-FIRE-20260824-181810.md`

## Downstream test assertions
- Unit/integration: the proved customer/product/address validation reads occur before successful persistence.
- Integration: valid input persists the demand row and follows the proved redirect path.

## Approval
Pending explicit user approval for the exact fingerprint above.
