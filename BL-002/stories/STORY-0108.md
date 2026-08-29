# STORY-0108 — Domain Lookup Page

- Release: R1
- Endpoint: `GET /domainLookup`
- Controller: `DomainLookupController.showDomainLookupPage`
- Approval: PENDING_USER_APPROVAL
- Enrichment state: STRICT_FIELD_UI_COMPLETE
- Frozen source: `CylinderManagement@3ae6e61442132d94a307275b08dd65fcef228d89`

## Screen entry and request
The main Domain Lookup screen is `final-version-1/DomainLookup`. Optional request parameter `tab` defaults exactly to `productCategory`; the controller exposes it as model attribute `activeTab`.

## Read path and visible model
The GET performs no database call. It reads the startup/refreshed `LookupDataCache` and supplies six lookup domains: product categories, product UOMs, vehicles, drivers, products and cylinders. It also supplies product-category/UOM option lists for Product forms and UOM/Product option lists for Cylinder forms.

## Cache/data identity
The page reads cached domain DTO collections through `getProductCategories()`, `getProductUom()`, `getVehicles()`, `getDrivers()`, `getProduct()`, and `getCylinder()`. The controller documentation explicitly separates this read path from POST write paths; successful writes refresh only the corresponding cache segment.

## Outcome
The selected tab and all lookup collections are returned in the `ModelAndView`; there is no persistence mutation, hidden-ID write, debounce, or API call performed by this GET itself.

## Approval boundary
Strict field/UI contract is complete for the applicable frozen-source page-entry/read behavior. Approval remains pending.
