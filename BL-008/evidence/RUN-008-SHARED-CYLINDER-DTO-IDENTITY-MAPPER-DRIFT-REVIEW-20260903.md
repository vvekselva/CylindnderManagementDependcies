# BL-008 Shared Cylinder DTO Identity Mapper Drift Review — RUN-008

Run: `CYLINDER-PRODUCTION-FIRE-20260903-143500-IST-RUN-008`
Source baseline: frozen local ZIP SHA-256 `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`
Implementation gate: **EXPLICIT USER APPROVAL REQUIRED FOR THIS EXACT MANIFEST**

## Current vs approved behavior

`CylinderDtoIdentifierMappingUtil.fromGlobalSearchRow(...)` assigns `CylinderDto.cylinderSerial` from `displayCylinderIdentifier` when present, and `applyCylinderDoFallback(...)` again assigns `cylinderSerial` from `displayCylinderIdentifier`. The same utility separately populates `logicalCylinderCode`, `actualCylinderIdentifier`, and `displayCylinderIdentifier`.

The V185 contract requires the logical cylinder identity to remain stable for transactions/search results, while the physical/display identifier is a separate field for external exchangeable assets. Company assets use a single identity. Therefore placing the composed/display value into `cylinderSerial` collapses the distinction that the other DTO fields explicitly preserve.

## Business impact

Ownership-aware global search, serial/state search, current-ownership-by-state search, yard search fallback, and on-vehicle search fallback can expose a physical/composed display value through the legacy logical `cylinderSerial` property. Downstream screens that still submit/read `cylinderSerial` can therefore use a presentation identity where a stable logical identity is expected.

## Exact proposed code-change manifest

Repository/ref: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`.

1. File: `cylindermanagement.custommapper.service/src/main/java/com/sreyas/datamatics/cylinder/management/services/util/CylinderDtoIdentifierMappingUtil.java`
   - Class: `CylinderDtoIdentifierMappingUtil`
   - Method: `fromGlobalSearchRow`
   - Anchor: lines ~14-23; specifically current `dto.setCylinderSerial(StringUtils.defaultIfBlank(row.getDisplayCylinderIdentifier(), row.getCylinderSerial()))`.
   - Proposed change: set `cylinderSerial` from the stable logical source (`row.getCylinderSerial()` / `row.getLogicalCylinderCode()` according to the view contract), while leaving `displayCylinderIdentifier` and `actualCylinderIdentifier` in their dedicated fields.
   - Reason: preserve logical-key semantics and prevent presentation identity from overwriting the transaction identity.

2. Same file/class.
   - Method: `applyCylinderDoFallback`
   - Anchor: lines ~44-53; specifically current final `setCylinderSerial(...)` using `displayCylinderIdentifier`.
   - Proposed change: keep `cylinderSerial` equal to `cylinderDo.getCylinderSerial()`; fill missing logical/display/physical fields independently without using display value to overwrite logical serial.
   - Reason: the fallback currently reintroduces the same identity collapse even when callers initially map the correct logical serial.

No caller-specific code modification is authorized by this packet. Existing caller-specific packets for Yard/Vehicle mapping remain separate; implementation should first determine whether correcting this shared utility makes any caller-local change redundant. If a caller-local change beyond an already separately approved manifest is still required, stop that scope and request approval.

## Tests

- Unit-test `fromGlobalSearchRow` for COMPANY_OWNED and external assets: `cylinderSerial`/`logicalCylinderCode` remain logical, `actualCylinderIdentifier` remains physical, and `displayCylinderIdentifier` remains composed/presentation value.
- Unit-test `applyCylinderDoFallback` with an external display value already present and confirm logical serial is not overwritten.
- Regression-test ownership-aware global, serial/state, current-state, yard and on-vehicle searches for logical-key preservation.

## Database impact

NONE. No V186, schema, view, data rewrite, or migration is proposed.

State: `DRIFT_REVIEW_READY_FOR_USER_APPROVAL`.
Application/test/database code changed by RUN-008: **NO**.
BL-010 rework created by RUN-008: **NO**.
