# STORY-0047 — Customer Maintenance

- Release: R1
- Endpoint: `POST /updateCustomer`
- Functional area: Customer Maintenance
- Approval: `PENDING_USER_APPROVAL`
- Review state: `READY_FOR_USER_REVIEW`
- Rework state: `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`
- Traceability state: `COMPLETE`
- Enrichment state: `BUSINESS_BEHAVIOR_COMPLETE`
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source intake evidence: `.orchestrator/source-intake/2026-09-02/Harinandhan-Cylinder-Backup-20260902-080237.yaml`
- Drift review: `.orchestrator/drift-review/STORY-0047/STORY-0047-CUSTOMER-MAINTENANCE-DRIFT-20260902.yaml`

## Human-readable story

As an authorized Cylinder Management user, I want to open an existing customer, edit the maintenance form and submit the changes so that the application validates the customer identity/details and persists the supported customer updates while preserving the existing customer identity.

## Browser entry and update form

The customer list links a selected row to `GET /displayCustomer?customerId={id}`. `CustomerFetchController.doGet(...)` binds `customerId` as `Long`, invokes the customer-fetch-by-id service and renders `DisplayCustomer` with model key `customer`.

The frozen `final-version-1/DisplayCustomer.html` is the actual maintenance form. It contains:

- `th:action="@{/updateCustomer}"`
- `th:object="${customer}"`
- `method="post"`
- hidden `customerDto.customerId`
- CSRF field when available
- editable customer, phone and address fields

This resolves the prior browser-path gap: the visible `DisplayCustomer` form submits directly to STORY-0047's exact endpoint `POST /updateCustomer`.

The same template currently displays the page title `Register Customer` and breadcrumb `New Registration` even though its form posts to `/updateCustomer`. That mismatch is recorded as code/UI drift and is not silently corrected without approval.

## Controller behavior

`CustomerUpdateController.doPost(...)` is `@PostMapping("/updateCustomer")` and binds model attribute `customer` to `CustomerUpdateRequestDto`.

On successful service completion it redirects to `/fetchCustomerByPage?pageNumber=1&itemsPerPage=10`.

Current validation-error behavior is source-proved but drift-gated: the controller tests/casts the exception DTO as `CustomerIngestionRequestDto` and returns `UC01RegisterCustomer`, although the update service/validator operate on `CustomerUpdateRequestDto` and the actual update browser form is `DisplayCustomer`.

The general `CylinderManagementApplicationException` branch currently constructs `ModelAndView(BACK_LINK)` rather than an explicit redirect. These behaviors are preserved as current-state evidence and are included in the durable review packet.

## Validation contract

`CustomerUpdateRequestValidator` requires the update request/customer identity and validates customer name, GST format, phone numbers and address/location values. Validation failures are attached to the update DTO/nested DTOs where the executable validator does so.

The validator contains update-specific inconsistencies: some structural failures use the registration service code `UC_001_RESGISTER_CUSTOMER` and some create a new empty `CustomerUpdateRequestDto` for exception evidence. These are recorded in the drift-review manifest rather than auto-fixed.

## Service and persistence behavior

`CustomerUpdateService.processRequest(...)`:

1. validates with `CustomerUpdateRequestValidator`;
2. loads the existing `CustomerDo` using `CustomerJpaDao.findById(customerId)`;
3. checks GST uniqueness when the submitted GST differs from the stored GST;
4. normalizes submitted phone numbers and rejects numbers owned by another customer;
5. rebuilds `CustomerPhoneNumberDo` relationships;
6. rebuilds `CustomerAddressDo` relationships;
7. saves the managed `CustomerDo` through `CustomerJpaDao.save(existingCustomerDo)`;
8. returns SUCCESS when processing completes.

The executable scalar mapping remains incomplete: `modelMapper.map(customerDto, existingCustomerDo)` is commented out. Therefore current code does not source-prove assignment of submitted `customerName` or `gstNumber` to the managed entity before save. This means the maintenance operation validates those values but can save phone/address relationship changes without persisting the intended scalar customer-name/GST edits.

## DAO/entity/database identity

`CustomerJpaDao` extends `JpaRepository<CustomerDo, Long>`. `CustomerDo` maps `public.tbl_customer`; its primary key is `pk_customer_id`. The entity maps `customer_name`, `gst_number`, `active` and customer phone/address relationships. No database-schema change is required for the currently identified update defects.

## Current drift requiring explicit user approval

The exact code-change manifest is stored at:

`.orchestrator/drift-review/STORY-0047/STORY-0047-CUSTOMER-MAINTENANCE-DRIFT-20260902.yaml`

It covers only:

1. update-page title/breadcrumb correction in `final-version-1/DisplayCustomer.html`;
2. update-specific validation/view/error handling in `CustomerUpdateController`;
3. explicit customerName/GST scalar assignment in `CustomerUpdateService`;
4. update-specific validation evidence/service-code cleanup in `CustomerUpdateRequestValidator`;
5. associated unit/MVC/template tests.

No application mutation is authorized until the user explicitly approves that exact manifest. Any scope expansion requires a new approval.

## Completion and approval gate

The exact browser entry, update form action, hidden customer identity, controller/service/validator path, persistence operations, current partial-update behavior, visible navigation behavior and identified code/UI drift are now source-bound.

STORY-0047 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW` with `DRIFT_REVIEW_REQUIRED` for the proposed implementation changes.

No Story approval was inferred. No application code was changed. No BL-010 development task was created or executed.
