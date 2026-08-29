# STORY-0118 — Weekly Forecast Review

- Release: R2
- Endpoint: `GET /delivery-planning/weekly-forecast`
- Controller: `DeliveryPlanningController.showWeeklyForecastReview`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

The frozen parameterless GET renders `with-menu/DeliveryPlanningWeeklyForecast`. It reads the exact JPA DAO projections `findForecastConfirmationQueue()`, `findSignalMatchKpi()`, and `findForecastAddressActivity()`, exposing them respectively as model keys `forecastQueue`, `signalMatchKpi`, and `addressActivity`.

This is a read-only page-load contract: no request fields, debounce, DTO ingestion, validation branch, reset/invalidation or database mutation occurs in the controller. No deeper table identity is asserted beyond the proved DAO methods. Approval remains pending.
