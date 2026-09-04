# STORY-0114 — Save Driver

- Release: R1
- Endpoint: `POST /domainLookup/driver/save`
- Controller: `DomainLookupController.saveDriver`
- Approval: APPROVED_AFTER_REWORK
- Review state: APPROVED_AFTER_REWORK
- Rework state: APPROVED_AFTER_REWORK
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Source baseline: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
- Drift review packet: `BL-002/evidence/STORY-0114-driver-save-drift-review-20260902.yaml`

## Business purpose and user action

The Driver tab in Domain Lookup lets an operator add or edit a Driver record. The form posts to `POST /domainLookup/driver/save` and carries optional `driverId`, required `driverName`, required `phoneNumber`, required `licenceNumber`, and CSRF when available. The visible Driver list shows Driver ID, name, phone number and licence number; the Edit button copies the selected row values back into the form so the same endpoint handles update as well as create.

`driverName` is capped at 200 characters. `phoneNumber` is a required tel input. `licenceNumber` is required, capped by the template, and converted to uppercase in the browser while typing.

## Controller contract and visible outcomes

`DomainLookupController.saveDriver(...)` binds the four submitted fields. It trims phone and Driver name, uppercases/trims licence number, wraps phone text in `PhoneNumberDto`, builds `DriverDto` and `DriverIngestionRequestDto`, and calls `driverIngestionService.processRequest(req)`.

`driverId == null || driverId == 0` is treated as create; otherwise the controller treats the operation as update. On successful service completion it refreshes only the Driver lookup cache and redirects to `/domainLookup?tab=driver` with either `Driver "..." added successfully.` or `Driver "..." updated successfully.`

When `InvalidInputParameterException` carries `DriverIngestionRequestDto`, the controller rebuilds the full Domain Lookup page through `buildValidationErrorMav(...)` so the Driver form stays open with the failed Driver DTO and inline validation evidence. An unexpected validation DTO or any other exception redirects to the Driver tab with an error flash.

## Exact current service and persistence behavior

`DriverIngestionService.processRequest(...)` currently validates only that the request, Driver DTO and `driverName` are present/non-empty. It also rejects whenever `DriverJpaDao.findByDriverNameContainingIgnoreCase(driverName)` returns any row.

After those checks it maps the DTO with `DriverMapper.mapDtoToDo(...)` and saves through `DriverJpaDao.save(...)`. `DriverDo` maps to `public.tbl_driver`, primary key `pk_driver_id`, sequence `public.pk_driver_id_serial`, `driver_name`, nullable `fk_phone_number`, and `licence_number`.

`DriverMapper` currently maps `driverId`, `driverName` and `licenceNumber`, but does **not** map the submitted phone number. Therefore the active executable Driver ingestion path does not source-prove persistence of the submitted phone relation even though the form marks Phone Number required and the database/entity contain `fk_phone_number`.

## Source-proved current defects / drift

The recovered ZIP exposes four material conformance gaps:

1. The null/invalid request branch calls `InvalidInputParameterException.throwInputValidationFailure(new VehicleIngestionRequestDto(), ...)` instead of returning Driver-specific validation evidence. That can prevent the controller's intended inline Driver validation branch.
2. Duplicate-name validation uses `contains`/ignore-case and does not exclude the same `driverId` during update, so legitimate same-row or substring updates can be rejected.
3. The service does not validate required Phone Number or Licence Number even though the template declares them required and renders Driver-specific phone/licence validation messages.
4. `DriverMapper` drops the phone relation, so submitted phone data is not source-proved to `public.tbl_driver.fk_phone_number` / `public.tbl_phone_number` during Driver save.

These defects are documented in the approval-gated review packet. They are not silently corrected by this Story and do not authorize BL-010 or application-code mutation.

## Persistence identity and business impact

The current successful save creates/updates `public.tbl_driver` through Spring Data JPA. Driver name and licence number are source-proved through the mapper; submitted phone persistence is not. Since `driverId` is copied into `DriverDo`, repository save is capable of targeting an existing Driver identity when the duplicate guard permits it.

The business impact of the current gaps is that a Driver can appear to accept a required phone value without that relationship being persisted, phone/licence validation is weaker than the visible form contract, and update behavior can be falsely blocked by the duplicate-name rule.

## Completion and approval gate

The recovered ZIP now binds the complete visible form/edit behavior, submitted fields, normalization, controller success/error branches, exact service validation/save behavior, database identity and the current persistence/validation defects.

STORY-0114 is `APPROVED_AFTER_REWORK` by explicit user approval on 2026-09-04, with downstream fan-out requested.

Approval is explicitly recorded. Existing drift/code-remediation packets remain independently approval-gated; no application-code or BL-010 mutation is authorized by this Story approval.
