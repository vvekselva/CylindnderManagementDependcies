# BL-001 Incremental Controller Traceability Matrix

Status: **INCREMENTAL_PARTIAL**  
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Matrix workflow: `workflows/WF-002-incremental-traceability-matrix.yaml`

This matrix is created while source analysis is in progress. A row is added or updated only after the Primary Orchestrator accepts the endpoint trace from pinned source evidence. Worker candidates do not become matrix truth automatically.

Current canonical checkpoint: **40 / 134 examined; 38 COMPLETE; 2 UNRESOLVED; 94 not yet examined.**  
Rows currently materialized below: **13**. The other 27 historically accepted rows must be backfilled from their durable accepted evidence and must not be invented from counts alone.

| HTTP method | Path | Controller / method | State | Chain | Final dependency type | Final dependency | Evidence |
|---|---|---|---|---|---|---|---|
| GET | `/login` | `LoginController.showLoginPage` | COMPLETE | FULL | TERMINAL_VIEW | `LOGIN_FORM_VIEW` / returned login view; no service/DAO/database dependency | `logs/runs/INVOCATION-20260823-160000.md` / LANE-01 |
| GET | `/offline-map/status` | `OfflineMapController` status path | COMPLETE | FULL | FILE_SQLITE_CLASSPATH | Configured MBTiles file; SQLite `metadata`; MapLibre JS/CSS and glyph classpath resources | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/offline-map/status-json` | `OfflineMapController` status-json path | COMPLETE | FULL | FILE_SQLITE_CLASSPATH | Configured MBTiles file; SQLite `metadata`; frontend classpath-resource checks | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/offline-map/style.json` | `OfflineMapController` style path | COMPLETE | FULL | CONFIGURATION_TERMINAL_JSON | `OfflineMapProperties` + request-derived application base URL -> generated JSON | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/offline-map/vector-tiles/{z}/{x}/{y}.pbf` | `OfflineMapController` vector-tile path | COMPLETE | FULL | FILE_SQLITE | Configured MBTiles file; SQLite `tiles` and `metadata` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/delivery-planning/predefined-trips` | `PredefinedDeliveryTripController` page path | COMPLETE | PARTIAL_INTERMEDIATE_HOPS | POSTGRES_TABLES_AND_VIEWS | `public.tbl_predefined_delivery_trip`; `public.tbl_predefined_delivery_trip_stop`; `public.tbl_delivery_planning_stop`; `public.vw_customer_address_location_status`; `public.vw_customer_delivery_planning_signal` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/create` | `PredefinedDeliveryTripController` create path | COMPLETE | FULL | POSTGRES_TABLE | `public.tbl_predefined_delivery_trip` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/add-stop` | `PredefinedDeliveryTripController` add-stop path | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES | `public.tbl_predefined_delivery_trip`; `public.tbl_delivery_planning_stop`; `public.tbl_predefined_delivery_trip_stop` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/remove-stop` | `PredefinedDeliveryTripController` remove-stop path | COMPLETE | FULL | POSTGRES_TABLE | `public.tbl_predefined_delivery_trip_stop` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/remove` | `PredefinedDeliveryTripController` remove path | COMPLETE | FULL | POSTGRES_TABLE | `public.tbl_predefined_delivery_trip` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/complete-trip` | `CompleteTripController.completeTrip` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_REDIRECT | `public.tbl_vehicle_load`; `public.tbl_vehicle_trip`; `public.tbl_trip_status`; `public.tbl_vehicle_trip_stop`; `public.tbl_stop_type`; `public.tbl_yard_entries`; `public.tbl_yard_inventory`; `public.tbl_yard_inventory_line`; `public.tbl_yard_inventory_source_type`; `public.tbl_yard_inventory_allowed_state`; `public.tbl_cylinder_states`; `public.tbl_cylinder_logistics_execution`; `public.tbl_cylinder_logistics_execution_line`; `public.tbl_cylinder`; redirect home | `logs/runs/PRODUCTION-FIRE-20260824-000114.md` |
| GET | `/logistics/challan-books/add-form` | `ChallanBookWebController.showAddBookForm` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLE_AND_TERMINAL_VIEW | `public.tbl_summary_metric_lookup`; `final-version-1/add-challan-book.html` | `logs/runs/PRODUCTION-FIRE-20260824-003111.md` |
| POST | `/logistics/challan-books/save` | `ChallanBookWebController.processBookIngestion` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_VIEWS | `public.tbl_challan_book_registry`; conditional `public.tbl_challan_page_audit_ledger`; error-branch `public.tbl_summary_metric_lookup`; success redirect; error re-render view | `logs/runs/PRODUCTION-FIRE-20260824-003111.md` |

## `/complete-trip` full-chain summary

The structured Explorer preserves separate ordered branches. The principal flow is:

`POST /complete-trip -> CompleteTripController.completeTrip -> CompleteTripServiceImpl.processRequest`.

Before service persistence, `CompleteTripRequestValidator.validate` proves/uses `VehicleLoadJpaDao`, `CylinderLogisticsExecutionJpaDao`, `CylinderLogisticsExecutionLineJpaDao`, `YardInventoryAllowedStateJpaDao`, and `YardInventoryLineJpaDao` through their mapped entities/tables. The service then uses the vehicle/trip/status/stop, yard, cylinder-state and logistics DAOs through their mapped entities/tables. The active logistics-line cylinder association is explicitly mapped through `CylinderDo -> public.tbl_cylinder`. The terminal action is a `ModelAndView` redirect to `ViewConstants.REDIRECT_HOME_LINK`.

## `ChallanBookWebController` full-chain summary

`GET /logistics/challan-books/add-form` follows `ChallanBookWebController.showAddBookForm -> SummaryMetricLookupFetchService -> SummaryMetricLookupJpaDao.findByLookUpKeyIn -> SummaryMetricLookupDo -> public.tbl_summary_metric_lookup`, with `SummaryMetricLookupMapper` converting the returned entities and terminal view `final-version-1/add-challan-book.html`.

`POST /logistics/challan-books/save` follows `ChallanBookWebController.processBookIngestion -> ChallanBookIngestionService.processRequest -> ChallanBookRegistryMapper -> ChallanBookRegistryJpaDao.saveAndFlush -> ChallanBookRegistryDo -> public.tbl_challan_book_registry`. If the submitted DTO contains page rows, the mapper traverses `ChallanPageAuditLedgerMapper -> ChallanPageAuditLedgerDo -> public.tbl_challan_page_audit_ledger`, and `ChallanBookRegistryDo.pages` is explicitly `cascade = CascadeType.ALL`. On the controller error path, the same summary-metric chain is invoked before re-rendering the add-book view. The success path redirects to `/fetchCustomerByPage?pageNumber=1&itemsPerPage=10`.

No intermediate dependency was inferred from naming; participating source components and explicit table mappings were fetched from the frozen baseline.

## Incremental update rule

1. Validate source evidence at the frozen baseline.
2. Assign the canonical endpoint trace state.
3. Immediately upsert the row by `(HTTP method, path)`.
4. Preserve the full ordered or branching Controller -> Service/Validator/Mediator -> DAO/Repository -> Entity/View -> DB/File/API/terminal chain.
5. Synchronize unresolved/blocked/failed rows with `traceability/unresolved-traceability.md`.
6. Update `traceability/matrix-progress.yaml`, structured JSON and browser data.
7. Continue source analysis; do not wait until 100% coverage to create the matrix.
8. At 100% source-check coverage, WU-BL001-002 performs final reconciliation rather than recreating the matrix.
