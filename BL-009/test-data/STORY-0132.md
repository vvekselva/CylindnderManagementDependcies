# STORY-0132 Human-Readable Test Data

The successful create/update cases preserve the approved City controller behavior. Negative cases intentionally capture the current source defects: the service's invalid-input branch can attach a Country request DTO instead of a City request DTO, and duplicate detection uses contains/ignore-case without excluding the current city identity. This is test evidence only; remediation remains independently approval-gated.
