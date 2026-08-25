# STORY-0037 — Mark a customer demand as delivered

**State:** READY_FOR_USER_REVIEW  
**Fingerprint:** `9f60a7283c6d6e2b94164525720500a5919f2864ccb49544d48bd6ba29e32b2a`  
**Matrix row:** `POST /customer-demands/{requestId}/mark-delivered`

A caller submits the endpoint with `requestId`. `CustomerDemandController.markDelivered` calls `CustomerDemandService.markDelivered`, which reaches `CustomerDemandJpaDao` / `CustomerDemandDo` and updates `public.tbl_customer_order_request`, then redirects. The accepted trace proves the identified row is used but does not enumerate missing-ID error text or status behavior, so those details remain unspecified.

**Data effect:** read and update the identified demand/order-request row.  
**Postcondition:** the request is in the source-proved delivered state and the proved redirect is returned.

**Evidence:** `traceability/controller-traceability.md`; `logs/runs/PRODUCTION-FIRE-20260824-181810.md`.

**Test assertion:** integration must verify the identified row is updated and the redirect occurs.

Pending explicit user approval for the exact fingerprint above.
