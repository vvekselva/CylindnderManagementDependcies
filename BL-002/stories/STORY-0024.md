# STORY-0024 — Save Customer Address Location

- Release: R2
- Endpoint: `POST /customer-address-location/upload`
- Controller: `CustomerAddressLocationController.saveLocation`
- Approval: PENDING_USER_APPROVAL
- Rework state: BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW
- Enrichment state: BUSINESS_BEHAVIOR_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`
- Local-source evidence: `BL-002/evidence/STORY-0024-local-source-business-behavior-20260902-1644.yaml`

The user submits the `Upload Customer Address Location` form through the visible `Save Location` button. The form posts to `/customer-address-location/upload` and binds `@ModelAttribute("location") CustomerAddressLocationDto request`; manual coordinates are separate optional request parameters `latitudeText` and `longitudeText`.

The controller converts non-empty manual coordinates with `BigDecimal` when DTO coordinates are absent and then calls `CustomerAddressLocationOfflineMapService.saveCustomerAddressLocation(request)`. The service requires a customer-address ID, can parse coordinates from `sourceReference` when one/both coordinates are missing, requires both coordinates, validates latitude -90..90 and longitude -180..180, and resolves the customer address by ID.

Before inserting the replacement, any existing active location for the same customer address is soft-superseded by setting `active=false`, `locationStatus=SUPERSEDED`, and `updatedAt=now`. The new `CustomerAddressLocationDo` is persisted through `CustomerAddressLocationJpaDao.save` into `public.tbl_customer_address_location`. The path persists location source/status, sourceReference, capture metadata, coordinates, timestamps, remarks and active state; `verifiedAt` is set only when status is VERIFIED.

On success the controller flashes `Customer address location saved successfully.` and redirects to `/customer-address-location/missing`. Runtime failures are caught, exposed as `errorMessage`, and redirect back to the upload page for the submitted customerAddressId.

The recovered governed ZIP independently confirms the controller conversion, coordinate parsing/validation, supersession, entity/table persistence and visible outcomes. STORY-0024 is therefore `BUSINESS_BEHAVIOR_COMPLETE_AWAITING_USER_REVIEW`.

No approval occurred. No application code or database schema was changed.
