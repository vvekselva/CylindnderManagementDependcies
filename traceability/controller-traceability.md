# BL-001 Incremental Controller Traceability Matrix

Status: **INCREMENTAL_PARTIAL**  
Frozen source baseline: `3ae6e61442132d94a307275b08dd65fcef228d89`  
Matrix workflow: `workflows/WF-002-incremental-traceability-matrix.yaml`

This matrix is created **while source analysis is in progress**. A row is added or updated only after the Primary Orchestrator accepts the endpoint trace from pinned source evidence. Worker candidates do not become matrix truth automatically.

Current canonical checkpoint: **37 / 134 examined; 35 COMPLETE; 2 UNRESOLVED; 97 not yet examined.**  
Rows currently materialized below: **10** from accepted Attempt 27 evidence. The other 27 historically accepted rows must be backfilled from their durable accepted evidence and must not be invented from counts alone.

| HTTP method | Path | Controller / method | State | Final dependency type | Final dependency | Evidence |
|---|---|---|---|---|---|---|
| GET | `/login` | `LoginController.showLoginPage` | COMPLETE | TERMINAL_VIEW | `LOGIN_FORM_VIEW` / returned login view; no service/DAO/database dependency | `logs/runs/INVOCATION-20260823-160000.md` / LANE-01 |
| GET | `/offline-map/status` | `OfflineMapController` status path | COMPLETE | FILE_SQLITE_CLASSPATH | Configured MBTiles file; SQLite `metadata`; MapLibre JS/CSS and glyph classpath resources | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/offline-map/status-json` | `OfflineMapController` status-json path | COMPLETE | FILE_SQLITE_CLASSPATH | Configured MBTiles file; SQLite `metadata`; frontend classpath-resource checks | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/offline-map/style.json` | `OfflineMapController` style path | COMPLETE | CONFIGURATION_TERMINAL_JSON | `OfflineMapProperties` + request-derived application base URL -> generated JSON | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/offline-map/vector-tiles/{z}/{x}/{y}.pbf` | `OfflineMapController` vector-tile path | COMPLETE | FILE_SQLITE | Configured MBTiles file; SQLite `tiles` and `metadata` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-02 |
| GET | `/delivery-planning/predefined-trips` | `PredefinedDeliveryTripController` page path | COMPLETE | POSTGRES_TABLES_AND_VIEWS | `public.tbl_predefined_delivery_trip`; `public.tbl_predefined_delivery_trip_stop`; `public.tbl_delivery_planning_stop`; `public.vw_customer_address_location_status`; `public.vw_customer_delivery_planning_signal` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/create` | `PredefinedDeliveryTripController` create path | COMPLETE | POSTGRES_TABLE | `public.tbl_predefined_delivery_trip` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/add-stop` | `PredefinedDeliveryTripController` add-stop path | COMPLETE | POSTGRES_TABLES | `public.tbl_predefined_delivery_trip`; `public.tbl_delivery_planning_stop`; `public.tbl_predefined_delivery_trip_stop` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/remove-stop` | `PredefinedDeliveryTripController` remove-stop path | COMPLETE | POSTGRES_TABLE | `public.tbl_predefined_delivery_trip_stop` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |
| POST | `/delivery-planning/predefined-trips/remove` | `PredefinedDeliveryTripController` remove path | COMPLETE | POSTGRES_TABLE | `public.tbl_predefined_delivery_trip` | `logs/runs/INVOCATION-20260823-160000.md` / LANE-03 |

## Incremental update rule

1. Validate source evidence at the frozen baseline.
2. Assign the canonical endpoint trace state.
3. Immediately upsert the row by `(HTTP method, path)`.
4. Synchronize unresolved/blocked/failed rows with `traceability/unresolved-traceability.md`.
5. Update `traceability/matrix-progress.yaml`.
6. Continue source analysis; do **not** wait until 100% coverage to create the matrix.
7. At 100% source-check coverage, WU-BL001-002 performs final reconciliation rather than recreating the matrix.
