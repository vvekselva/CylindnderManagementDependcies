#!/usr/bin/env python3
"""Validate repository-catalogue.md against tracked repository files.

This validator is executed by the Primary Orchestrator in the ChatGPT environment.
GitHub remains a repository/persistence layer and is not the execution host.
"""
from fnmatch import fnmatch
from pathlib import Path
import subprocess
import sys

CATALOGUE_FILE = Path("repository-catalogue.md")
FILES_START = "<!-- CATALOGUE-FILES:START -->"
FILES_END = "<!-- CATALOGUE-FILES:END -->"
DYNAMIC_START = "<!-- CATALOGUE-DYNAMIC-PATHS:START -->"
DYNAMIC_END = "<!-- CATALOGUE-DYNAMIC-PATHS:END -->"


def main() -> int:
    if not CATALOGUE_FILE.exists():
        print("CATALOGUE GATE: FAILED")
        print("repository-catalogue.md does not exist")
        return 1

    text = CATALOGUE_FILE.read_text(encoding="utf-8")
    required_markers = [FILES_START, FILES_END, DYNAMIC_START, DYNAMIC_END]
    missing_markers = [marker for marker in required_markers if marker not in text]
    if missing_markers:
        print("CATALOGUE GATE: FAILED")
        print("Catalogue machine-readable markers are missing:")
        for marker in missing_markers:
            print(f"  - {marker}")
        return 1

    files_section = text.split(FILES_START, 1)[1].split(FILES_END, 1)[0]
    catalogue_files = {line.strip() for line in files_section.splitlines() if line.strip()}

    dynamic_section = text.split(DYNAMIC_START, 1)[1].split(DYNAMIC_END, 1)[0]
    dynamic_patterns = [line.strip() for line in dynamic_section.splitlines() if line.strip()]

    result = subprocess.run(["git", "ls-files"], check=True, capture_output=True, text=True)
    repository_files = {line.strip() for line in result.stdout.splitlines() if line.strip()}

    def is_dynamic(path: str) -> bool:
        return any(fnmatch(path, pattern) for pattern in dynamic_patterns)

    static_repository_files = {path for path in repository_files if not is_dynamic(path)}
    dynamic_repository_files = {path for path in repository_files if is_dynamic(path)}

    missing_from_catalogue = static_repository_files - catalogue_files
    missing_from_repository = catalogue_files - repository_files

    print(f"Repository files        : {len(repository_files)}")
    print(f"Static catalogue files  : {len(catalogue_files)}")
    print(f"Dynamic artifact files  : {len(dynamic_repository_files)}")
    print(f"Dynamic path patterns    : {len(dynamic_patterns)}")

    failed = False
    if missing_from_catalogue:
        failed = True
        print("\nStatic files present in repository but missing from catalogue:")
        for path in sorted(missing_from_catalogue):
            print(f"  + {path}")

    if missing_from_repository:
        failed = True
        print("\nStatic catalogue entries missing from repository:")
        for path in sorted(missing_from_repository):
            print(f"  - {path}")

    if failed:
        print("\nCATALOGUE GATE: FAILED")
        return 1

    if dynamic_repository_files:
        print("\nControlled dynamic artifacts:")
        for path in sorted(dynamic_repository_files):
            print(f"  * {path}")

    print("\nCATALOGUE GATE: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
