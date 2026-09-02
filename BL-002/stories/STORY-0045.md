# STORY-0045 — Customer Display / Edit Entry

- Release: R1
- Endpoint: `GET /displayCustomer`
- Controller: `CustomerFetchController.doGet`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Traceability state: COMPLETE
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0045-customer-display-drift-review-20260902-zip.yaml`

## Business behavior and browser entry

On the Customer List, clicking a customer row navigates to `GET /displayCustomer?customerId={customerId}` using the exact persistent Customer identity from that row. The endpoint is therefore the existing-customer display/edit entry, not a new-customer creation entry.

`CustomerFetchController.doGet(...)` requires `customerId: Long`, creates `CustomerFetchByIdRequestDto`, calls `customerFetchByIdService.processRequest(...)`, and on success renders view `DisplayCustomer` with the returned `CustomerFetchByIdResponseDto` under model key `customer`.

## Exact read path

The concrete `CustomerFetchByIdService` rejects null request/ID or negative ID through governed input validation, then executes `CustomerJpaDao.findById(customerId)`. A missing row raises `DomainObjectNotFoundException`.

`CustomerJpaDao` is the Spring Data JPA repository for `CustomerDo`. `CustomerDo` maps `public.tbl_customer`, primary key `pk_customer_id`, sequence `public.pk_customer_id_serial`, and fields including `customer_name`, unique `gst_number`, and `active`.

The service maps the selected Customer through `CustomerMapper`; it also traverses the persisted customer-address and customer-phone relationship collections and maps each linked Address and Phone Number into `addressDtos` and `phoneNumberDtos`. The response therefore contains the selected customer plus its linked editable contact/address data and SUCCESS. This GET performs no database mutation.

## Current visible edit contract

The resolved root `DisplayCustomer.html` binds `th:object="${customer}"`, carries hidden `customerDto.customerId`, renders customer/GST, phone and address inputs, and posts to `POST /updateCustomer`. The page therefore functions as an existing-customer edit form, despite its current visible registration wording.

The template also references `backLink` and `addressTypes` for navigation/address-type options. The current success branch of `CustomerFetchController` adds only model `customer`; it does not source-prove those two additional attributes being populated by this controller.

When customer fetch raises `InvalidInputParameterException` or another governed `CylinderManagementApplicationException`, the controller redirects to `/fetchCustomerByPage?pageNumber=1&itemsPerPage=10` rather than rendering a broken detail page.

## Source-proved drift

The recovered ZIP confirms a material presentation/model mismatch:

1. `DisplayCustomer.html` is labelled `Register Customer` / `New Registration` even though it is opened for an existing Customer ID and submits to `/updateCustomer`.
2. The template expects `backLink` and `addressTypes`, while the current display controller success branch adds only `customer`.

The exact proposed controller/template/test correction is isolated in `BL-002/evidence/STORY-0045-customer-display-drift-review-20260902-zip.yaml`. No application-code change is authorized until the user explicitly approves that exact manifest.

## Business impact and outcome

A successful GET reads the persisted customer aggregate and presents it for maintenance using its stable Customer identity. Current registration wording can mislead an operator about whether the operation creates or edits a Customer, while missing view-model data can leave navigation/address-type choices incomplete. Those defects are documented rather than silently changed.

## Completion and approval gate

The recovered ZIP now binds the list-row browser event, request identity, controller, service/repository/entity/table reads, relationship mapping, resolved update form, error redirect and current UI/model drift. STORY-0045 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains `PENDING_USER_APPROVAL`. No application code was changed and no BL-010 work was created or executed.
