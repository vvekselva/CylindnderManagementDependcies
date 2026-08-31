# STORY-0013 — Challan Book Registration Submit

- Release: R1
- Endpoint: `POST /logistics/challan-books/save`
- Controller: `ChallanBookWebController`
- Controller method: `processBookIngestion(ChallanBookIngestionRequestDto requestDto)`
- Approval: NOT_APPROVED
- Business-behavior rework: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Business purpose

This operation lets an operator register a physical Challan Book that the business will use for delivery, empty-pickup, supplier filling-note, or customer spot-check paperwork. The registered book becomes a durable Challan Book registry record that later logistics processes can identify and allocate.

The form is rendered by STORY-0012. This Story owns the submit/persistence operation only.

## What the operator enters

| Visible control | Request field | Business meaning / current constraint |
|---|---|---|
| Challan Book Type | `challanBook.bookType` | Classifies the business document as `DELIVERY_CHALLAN`, `EMPTY_PICKUP_CHALLAN`, `FILLING_NOTE`, or `CUSTOMER_SPOT_CYLINDER_CHECK`. Required by the form/entity. |
| Book Reference Code | `challanBook.bookCode` | Unique business identifier for the physical book. Form requires it and limits it to 30 characters; database column is non-null and unique, length 30. |
| Serial Prefix | `challanBook.seriesPrefix` | Optional prefix used with the book's sheet numbering. Maximum 10 characters. |
| Starting Sheet | `challanBook.startSheetNumber` | First sheet number represented by the book. Numeric, minimum 1 in the UI, required. |
| Ending Sheet | `challanBook.endSheetNumber` | Last sheet number represented by the book. Numeric, minimum 1 in the UI, required. |
| Storage Location | `challanBook.currentLocation` | Where the book is currently held. Required. The entity default is `IN_OFFICE` when not otherwise set. |

These controls are bounded values/text/numbers rather than large master-data reference selectors. Selector UX review therefore requires no Customer/Product/Supplier/Vehicle/Driver/Address search conversion for this Story.

## What happens when Submit is clicked

1. `final-version-1/add-challan-book.html` posts the model object `ingestionRequest` to `POST /logistics/challan-books/save`.
2. `ChallanBookWebController.processBookIngestion(...)` delegates the submitted `ChallanBookIngestionRequestDto` to `ChallanBookIngestionService.processRequest(...)`.
3. The service maps the submitted `ChallanBookRegistryDto` to `ChallanBookRegistryDo` using `ChallanBookRegistryMapper`.
4. The service sets `createdAt` and `updatedAt` to the current application time.
5. It persists the entity using `ChallanBookRegistryJpaDao.saveAndFlush(...)`.
6. JPA stores the registry in `public.tbl_challan_book_registry`. The database-generated identity is `pk_book_id`; `book_code` is the unique business code.
7. The response maps the saved entity back to a DTO and returns application response code `SUCCESS`.
8. On controller-level success, the browser is redirected to `/fetchCustomerByPage?pageNumber=1&itemsPerPage=10`, with `successMessage = "Challan Book registered successfully!"` and `bookDetails` added to the redirect `ModelAndView`.

## Exact persisted identity and fields

The frozen entity is `ChallanBookRegistryDo` mapped to `public.tbl_challan_book_registry`:

- `pk_book_id` — generated primary key
- `book_code` — required, unique, max 30
- `book_type` — required enum
- `series_prefix` — optional, max 10
- `start_sheet_number` — required
- `end_sheet_number` — required
- `current_location` — required enum, entity default `IN_OFFICE`
- `fk_assigned_vehicle` — optional; not entered by this registration form
- `created_at` — set during ingestion
- `updated_at` — set during ingestion

The DAO is `ChallanBookRegistryJpaDao extends JpaRepository<ChallanBookRegistryDo, Long>`. It also exposes `findByBookCode(...)`, but the frozen ingestion service does **not** call that method before saving.

## Validation and current-state gaps

The business intent is that the submitted book metadata be valid before persistence. The frozen source proves several layers, but also proves important gaps:

- The HTML requires Book Code, Book Type, Starting Sheet, Ending Sheet and Storage Location, and applies numeric minimum 1 to sheet fields.
- The entity/database mapping enforces non-null values for the required persisted columns and uniqueness of `book_code`.
- The service contains a null-request/null-book check, but the exception throw inside that check is commented out. A null request can therefore continue and fail later rather than producing the intended controlled application error.
- The service detects missing sheet bounds or `startSheetNumber > endSheetNumber`, but its intended `CylinderManagementApplicationException` throw is also commented out. The source therefore does **not** currently enforce start <= end at service level.
- Although the DAO has `findByBookCode(...)`, the ingestion service does not perform an explicit duplicate-code pre-check; uniqueness is ultimately enforced by the database constraint.
- Code for generating one `ChallanPageAuditLedgerDo` per sheet is present but commented out. The service therefore saves the book registry only; it does **not** generate/persist the per-sheet ledger rows described by the commented design.

These are `CURRENT_STATE_GAP` findings. They must not be represented as functioning validations or page-ledger creation until application code is corrected and tested.

## Error / visible outcome

The controller explicitly catches `CylinderManagementApplicationException`. For that exception type it redisplays `final-version-1/add-challan-book`, restores `ingestionRequest`, repopulates summary metrics, and exposes `errorMessage = "Error: " + exception.getMessage()`.

Because the service's intended null/range application-exception throws are commented out, those branches are not reliably reachable from those conditions in the frozen implementation. Database/JPA exceptions such as a duplicate `book_code` are not source-proved to be converted to this controller's `CylinderManagementApplicationException` branch and therefore must not be claimed as friendly form errors without additional handling.

## Business impact

A successful submit creates the durable Challan Book registry identity used by later challan allocation and operational paperwork. Accurate book type, code, sheet range and location are therefore important for traceability. The frozen source's disabled range validation and disabled sheet-ledger generation are development/test concerns because they can allow a registry record to exist without the intended stronger application validation or generated sheet tracking.

## Related Story

- STORY-0012 — `GET /logistics/challan-books/add-form`: renders the blank registration form and summary metrics.

## Rework gate

**BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW**. Controller, form, service, DAO and exact database write identity are now frozen-source bound. The documented current-state gaps are retained rather than guessed away. No automatic approval or revised BL-004/BL-005/BL-009 fan-out is authorized until explicit user approval/reapproval.
