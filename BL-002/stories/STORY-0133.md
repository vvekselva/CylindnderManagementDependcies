# STORY-0133 — New Vehicle Trip Screen

- Release: R1
- Endpoint: `GET /addVechileTrip`
- Controller: `VehicleTripIngestionController.doGet`
- Approval: NOT_NEEDED_SUPERSEDED
- Review state: SUPERSEDED_NOT_NEEDED
- Rework state: SUPERSEDED_NOT_NEEDED
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Source package: `Harinandhan-Cylinder-Backup(20260902-080237).zip`
- Source package SHA-256: `60db87cece840505caa3de5521fbc5e1c680e2eb8e936044a87922f1f57f53a2`

- Lifecycle disposition: SUPERSEDED_NOT_NEEDED
- Superseded by: STORY-0043 / STORY-0044
- Supersession reason: The combined Vehicle Trip Load Wizard creates the trip and carries the trip identity into the same governed workflow, replacing the separate Add Vehicle Trip screen/submit flow.
- Approval requirement: NONE_FOR_SUPERSEDED_STORY
- Downstream fan-out: BLOCKED_NOT_APPLICABLE

## Business behavior

This page starts creation of a vehicle trip. `GET /addVechileTrip` creates an empty `VehicleTripDto`, wraps it in `VehicleTripIngestionRequestDto`, renders `with-menu/VehicleTripIngestion`, exposes model `tripRequest`, and provides `/vehicle-loads/list` as the back link. The GET performs no persistence mutation.

The user must select Vehicle, Driver, Customer and Customer Delivery Address and provide Starting Date & Time. Vehicle/Driver/Customer use browser search controls. Blank text sends no request; nonblank text uses a 350 ms debounce and calls the exact Vehicle, Driver or Customer search endpoint. Selecting a result stores its persistent identity in browser state and replaces the search input with a selected chip. Customer selection clears any prior Address and immediately loads only that Customer's addresses; clearing Customer invalidates/disables Address again.

Starting Date & Time uses `datetime-local`, initializes/min-constrains to current local time and contributes only the HH:mm value to the bound trip starting-time field. `Create Trip` validates that all five required selections/values exist; failure marks the fields and prevents form submission with `Please fill in all required fields`.

On valid submit the browser writes exact selected identities into hidden Spring fields: vehicle ID/number, driver ID/name, starting time, customer ID and customer-address ID, then submits the companion `POST /addVechileTrip` while showing the Creating Vehicle Trip overlay. Search failures show `Search failed. Please try again.` and Cancel requires browser confirmation before navigating back.

## Business impact

The GET constructs a consistent trip-creation request using persistent reference identities, prevents stale Customer/Address combinations in the browser, and hands the validated selection set to the separate POST transaction. It does not itself create the trip.

## Completion and approval gate

The recovered ZIP confirms the page initialization, every required control, search timing/endpoints, dependent Address behavior, local validation, hidden identity propagation and read-only boundary. STORY-0133 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

Approval remains `PENDING_USER_APPROVAL`. No application code was changed and no BL-010 work was created or executed.

## Supersession disposition

This legacy Story is retained only for traceability and audit. It is **not an active review or implementation requirement**. Its business capability is provided by the combined Vehicle Trip Load Wizard through STORY-0043 / STORY-0044. Do not request user approval, post-approval conformance, BL-004 unit-test fan-out, BL-005 integration-test fan-out, BL-009 test-catalogue fan-out, or BL-011 readable-packet completion for this superseded Story. Historical source analysis remains evidence only and must not be counted as active backlog work.
