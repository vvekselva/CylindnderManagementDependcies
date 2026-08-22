# Source Analysis Request / Result Template

Use this template for requests sent to the independent Source Analysis Worker.

## Request

```text
Analysis Request ID: SAR-####
Caller Workflow: <WF-ID>
Caller Job: <JOB-ID>
Caller Worker Lane: <LANE-## or COORDINATOR>
Target Repository: vvekselva/CylinderManagement
Source Commit: <exact SHA>
Scope: <source path(s)>
Question: <what must be proved from source?>
Expected Facts: <facts required by caller>
Allowed Depth: <DISCOVERY | ENDPOINT | CALL_PATH | DATABASE_OBJECT | FULL_TRACE>
Unresolved Allowed: YES
```

## Source Analysis Worker init()

```text
What I am analysing:
<simple-English explanation>

Source version:
<exact SHA>

Source area:
<paths>

Expected result:
<what facts will be returned>
```

## Source Analysis Worker service()

Record facts in this format:

| Fact ID | Fact | Evidence | Confidence |
|---|---|---|---|
| SAF-001 | `<fact>` | `<source file + method/annotation>` | PROVED |

Unresolved fact:

```text
Fact ID: SAF-###
State: UNRESOLVED
Last proven source location: <file/method/class>
What is missing: <simple English>
Why it was not guessed: <reason>
Suggested deeper analysis: <next source-analysis request>
```

## Source Analysis Worker close()

```text
Files examined: <count/list>
Proved facts returned: <count>
Unresolved facts returned: <count>
Result: COMPLETED | PARTIAL | BLOCKED | FAILED
Next source-analysis step: <step or NONE>
Run state: CLOSED
```

## Result Package

The result package returned to the caller must contain:

- Analysis Request ID;
- source commit;
- scope analysed;
- proved facts;
- unresolved facts;
- evidence references;
- final result;
- closed run state.

It must not contain workflow scheduling decisions.
