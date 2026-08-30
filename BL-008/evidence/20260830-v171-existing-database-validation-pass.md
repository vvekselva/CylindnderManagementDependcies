# BL-008 V171 Existing-Database Validation — PASS

Migration: `V171__Customer_Order_Request_View_Compatibility.sql`

Execution target: existing PostgreSQL database.

User-returned consolidated validation result:

| seq_no | check_name | status | details |
|---:|---|---|---|
| 1 | FLYWAY_HISTORY | PASS | V171 found; description=Customer Order Request View Compatibility; success=true |
| 2 | LEGACY_DASHBOARD_VIEW_EXISTS | PASS | vw_customer_demand_dashboard |
| 3 | NEW_DASHBOARD_VIEW_EXISTS | PASS | vw_customer_order_request_dashboard |
| 4 | LEGACY_METRICS_VIEW_EXISTS | PASS | vw_customer_demand_daily_product_metrics |
| 5 | NEW_METRICS_VIEW_EXISTS | PASS | vw_customer_order_request_daily_product_metrics |
| 6 | DASHBOARD_EXPECTED_COLUMNS | PASS | All expected columns are present |
| 7 | METRICS_EXPECTED_COLUMNS | PASS | All expected columns are present |
| 8 | DASHBOARD_ROW_COUNT | PASS | legacy_count=0; compatibility_count=0 |
| 9 | DASHBOARD_DATA_EQUIVALENCE | PASS | different_rows=0 |
| 10 | METRICS_ROW_COUNT | PASS | legacy_count=11; compatibility_count=11 |
| 11 | METRICS_DATA_EQUIVALENCE | PASS | different_rows=0 |
| 99 | BL008_V171_OVERALL_RESULT | PASS | All database validation checks passed |

## Validation conclusion

- Flyway recorded V171 successfully.
- Both compatibility views exist.
- Expected columns are present.
- Dashboard compatibility view is equivalent to its legacy source for the current zero-row dataset.
- Daily-product-metrics compatibility view is equivalent to its legacy source for all 11 current rows.
- No database-level corrective V172 is required for the V171 scope.
- Database writes by ChatGPT remain 0; user performed the existing-database Flyway apply.

Status: `V171_DATABASE_VALIDATED_PASS`.
