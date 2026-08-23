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


def fail(errors: list[str], msg: str) -> None:
    errors.append(msg)


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

        # Level 1
        l1_required = [
            'id', 'name', 'type', 'purpose', 'priority', 'state', 'item_definition',
            'statement_of_work', 'completion_path', 'quality_gate', 'dependencies',
            'expected_outputs', 'runtime'
        ]
        for field in l1_required:
            if field not in item or not nonempty(item.get(field)) and field not in {'dependencies'}:
                fail(errors, f'{backlog_id}: SSOT-L1 missing/empty {field}')

        definition_path = item.get('item_definition')
        sow_path = item.get('statement_of_work')
        path_file = item.get('completion_path')
        gate_file = item.get('quality_gate')
        runtime_dir = item.get('runtime')

        # Level 2
        for label, rel in [('definition', definition_path), ('SOW', sow_path), ('Completion Path', path_file), ('Quality Gate', gate_file)]:
            if not rel:
                fail(errors, f'{backlog_id}: SSOT-L2 {label} reference is null')
            elif not (ROOT / rel).is_file():
                fail(errors, f'{backlog_id}: SSOT-L2 {label} file missing: {rel}')

        if definition_path and (ROOT / definition_path).is_file():
            definition = load_yaml(definition_path).get('backlog_definition', {})
            for field in ['id', 'name', 'purpose', 'statement_of_work', 'target', 'scope', 'dependencies', 'deliverables', 'acceptance_criteria', 'completion_path', 'quality_gate', 'runtime']:
                if not nonempty(definition.get(field)):
                    fail(errors, f'{backlog_id}: SSOT-L2 definition missing/empty {field}')
            if definition.get('id') != backlog_id:
                fail(errors, f'{backlog_id}: SSOT-L2 definition ID mismatch')
            if definition.get('name') != item.get('name'):
                fail(errors, f'{backlog_id}: SSOT-L2 definition name mismatch')

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

        # Level 3
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

        # Run-control reconciliation
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
