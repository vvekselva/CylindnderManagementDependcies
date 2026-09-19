# STORY-0096 PostgreSQL Integration Fixture Design

This fixture validates the exact PostgreSQL relation/filter contract used by `CustomerHeldCylinderSearchJpaDao.findActiveCustomerHeldCylinders`.

It intentionally creates only the relations required by the native query: `vw_cylinder_party_custody_with_identifiers`, `tbl_cylinder`, and `tbl_product`. The fixture contains active CUSTOMER custody for the requested customer, an active row for another customer, a CLOSED row, and a SUPPLIER row. This makes incorrect party/status/customer filtering visible instead of relying on an oversized application schema.

The test separately verifies case-insensitive matching through logical code, active actual identifier, and display identifier, plus the count-query semantics used for paging. It does not claim full application-context or Flyway execution; those remain runtime evidence tasks.
