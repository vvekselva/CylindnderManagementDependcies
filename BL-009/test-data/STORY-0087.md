# STORY-0087 Human-Readable Test Data

`HOME` is the primary representative search term. The positive case proves the REST controller preserves the exact path-variable value as the application request search term and returns the delegated response. The governed-failure case uses the same input but forces the application search service to raise `CylinderManagementApplicationException`; the expected REST result is a newly created non-null empty response DTO. A lowercase `office` case documents that the approved persistence search is read-only and case-insensitive/contains-based.
