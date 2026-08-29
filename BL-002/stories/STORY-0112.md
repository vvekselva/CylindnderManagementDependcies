# STORY-0112 — Save Cylinder

- Release: R1
- Endpoint: `POST /domainLookup/cylinder/save`
- Controller: `DomainLookupController.saveCylinder`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Screen entry and dependent controls
The operation belongs to the Cylinder tab of Domain Lookup. The GET supplies `cylinders`, `cylinderUomOptions`, and `cylinderProductOptions` from `LookupDataCache`, proving the displayed Cylinder list and its Product/UOM dependent choices share the managed lookup cache. No separate typing-time search/debounce endpoint is source-proved for this form POST.

## Request-to-service path
`DomainLookupController.saveCylinder` accepts the Cylinder form parameters declared by its handler, maps them to `CylinderDto`, wraps that DTO in `CylinderIngestionRequestDto`, and invokes `cylinderIngestionService.processRequest`. Product/UOM identities submitted by the form are downstream domain references; the MVC controller does not issue raw SQL.

## Branch and invalidation behavior
The submitted Cylinder identity determines create versus update behavior. On successful ingestion, the controller refreshes the Cylinder cache through the targeted `LookupDataCache` refresh operation before redirecting, so subsequent screen reads do not retain stale Cylinder data.

## Error/success outcome
Success uses the Domain Lookup PRG pattern and returns to the Cylinder tab with an added/updated flash outcome. Expected user-input validation returns the complete Domain Lookup view directly with the failed Cylinder DTO and the form-open state so inline validation remains visible. Unexpected validation shape or other exceptions use the generic error-flash redirect path.

## Persistence/read boundary
The source-proved write boundary is `CylinderIngestionRequestDto` passed to the Cylinder ingestion application service; the source-proved visible read boundary is the refreshed Cylinder cache used by the GET. No unstated persistence behavior is invented.

## Approval boundary
Strict field/UI enrichment is complete for the applicable frozen-source contract. Approval remains pending and no auto-approval occurred.
