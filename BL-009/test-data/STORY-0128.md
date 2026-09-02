# STORY-0128 Human-Readable Test Data

The page-load cases cover the four supported lookup tabs: `addressType`, `country`, `state`, and `city`. Every case must render `final-version-1/LookupManagement`, preserve the selected tab in `activeTab`, and expose `addressTypes`, `countries`, `states`, and `cities` from `LookupDataCache`. The GET itself has zero persistence/write effect; save and cache-refresh behavior belongs to separate Stories.
