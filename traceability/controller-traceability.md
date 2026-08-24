# BL-001 Incremental Controller Traceability Matrix

Status: **INCREMENTAL_PARTIAL**  
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Matrix workflow: `workflows/WF-002-incremental-traceability-matrix.yaml`  
Structured full-chain projection: `traceability/explorer/traceability-matrix.json` plus ordered delta artifacts listed in `traceability/matrix-progress.yaml`.

This matrix is created while source analysis is in progress. A row is added or updated only after the Primary Orchestrator accepts the endpoint trace from pinned source evidence. Worker candidates do not become matrix truth automatically. The Markdown table is the compact endpoint index; ordered and branching component chains are preserved in the structured Explorer projection and durable evidence logs.

Current canonical checkpoint: **67 / 134 examined; 67 COMPLETE; 0 UNRESOLVED; 67 not yet examined.**  
Rows currently materialized below: **44**. The other 23 historically accepted rows must be backfilled from durable accepted evidence and must not be invented from counts alone.

| HTTP method | Path | Controller / method | State | Chain | Final dependency type | Final dependency | Evidence |
|---|---|---|---|---|---|---|---|
| GET | `/login` | `LoginController.showLoginPage` | COMPLETE | FULL | TERMINAL_VIEW | `LOGIN_FORM_VIEW`; no service/DAO/database dependency | `logs/runs/INVOCATION-20260823-160000.md` / LANE-01 |
| GET | `/offline-map/status` | `OfflineMapController` status path | COMPLETE | FULL | FILE_SQLITE_CLASSPATH | MBTiles file; SQLite `metadata`; MapLibre/glyph resources | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/offline-map/status-json` | `OfflineMapController` status-json path | COMPLETE | FULL | FILE_SQLITE_CLASSPATH | MBTiles file; SQLite `metadata`; frontend classpath resources | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/offline-map/style.json` | `OfflineMapController` style path | COMPLETE | FULL | CONFIGURATION_TERMINAL_JSON | `OfflineMapProperties` + request base URL -> JSON | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/offline-map/vector-tiles/{z}/{x}/{y}.pbf` | `OfflineMapController` vector-tile path | COMPLETE | FULL | FILE_SQLITE | MBTiles file; SQLite `tiles`, `metadata` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/delivery-planning/predefined-trips` | `PredefinedDeliveryTripController` page path | COMPLETE | PARTIAL_INTERMEDIATE_HOPS | POSTGRES_TABLES_AND_VIEWS | `tbl_predefined_delivery_trip`; `tbl_predefined_delivery_trip_stop`; `tbl_delivery_planning_stop`; two planning views | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/create` | `PredefinedDeliveryTripController` create path | COMPLETE | FULL | POSTGRES_TABLE | `public.tbl_predefined_delivery_trip` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/add-stop` | `PredefinedDeliveryTripController` add-stop path | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES | three predefined-trip/planning-stop tables | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/remove-stop` | `PredefinedDeliveryTripController` remove-stop path | COMPLETE | FULL | POSTGRES_TABLE | `public.tbl_predefined_delivery_trip_stop` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/remove` | `PredefinedDeliveryTripController` remove path | COMPLETE | FULL | POSTGRES_TABLE | `public.tbl_predefined_delivery_trip` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/complete-trip` | `CompleteTripController.completeTrip` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_REDIRECT | vehicle trip/load/stop, yard inventory, cylinder state/logistics tables; redirect home | `logs/runs/PRODUCTION-FIRE-20260824-000114.md` |
| GET | `/logistics/challan-books/add-form` | `ChallanBookWebController.showAddBookForm` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLE_AND_TERMINAL_VIEW | `public.tbl_summary_metric_lookup`; add-challan-book view | `logs/runs/PRODUCTION-FIRE-20260824-003111.md` |
| POST | `/logistics/challan-books/save` | `ChallanBookWebController.processBookIngestion` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_VIEWS | challan book registry/page ledger + success/error terminal paths | `logs/runs/PRODUCTION-FIRE-20260824-003111.md` |
| GET | `/challan-entry-aging-dashboard` | `ChallanEntryAgingDashboardController.showChallanEntryAgingDashboard` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_VIEW | tracker + tracker audit tables; dashboard view | `logs/runs/PRODUCTION-FIRE-20260824-005711.md` |
| GET | `/challan-heatmap` | `ChallanHeatmapController.showHeatmap` | COMPLETE | FULL_BRANCHING | POSTGRES_VIEW_AND_TERMINAL_VIEW | `public.vw_challan_heatmap_metrics`; dashboard view | `logs/runs/PRODUCTION-FIRE-20260824-013336.md` |
| GET | `/challan-page-photo/{challanPagePhotoId}` | `ChallanPagePhotoController.retrieveChallanPagePhoto` | COMPLETE | FULL | POSTGRES_TABLE_AND_TERMINAL_HTTP_RESPONSE | `public.tbl_challan_page_photo`; 404 or binary response | `logs/runs/PRODUCTION-FIRE-20260824-053325.md` |
| GET | `/customer-address-location/planning-map` | `CustomerAddressLocationController.showPlanningMap` | COMPLETE | FULL | TERMINAL_VIEW | `with-menu/CustomerAddressPlanningMap` | `logs/runs/PRODUCTION-FIRE-20260824-013546.md` |
| GET | `/customer-address-location/missing` | `CustomerAddressLocationController.showMissingLocations` | COMPLETE | FULL | POSTGRES_VIEW_AND_TERMINAL_VIEW | `public.vw_customer_address_location_status`; missing-locations view | `logs/runs/PRODUCTION-FIRE-20260824-020143.md` |
| GET | `/customer-address-location/points.geojson` | `CustomerAddressLocationController.customerAddressPointsGeoJson` | COMPLETE | FULL_BRANCHING | POSTGRES_VIEW_TABLE_AND_TERMINAL_JSON | address-location-status view; customer-order-request table; GeoJSON | `logs/runs/PRODUCTION-FIRE-20260824-020143.md` |
| GET | `/yard-location/upload` | `CustomerAddressLocationController.showYardLocationUpload` | COMPLETE | FULL | POSTGRES_TABLE_AND_TERMINAL_VIEW | `public.tbl_yard_inventory`; upload view | `logs/runs/PRODUCTION-FIRE-20260824-020143.md` |
| POST | `/yard-location/upload` | `CustomerAddressLocationController.saveYardLocation` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_REDIRECT | yard inventory/location tables; redirect | `logs/runs/PRODUCTION-FIRE-20260824-020143.md` |
| GET | `/yard-location/points.geojson` | `CustomerAddressLocationController.yardLocationsGeoJson` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_JSON | yard location/inventory tables; GeoJSON | `logs/runs/PRODUCTION-FIRE-20260824-020143.md` |
| GET | `/customer-address-location/upload` | `CustomerAddressLocationController.showUpload` | COMPLETE | FULL | TERMINAL_VIEW | upload view; no DB dependency | `logs/runs/PRODUCTION-FIRE-20260824-020143.md` |
| POST | `/customer-address-location/upload` | `CustomerAddressLocationController.saveLocation` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_REDIRECT | customer address/location tables; redirects | `logs/runs/PRODUCTION-FIRE-20260824-020143.md` |
| GET | `/customer-address-location/import-whatsapp-export` | `CustomerAddressLocationController.showWhatsappImport` | COMPLETE | FULL | POSTGRES_TABLE_AND_TERMINAL_VIEW | import inbox table; import view | `logs/runs/PRODUCTION-FIRE-20260824-020143.md` |
| POST | `/customer-address-location/import-whatsapp-export` | `CustomerAddressLocationController.importWhatsappText` | COMPLETE | FULL | POSTGRES_TABLE_AND_REDIRECT | import inbox table; redirect | `logs/runs/PRODUCTION-FIRE-20260824-020143.md` |
| GET | `/customer-consumption` | `CustomerConsumptionDashboardController.dashboard` | COMPLETE | FULL | POSTGRES_VIEW_AND_TERMINAL_VIEW | consumption projection view; dashboard view | `logs/runs/PRODUCTION-FIRE-20260824-023321.md` |
| GET | `/customer-consumption/` | `CustomerConsumptionDashboardController.dashboard` | COMPLETE | FULL | POSTGRES_VIEW_AND_TERMINAL_VIEW | consumption projection view; dashboard view | `logs/runs/PRODUCTION-FIRE-20260824-023321.md` |
| GET | `/customer-consumption/dashboard` | `CustomerConsumptionDashboardController.dashboard` | COMPLETE | FULL | POSTGRES_VIEW_AND_TERMINAL_VIEW | consumption projection view; dashboard view | `logs/runs/PRODUCTION-FIRE-20260824-023321.md` |
| GET | `/customer-consumption/api/dashboard` | `CustomerConsumptionDashboardController.dashboardData` | COMPLETE | FULL | POSTGRES_VIEW_AND_TERMINAL_JSON | consumption projection view; JSON DTO | `logs/runs/PRODUCTION-FIRE-20260824-023321.md` |
| GET | `/ownership-obligation-dashboard` | `OwnershipObligationDashboardController.showOwnershipObligationDashboard` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_VIEW | custody/cylinder/customer/supplier tables; dashboard view | `logs/runs/PRODUCTION-FIRE-20260824-033550.md` |
| GET | `/walkin-sale` | `WalkinSaleIngestionController.doGet` | COMPLETE | FULL | TERMINAL_VIEW | `final-version-1/WalkinSaleIngestion`; no persistence service call | `logs/runs/INVOCATION-20260823-145512.md` / LANE-03 |
| POST | `/walkin-sale` | `WalkinSaleIngestionController.doPost` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_REDIRECT_VIEW | customer/address/cylinder/challan-type/order/order-line/walk-in sale/pickup/yard/challan-page/link tables; success redirect or error view | `logs/runs/PRODUCTION-FIRE-20260824-103703.md` |
| POST | `/customer-spot-cylinder-check/submit` | `CustomerSpotCylinderCheckController.submit` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_VIEWS_AND_TERMINAL_VIEW | assigned-book view; customer; challan-page ledger; cylinder; custody view; spot-check header/line; challan transaction link; `final-version-1/CustomerSpotCylinderCheck` | `logs/runs/PRODUCTION-FIRE-20260824-100135.md` |
| GET | `/customer-spot-cylinder-check/fetch` | `CustomerSpotCylinderCheckController` fetch handler | COMPLETE | PARTIAL_INTERMEDIATE_HOPS | POSTGRES_VIEW | assigned-book view | `logs/runs/INVOCATION-20260823-145512.md` / LANE-01 |
| GET | `/yard-audit-dashboard` | `YardAuditDashboardController` dashboard handler | COMPLETE | PARTIAL_INTERMEDIATE_HOPS | POSTGRES_TABLES | yard stock check/line, quality gate, cylinder states, yard check event | `logs/runs/INVOCATION-20260823-145512.md` / LANE-02 |
| GET | `/cylinderDelivery` | `Uc02Phase02CylinderDeliveryController.doGet` | COMPLETE | FULL | TERMINAL_VIEW | delivery view; no mediator/service/DAO/database call | `logs/runs/PRODUCTION-FIRE-20260824-070036.md` |
| POST | `/cylinderDelivery` | `Uc02Phase02CylinderDeliveryController.doPost` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_REDIRECT_VIEW | challan/customer/address/driver/vehicle/cylinder/product/order/order-line tables + terminal paths | `logs/runs/PRODUCTION-FIRE-20260824-080301.md` |
| GET | `/vehicleLoad` | `Uc02Phase01VehicleLoadController.doGet` | COMPLETE | FULL_BRANCHING | IN_MEMORY_CACHE_POSTGRES_TABLE_AND_TERMINAL_VIEW | cache or vehicle-load-purpose table; vehicle-load view | `logs/runs/PRODUCTION-FIRE-20260824-083401.md` |
| POST | `/vehicleLoad` | `Uc02Phase01VehicleLoadController.doPost` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_REDIRECT_VIEW | cylinder, yard, trip/load/stop, logistics/state tables + terminal paths | `logs/runs/PRODUCTION-FIRE-20260824-085811.md` |
| GET | `/registerCustomer` | `UC01RegisterCustomerController.doGet` | COMPLETE | FULL_BRANCHING | IN_MEMORY_CACHE_POSTGRES_TABLE_AND_TERMINAL_VIEW | cache or `public.tbl_address_type`; registration view | `logs/runs/PRODUCTION-FIRE-20260824-093200.md` |
| GET | `/wizard/vehicle-trip-load` | `VehicleTripLoadWizardController.showWizard` | COMPLETE | FULL_BRANCHING | IN_MEMORY_CACHE_POSTGRES_VIEW_AND_TERMINAL_VIEW | `LookupDataCache`; `public.vw_active_challan_books_for_trip_load`; `final-version-1/VehicleTripLoadWizard` | `logs/runs/PRODUCTION-FIRE-20260824-110011.md` |
| POST | `/wizard/vehicle-trip-load/save` | `VehicleTripLoadWizardController.save` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_VIEW_AND_TERMINAL_REDIRECT_VIEW | trip/load/load-line, stop, challan assignment/ledger/view, cylinder/yard/logistics/state and master tables; `redirect:/vehicle-loads/list` or wizard error view | `logs/runs/PRODUCTION-FIRE-20260824-113951.md` |
| GET | `/displayCustomer` | `CustomerFetchController.doGet` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_VIEW_REDIRECT | `public.tbl_customer`; `public.tbl_customer_address`; `public.tbl_address`; `public.tbl_customer_phone_number`; `public.tbl_phone_number`; `DisplayCustomer`; handled redirect | `logs/runs/PRODUCTION-FIRE-20260824-134342.md` |
| GET | `/fetchCustomerByPage` | `CustomerFetchByPageController.doGet` | COMPLETE | FULL_BRANCHING | POSTGRES_TABLES_AND_TERMINAL_VIEW_REDIRECT | `public.tbl_customer`; `public.tbl_customer_phone_number`; `public.tbl_phone_number`; `public.tbl_customer_address`; `public.tbl_address`; `public.tbl_city`; `final-version-1/CustomerListPage`; handled redirect | `logs/runs/PRODUCTION-FIRE-20260824-143220.md` |

## Current unresolved paths

**None among the 67 examined endpoints.**

This does not close BL-001: **67 caller-visible endpoints remain not yet examined**. The matrix therefore remains `INCREMENTAL_PARTIAL` and WU-BL001-002 remains dependency-blocked until canonical source-check coverage reaches 100 percent.

## Incremental update rule

1. Validate frozen-source evidence.
2. Assign the canonical endpoint state.
3. Immediately upsert the `(HTTP method, path)` row here.
4. Preserve complete ordered/branching component chains in the Explorer structured projection.
5. Synchronize unresolved/blocked/failed accounting and `matrix-progress.yaml`.
6. Continue source analysis without waiting for 100% coverage.
7. At 100% coverage, WU-BL001-002 performs final reconciliation rather than recreating the matrix.
