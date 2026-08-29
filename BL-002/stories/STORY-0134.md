# STORY-0134 — Create Vehicle Trip

- Release: R1
- Endpoint: `POST /addVechileTrip`
- Controller: `VehicleTripIngestionController.doPost`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Request / binding contract
The POST binds `@ModelAttribute("tripRequest") VehicleTripIngestionRequestDto`. The frozen screen submits exact nested fields for selected vehicle ID/number, driver ID/name, starting time, customer ID, and customer-address ID. Browser validation in the paired form prevents submission when any required selection/time is absent and converts datetime-local to HH:mm for the starting-time field.

## Service / success contract
The controller invokes `vehicleTripIngestionService.processRequest(requestDto)`. On success it resolves driver ID/name and vehicle ID/number preferring the service response and falling back to the submitted request when necessary. It creates flash attributes `REDIRECT_REQUEST=true`, `DRIVER_ID`, `DRIVER_NAME`, `VEHICLE_ID`, `VEHICLE_NUMBER`, and `VEHICLE_TRIP_ID` from the response trip identity, then redirects to `/vehicleLoad` so the next Vehicle Load step can consume the created trip context.

The application service is the mutation boundary proved by this controller. No raw SQL or unproved database table/repository identity is asserted here.

## Validation / error visible outcome
On `InvalidInputParameterException`, if the exception carries `VehicleTripIngestionRequestDto`, the controller copies the failed `vehicleTripDto` and `validationErrorDtos` back into the submitted request, logs each validation error code when present, and returns the same `with-menu/VehicleTripIngestion` view with `tripRequest` and `backLink=/vehicle-loads/list`. There is no success redirect in this branch.

On other `CylinderManagementApplicationException`, it logs the system error and returns the same form with submitted request and back link. Thus failure preserves the form context rather than advancing to Vehicle Load.

## Approval boundary
No approval occurred. Strict enrichment completion is not business approval.
