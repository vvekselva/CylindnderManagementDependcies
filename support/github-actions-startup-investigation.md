# GitHub Support Investigation - Workflow Does Not Start After Push

> **STATUS: HOLD / DO NOT SEND YET.** The Automation Tool local process-pool execution engine has now been fired independently of GitHub Actions and proved 10/10 peak SERVICE concurrency with correct lifecycle closure and zero residual lane logs. GitHub Actions is not required for the current Cylinder execution architecture. Keep this note only as historical/optional investigation material unless a future GitHub-specific use case makes it relevant.

## Repository identity

- Owner: `vvekselva`
- Repository: `CylinderManagement`
- Full repository name: `vvekselva/CylinderManagement`
- Visibility: Private
- Default branch: `main`
- Test/execution branch used during investigation: `automation/lane-matrix`
- Workflow file used during investigation: `.github/workflows/lane-matrix-dispatch.yml`

## Issue title

**Push to private repository branch updates workflow input file, but GitHub Actions workflow does not appear to start and no workflow run/job ID is observable**

## Issue description

We were testing a GitHub Actions matrix workflow in the private repository `vvekselva/CylinderManagement` as an optional parallel execution backend.

The workflow file existed on branch `automation/lane-matrix` and was configured to trigger on a push to that branch when `automation/lane-dispatch.yaml` changed. The workflow also supported `workflow_dispatch`.

A fresh dispatch update was successfully committed to `automation/lane-matrix`:

- Dispatch generation: `4`
- Dispatch ID: `MATRIX-BL001-SOURCE-004`
- Control dispatch ID: `MATRIX-BL001-DISPATCH-004`
- Commit that updated the source dispatch file: `6810c3d19cbc6b5757317c00f627333b6c31eb7a`
- Expected matrix workers: `10`
- Workflow path at the time of the test: `.github/workflows/lane-matrix-dispatch.yml`
- Changed trigger file: `automation/lane-dispatch.yaml`

### Expected behavior

After the push to `automation/lane-matrix`, GitHub Actions should create a workflow run for the workflow and expose a workflow run ID/job records. The workflow's initial status-recording job should then create/update `automation/matrix-execution.yaml`.

### Actual behavior

After the dispatch push:

- the branch update was visible in the repository;
- the workflow definition was present on the branch;
- the dispatch file contained 10 READY independent tasks;
- no `automation/matrix-execution.yaml` appeared;
- no workflow run ID or worker job evidence was available through the connected GitHub evidence surface;
- therefore zero external workers could be confirmed as started.

### Historical related observation

An earlier control-repository matrix attempt did create workers, but those workers could not read the separate private `CylinderManagement` repository because the repository-scoped `GITHUB_TOKEN` did not provide cross-repository private access. That design was replaced by a source-local workflow specifically to avoid requiring a PAT.

The remaining question from the source-local test is narrower: why did the source-repository workflow not visibly start after the trigger-file push?

## Questions for GitHub Support

Please help determine which of the following applies:

1. Were GitHub Actions disabled or restricted for `vvekselva/CylinderManagement` at the repository/account level?
2. Can a commit performed through a GitHub App / API integration update the branch successfully but suppress a push-triggered workflow in this situation?
3. Did the workflow fail validation or fail before a workflow run became observable?
4. Are there workflow permission, Actions policy, allowed-actions, branch, or private-repository restrictions that would prevent this workflow from starting?
5. Is there an audit/event record that can confirm whether commit `6810c3d19cbc6b5757317c00f627333b6c31eb7a` generated an Actions push event and, if not, why?

## Important architectural note

This issue is now **non-blocking** for the Cylinder automation framework. GitHub has been reassigned to its intended role as Version Control System and durable persistence. The Automation Tool now owns execution through a local `LOCAL_PROCESS_POOL`, so no GitHub Actions workflow or runner is required for normal orchestration execution.

## Local engine verification

The Automation Tool execution engine was fired separately using the actual ten BL-001 lane task identities. The verification run achieved:

- configured lanes: `10`
- tasks fired: `10`
- peak SERVICE concurrency: `10/10`
- average SERVICE concurrency: `9.83`
- peak capacity utilization: `100%`
- lifecycle sequence verified: `INIT -> SERVICE -> CLOSE` for all lanes
- all workers closed: `true`
- residual individual lane logs after aggregation: `0`

This verification is recorded at `worker/evidence/LOCAL-BL001-ENGINE-SMOKE-20260823/engine-fire-summary.yaml`. It proves the execution-engine concurrency mechanism, but it is deliberately **not accepted as BL-001 trace evidence** because the private CylinderManagement source checkout was not mounted in the ChatGPT execution runtime.