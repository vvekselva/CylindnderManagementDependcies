# STORY-0131 Human-Readable Test Data

The successful create/update cases preserve the approved State controller behavior. Negative cases intentionally capture the current source defects: the service's invalid-input branch can attach a Country request DTO instead of a State request DTO, and duplicate detection uses contains/ignore-case without excluding the current state identity. This is test evidence only; remediation remains independently approval-gated.
