# STORY-0108 Human-Readable Test Data

The default invocation represents the framework-bound default `tab=productCategory`. Explicit `vehicle`, `driver`, and `cylinder` variants verify that `showDomainLookupPage` preserves the requested active tab while returning `final-version-1/DomainLookup`. The page is expected to expose its lookup collections from `LookupDataCache` and perform no save or targeted refresh operation during the GET.
