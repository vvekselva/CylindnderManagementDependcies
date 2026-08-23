#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    print('SSOT VALIDATION: ERROR - PyYAML is required')
    sys.exit(2)

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_LANES = [f'LANE-{i:02d}' for i in range(1, 11)]
VALID_LANE_STATES = {'IDLE', 'ASSIGNED', 'INITIALIZING', 'WORKING', 'BLOCKED', 'WAITING', 'CLOSING', 'STALE'}


def load_yaml(rel: str) -> Any:
    path = ROOT / rel
    if not path.is_file():
        raise FileNotFoundError(rel)
    with path.open('r', encoding='utf-8') as fh:
        return yaml.safe_load(fh)


def nonempty(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        text = value.strip()
        return bool(text) and '<' not in text and '>' not in text
    if isinstance(value, (list, tuple, dict)):
        return len(value) > 0
    return True


def normalized_text(value: Any) -> str:
    return ' '.join(str(value or '').split())


def fail(errors: list[str], msg: str) -> None:
    errors.append(msg)


def rounded_pct(numerator: Any, denominator: Any) -> float | None:
    try:
        n = float(numerator)
        d = float(denominator)
        if d == 0:
            return None
        return round(n / d * 100.0, 2)
    except (TypeError, ValueError):
        return None


def validate_lane_status(backlog_id: str, runtime_path: Path, errors: list[str]) -> None:
    lane_file = runtime_path / 'lane-status.yaml'
    if not lane_file.is_file():
        return
    try:
        doc = yaml.safe_load(lane_file.read_text(encoding='utf-8')) or {}
    except Exception as exc:
        fail(errors, f'{backlog_id}: SSOT-L3 invalid YAML lane-status.yaml: {exc}')
        return

    root = doc.get('lane_status', {})
    if root.get('backlog_item') != backlog_id:
        fail(errors, f'{backlog_id}: lane-status backlog_item mismatch')

    lanes = root.get('lanes', {})
    actual_names = sorted(lanes.keys()) if isinstance(lanes, dict) else []
    if actual_names != EXPECTED_LANES:
        fail(errors, f'{backlog_id}: lane-status must contain exactly LANE-01 through LANE-10')
        return

    counts = {state.lower(): 0 for state in VALID_LANE_STATES}
    for lane_name in EXPECTED_LANES:
        lane = lanes.get(lane_name) or {}
        state = lane.get('state')
        if state not in VALID_LANE_STATES:
            fail(errors, f'{backlog_id}: {lane_name} has invalid state {state!r}')
            continue
        counts[state.lower()] += 1

        if state != 'IDLE':
            if not nonempty(lane.get('work_unit')):
                fail(errors, f'{backlog_id}: {lane_name} non-IDLE without work_unit')
            if not nonempty(lane.get('task')):
                fail(errors, f'{backlog_id}: {lane_name} non-IDLE without task')
        if state == 'WORKING':
            if not nonempty(lane.get('run_id')):
                fail(errors, f'{backlog_id}: {lane_name} WORKING without run_id')
            if not nonempty(lane.get('last_heartbeat')):
                fail(errors, f'{backlog_id}: {lane_name} WORKING without last_heartbeat')
        if state == 'BLOCKED' and not nonempty(lane.get('blocker')):
            fail(errors, f'{backlog_id}: {lane_name} BLOCKED without plain-English blocker')

    summary = root.get('summary', {})
    if summary.get('total_lanes') != 10:
        fail(errors, f'{backlog_id}: lane-status summary total_lanes must equal 10')
    for key, value in counts.items():
        if summary.get(key) != value:
            fail(errors, f'{backlog_id}: lane-status summary {key}={summary.get(key)!r} but lane records imply {value}')
    active_expected = 10 - counts['idle']
    if summary.get('active_lane_count') != active_expected:
        fail(errors, f'{backlog_id}: lane-status active_lane_count does not reconcile to lane records')


def validate_execution_statistics(backlog_id: str, runtime_path: Path, errors: list[str]) -> None:
    stats_file = runtime_path / 'execution-statistics.yaml'
    if not stats_file.is_file():
        return
    try:
        doc = yaml.safe_load(stats_file.read_text(encoding='utf-8')) or {}
    except Exception as exc:
        fail(errors, f'{backlog_id}: SSOT-L3 invalid YAML execution-statistics.yaml: {exc}')
        return

    root = doc.get('execution_statistics', {})
    if root.get('backlog_item') != backlog_id:
        fail(errors, f'{backlog_id}: execution-statistics backlog_item mismatch')
        return

    window = root.get('comparison_window', {})
    previous = window.get('previous_run') or {}
    current = window.get('current_or_latest_run') or {}
    for label, run in [('previous_run', previous), ('current_or_latest_run', current)]:
        if not run:
            continue
        total = run.get('total_endpoints')
        examined = run.get('end_checkpoint_examined')
        complete = run.get('complete')
        expected_progress = rounded_pct(examined, total)
        expected_complete = rounded_pct(complete, total)
        if expected_progress is not None and run.get('progress_percentage') != expected_progress:
            fail(errors, f'{backlog_id}: {label} progress_percentage does not match examined/total')
        if expected_complete is not None and run.get('complete_percentage') != expected_complete:
            fail(errors, f'{backlog_id}: {label} complete_percentage does not match complete/total')
        try:
            lanes = int(run.get('distinct_lanes_used', 0))
            lane_pct = round(lanes / 10.0 * 100.0, 2)
            if run.get('lane_utilization_percentage') != lane_pct:
                fail(errors, f'{backlog_id}: {label} lane_utilization_percentage does not match lanes/10')
            if lanes < 0 or lanes > 10:
                fail(errors, f'{backlog_id}: {label} distinct_lanes_used outside 0..10')
        except (TypeError, ValueError):
            fail(errors, f'{backlog_id}: {label} distinct_lanes_used is not an integer')

    staleness = root.get('staleness', {})
    cycles = staleness.get('consecutive_no_progress_cycles')
    if isinstance(cycles, int):
        expected_stale = cycles > 0
        if staleness.get('stale') is not expected_stale:
            fail(errors, f'{backlog_id}: stale flag does not reconcile with consecutive_no_progress_cycles')
    else:
        fail(errors, f'{backlog_id}: consecutive_no_progress_cycles must be an integer')

    analysis_file = runtime_path / 'analysis.yaml'
    if analysis_file.is_file() and current:
        try:
            analysis = yaml.safe_load(analysis_file.read_text(encoding='utf-8')) or {}
            checkpoint = analysis.get('analysis', {}).get('endpoint_dependency_trace_checkpoint', {})
            latest = analysis.get('analysis', {}).get('latest_attempt', {})
            if current.get('end_checkpoint_examined') != checkpoint.get('examined_for_final_dependency'):
                fail(errors, f'{backlog_id}: current statistics examined checkpoint does not match analysis.yaml')
            if current.get('complete') != checkpoint.get('complete'):
                fail(errors, f'{backlog_id}: current statistics COMPLETE count does not match analysis.yaml')
            if current.get('unresolved') != checkpoint.get('unresolved'):
                fail(errors, f'{backlog_id}: current statistics UNRESOLVED count does not match analysis.yaml')
            if current.get('total_endpoints') != checkpoint.get('total_endpoints'):
                fail(errors, f'{backlog_id}: current statistics total_endpoints does not match analysis.yaml')
            if latest and current.get('attempt') != latest.get('number'):
                fail(errors, f'{backlog_id}: current statistics attempt does not match analysis.yaml latest_attempt')
        except Exception as exc:
            fail(errors, f'{backlog_id}: cannot reconcile execution statistics with analysis.yaml: {exc}')


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []

    backlog_doc = load_yaml('backlog/backlog.yaml')
    run_doc = load_yaml('backlog/orchestrator-run-config.yaml')
    runtime_contract = load_yaml('backlog/runtime-contract.yaml')

    backlog = backlog_doc.get('backlog', {})
    items = backlog.get('items', [])
    by_id = {item.get('id'): item for item in items if item.get('id')}

    if len(by_id) != len(items):
        fail(errors, 'Level 1 contains missing or duplicate Backlog IDs')

    run_items = run_doc.get('backlog_items', {})
    required_runtime = list(runtime_contract.get('runtime_ssot_contract', {}).get('required_files', {}).keys())

    for backlog_id, run_item in run_items.items():
        if not run_item.get('run_enabled', False):
            continue

        print(f'Validating {backlog_id} ...')
        item = by_id.get(backlog_id)
        if not item:
            fail(errors, f'{backlog_id}: SSOT-L1 missing master entry')
            continue

        l1_required = [
            'id', 'name', 'type', 'purpose', 'priority', 'state', 'item_definition',
            'statement_of_work', 'completion_path', 'quality_gate', 'dependencies',
            'expected_outputs', 'runtime'
        ]
        for field in l1_required:
            if field not in item or (not nonempty(item.get(field)) and field not in {'dependencies'}):
                fail(errors, f'{backlog_id}: SSOT-L1 missing/empty {field}')

        definition_path = item.get('item_definition')
        sow_path = item.get('statement_of_work')
        path_file = item.get('completion_path')
        gate_file = item.get('quality_gate')
        runtime_dir = item.get('runtime')

        for label, rel in [('definition', definition_path), ('SOW', sow_path), ('Completion Path', path_file), ('Quality Gate', gate_file)]:
            if not rel:
                fail(errors, f'{backlog_id}: SSOT-L2 {label} reference is null')
            elif not (ROOT / rel).is_file():
                fail(errors, f'{backlog_id}: SSOT-L2 {label} file missing: {rel}')

        if definition_path and (ROOT / definition_path).is_file():
            definition = load_yaml(definition_path).get('backlog_definition', {})
            for field in ['id', 'name', 'type', 'purpose', 'statement_of_work', 'target', 'scope', 'dependencies', 'deliverables', 'acceptance_criteria', 'completion_path', 'quality_gate', 'runtime']:
                if not nonempty(definition.get(field)):
                    fail(errors, f'{backlog_id}: SSOT-L2 definition missing/empty {field}')
            for field in ['id', 'name', 'type']:
                if definition.get(field) != item.get(field):
                    fail(errors, f'{backlog_id}: SSOT-L2 definition {field} mismatch')
            l1_purpose = normalized_text(item.get('purpose'))
            l2_purpose = normalized_text(definition.get('purpose'))
            if l1_purpose and l1_purpose not in l2_purpose:
                fail(errors, f'{backlog_id}: SSOT-L2 definition purpose does not preserve Level 1 purpose')
            for field in ['statement_of_work', 'completion_path', 'quality_gate', 'runtime']:
                if definition.get(field) != item.get(field):
                    fail(errors, f'{backlog_id}: SSOT-L2 definition {field} does not match Level 1')

        if sow_path and (ROOT / sow_path).is_file():
            sow = load_yaml(sow_path).get('statement_of_work', {})
            if sow.get('backlog_item') != backlog_id:
                fail(errors, f'{backlog_id}: QG-SOW-001 backlog_item mismatch')
            for field in ['objective', 'problem_statement', 'scope', 'deliverables', 'execution_requirements', 'acceptance_criteria', 'completion_definition']:
                if not nonempty(sow.get(field)):
                    fail(errors, f'{backlog_id}: QG-SOW-001 missing/empty {field}')
            auth = sow.get('execution_authorization', {})
            if auth.get('sow_required') is not True or auth.get('structurally_valid') is not True or auth.get('placeholders_present') is not False:
                fail(errors, f'{backlog_id}: QG-SOW-001 execution_authorization is not valid')

        if not runtime_dir:
            fail(errors, f'{backlog_id}: SSOT-L3 runtime reference is null')
        else:
            runtime_path = ROOT / runtime_dir
            if not runtime_path.is_dir():
                fail(errors, f'{backlog_id}: SSOT-L3 runtime directory missing: {runtime_dir}')
            else:
                for filename in required_runtime:
                    fp = runtime_path / filename
                    if not fp.is_file():
                        fail(errors, f'{backlog_id}: SSOT-L3 missing {filename}')
                        continue
                    try:
                        doc = yaml.safe_load(fp.read_text(encoding='utf-8')) or {}
                    except Exception as exc:
                        fail(errors, f'{backlog_id}: SSOT-L3 invalid YAML {filename}: {exc}')
                        continue
                    if backlog_id not in str(doc):
                        warnings.append(f'{backlog_id}: {filename} does not visibly contain the Backlog ID')
                validate_lane_status(backlog_id, runtime_path, errors)
                validate_execution_statistics(backlog_id, runtime_path, errors)

        for field in ['item_definition', 'statement_of_work', 'runtime', 'completion_path', 'quality_gate']:
            if run_item.get(field) != item.get(field):
                fail(errors, f'{backlog_id}: run-config {field} does not match Level 1')

    print(f'Registered backlog items: {len(items)}')
    print(f'Run-enabled backlog items: {sum(1 for x in run_items.values() if x.get("run_enabled"))}')
    if warnings:
        print('\nWarnings:')
        for warning in warnings:
            print(f'  - {warning}')

    if errors:
        print('\nQG-SSOT-001: FAIL')
        for error in errors:
            print(f'  - {error}')
        return 1

    print('\nQG-SSOT-001: PASS')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
