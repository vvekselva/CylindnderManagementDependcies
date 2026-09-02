# STORY-0093 — Driver by ID

- Release: R1
- Endpoint: `GET /find/Driver-by-Id/{driverId}`
- Controller: `RestfulDriverServices.getDriverById`
- Approval: PENDING_USER_APPROVAL
- Review state: READY_FOR_USER_REVIEW
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Canonical identity: `release-classification.csv` No. 93
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Identity repair evidence: `BL-002/evidence/STORY-0092-0097-identity-drift-repair-20260902.yaml`

## Business behavior

This read-only API fetches one driver by persistent ID. The exact path variable is required `driverId: Long`. `RestfulDriverServices.getDriverById` builds `DriverFetchByIdRequestDto`, sets the driver ID and delegates to `DriverFetchByIdService.processRequest`.

The service rejects a null driver ID with `InvalidInputParameterException`, reads `DriverJpaDao.findById(driverId)`, throws `DomainObjectNotFoundException` when the row is absent, maps the found `DriverDo` to `DriverDto`, and returns it in `DriverFetchByIdResponseDto`. The REST handler catches the governed application exception family and returns an empty response DTO rather than mutating data.

The operation therefore resolves an exact persisted driver identity for consuming screens/services and performs no driver write.

## Completion and approval gate

The canonical Story identity, required path ID, service validation/not-found branches, repository lookup, DTO mapping and read-only effect are source-bound. STORY-0093 is `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains pending; no application-code or BL-010 mutation occurred.
