# STORY-0033 — Submit Walk-in Sale

- Release: R1
- Endpoint: `POST /walkin-sale`
- Controller: `WalkinSaleIngestionController.doPost`
- Approval: PENDING_USER_APPROVAL
- Business-behavior state: REWORK_REQUIRED_SOURCE_BINDING
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Canonical identity repair

The physical Story previously contained stale, incorrect Product UOM identity. The canonical BL-002 register proves STORY-0033 is R1 `POST /walkin-sale`. This artifact is repaired to the canonical endpoint and frozen controller.

## User action and exact request contract proved

The Walk-in Sale page submits `POST /walkin-sale` with model attribute `walkinSale` bound to `WalkinSaleRequestDto`. The request DTO contains:

- `List<Long> fullCylinderIdForDelivery`;
- `List<Long> emptyCylinderIdForYard`;
- `CustomerDto customer`;
- `CustomerAddressDto customerAddress`;
- `ChallanLeafDto challanLeaf`.

The frozen template supplies exact identities for `customer.customerId`, `customerAddress.customerAddressId`, `challanLeaf.challanType`, `challanLeaf.challanNumber`, `fullCylinderIdForDelivery`, and `emptyCylinderIdForYard`.

## Controller behavior proved

`WalkinSaleIngestionController.doPost()` calls `walkinSaleService.processRequest(requestDto)`.

On success, it logs successful processing and returns a redirect to the governed home/back link.

When `InvalidInputParameterException` is thrown, the controller:

- uses the exception-carried `WalkinSaleRequestDto` when available;
- redisplays `final-version-1/WalkinSaleIngestion`;
- preserves `walkinSale` and `backLink` in the model; and
- shows `Walk-in sale validation failed. Please correct the highlighted details.`

When another `CylinderManagementApplicationException` is thrown, it redisplays the same view, preserves the submitted request/back link, and shows `Walk-in sale could not be processed. Please verify the challan and cylinder selection.`

## Exact remaining source-binding gap

The controller injects the generic interface `ICylinderManagementApplicationService<WalkinSaleRequestDto, WalkinSaleResponseDto>` as `walkinSaleService`. The exact concrete bean implementing this generic service for Walk-in Sale, and therefore its server-side guards, transaction boundary, DAO/repository calls, state transitions and exact database writes, have not yet been proven from the frozen source in this work unit.

The Story therefore remains fail-closed and **must not claim business-behavior completion** until the concrete service implementation and persistence chain are bound exactly.

## Review/approval gate

No approval occurred. The next worker must bind the concrete Walk-in Sale service implementation from the same frozen commit, then trace validation, transaction and persistence effects before this Story can advance to user review.
