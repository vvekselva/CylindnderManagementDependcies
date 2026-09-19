# STORY-0107 PostgreSQL Integration Fixture Design

This fixture validates the database-side vehicle-content rules used by `CylinderLogisticsExecutionLineJpaDao.findActiveVehicleContents`.

The minimal PostgreSQL model contains vehicle loads, logistics execution headers/lines, cylinders, states, products, and physical identifiers. Data deliberately includes an inactive line, completed line, exception line, wrong vehicle load, and valid EMPTY-state lines. This proves that only active, non-completed, non-exception lines under the requested vehicle load are returned.

A second scenario proves search by logical cylinder serial or active-primary physical identifier and rejects an identifier attached to an inactive identifier row. It does not infer full Flyway/application execution or JaCoCo coverage.
