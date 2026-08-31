# STORY-0013 — Challan Book Registration Submit

- Release: R1
- Endpoint: `POST /logistics/challan-books/save`
- Controller: `ChallanBookWebController`
- Controller method: `processBookIngestion(ChallanBookIngestionRequestDto requestDto)`
- Approval: NOT_APPROVED
- Business-behavior rework: IN_PROGRESS_SOURCE_DETAIL_GAP
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## User story

When an operator submits the Challan Book registration form, the application receives the `ingestionRequest`, delegates registration to `ChallanBookIngestionService`, and either redirects after successful processing or redisplays the registration page with the submitted values and an error message.

## Exact request and controller behavior

1. The active form in `final-version-1/add-challan-book.html` posts to `/logistics/challan-books/save` using model object `ingestionRequest`.
2. `ChallanBookWebController.processBookIngestion(...)` receives that object as `ChallanBookIngestionRequestDto`.
3. The controller calls `challanBookIngestionService.processRequest(requestDto)`.
4. On success, it creates a redirect `ModelAndView("redirect:/fetchCustomerByPage?pageNumber=1&itemsPerPage=10")`, adds `successMessage = "Challan Book registered successfully!"`, and exposes the ingested Challan Book as `bookDetails`.
5. On `CylinderManagementApplicationException`, it returns `final-version-1/add-challan-book`, exposes `errorMessage = "Error: " + exception.getMessage()`, restores `ingestionRequest`, and repopulates summary metrics.

## Exact submitted UI identities

Source-bound controls include:

| Visible control | Request binding / client constraint |
|---|---|
| Challan Book Type | `challanBook.bookType`; radio values `DELIVERY_CHALLAN`, `EMPTY_PICKUP_CHALLAN`, `FILLING_NOTE`, `CUSTOMER_SPOT_CYLINDER_CHECK` |
| Book Reference Code | `challanBook.bookCode`; required; maxlength 30 |
| Serial Prefix | `challanBook.seriesPrefix`; optional; maxlength 10 |
| Starting Sheet | `challanBook.startSheetNumber`; numeric; min 1; required |
| Ending Sheet | `challanBook.endSheetNumber`; numeric; min 1; required |
| Storage Location | `challanBook.currentLocation`; required |

## Service / persistence depth

The controller boundary is exact: `com.sreyas.datamatics.cylinder.management.services.ChallanBookIngestionService.processRequest(...)`.

The exact frozen implementation, validation branches, DAO/repository/entity path, tables changed, transaction semantics, duplicate/range validation and generated sheet/page persistence have not yet been bound in this rework. Those details are intentionally not invented.

Therefore STORY-0013 is **canonical-identity repaired and request/controller/template behavior is source-bound, but revised business-behavior completion remains blocked on the service/persistence trace**.

## Current gate

`SOURCE_DETAIL_REVIEW_REQUIRED`: bind `ChallanBookIngestionService` through its implementation, validation and exact database writes before user review. No automatic approval occurs.
