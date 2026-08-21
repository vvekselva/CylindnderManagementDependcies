#!/usr/bin/env python3

"""Generate a simple human-readable story from logs/automation-log.md.

This script intentionally summarizes only information that is already present
in the human-readable log. It does not inspect source code and it does not
invent missing facts.
"""

from pathlib import Path
import re

LOG_FILE = Path("logs/automation-log.md")
STORY_FILE = Path("logs/automation-story.md")

SECTION_NAMES = [
    "What I was asked to do",
    "Why this work was needed",
    "What I did",
    "What I found",
    "What is blocking progress",
    "Why I cannot safely continue",
    "Alternatives that can be considered",
    "Evidence",
    "Result",
    "What happens next",
]


def clean_text(value: str) -> str:
    value = re.sub(r"\s+", " ", value.strip())
    return value


def parse_event(block: str):
    heading = re.search(r"^## EVENT\s+(.+)$", block, re.MULTILINE)
    if not heading:
        return None

    event_id = heading.group(1).strip()
    if event_id.upper() == "EXAMPLE":
        return None

    metadata = {}
    for key in ["Time", "Workflow", "Job", "Worker", "Status", "Source baseline"]:
        match = re.search(rf"^{re.escape(key)}:\s*(.*)$", block, re.MULTILINE)
        metadata[key] = clean_text(match.group(1)) if match else "Not recorded"

    sections = {}
    for index, section in enumerate(SECTION_NAMES):
        start = f"### {section}"
        if start not in block:
            sections[section] = "Not recorded"
            continue

        part = block.split(start, 1)[1]
        next_positions = []
        for later in SECTION_NAMES[index + 1 :]:
            marker = f"### {later}"
            pos = part.find(marker)
            if pos >= 0:
                next_positions.append(pos)
        if next_positions:
            part = part[: min(next_positions)]
        sections[section] = clean_text(part)

    return {
        "id": event_id,
        "metadata": metadata,
        "sections": sections,
    }


def read_events(text: str):
    starts = [m.start() for m in re.finditer(r"^## EVENT\s+", text, re.MULTILINE)]
    events = []
    for i, start in enumerate(starts):
        end = starts[i + 1] if i + 1 < len(starts) else len(text)
        event = parse_event(text[start:end])
        if event:
            events.append(event)
    return events


def build_story(events):
    if not events:
        return (
            "# CylinderManagement Automation Story\n\n"
            "No real automation events have been recorded yet.\n"
        )

    lines = [
        "# CylinderManagement Automation Story",
        "",
        "This story was generated from `logs/automation-log.md`.",
        "It repeats only facts already recorded in that log.",
        "",
        "## What happened",
        "",
    ]

    for event in events:
        meta = event["metadata"]
        sec = event["sections"]
        lines.append(
            f"### {event['id']} - {meta['Status']} - {meta['Worker']}"
        )
        lines.append("")
        lines.append(
            f"The worker was asked to {sec['What I was asked to do'].rstrip('.')}\. "
            f"It did the following: {sec['What I did']}"
        )
        lines.append("")
        lines.append(f"What it found: {sec['What I found']}")
        lines.append("")

        blocker = sec["What is blocking progress"]
        if blocker.lower() not in {"nothing", "none", "not applicable", "not recorded"}:
            lines.append(f"What is blocking progress: {blocker}")
            lines.append("")
            lines.append(
                f"Why the worker stopped: {sec['Why I cannot safely continue']}"
            )
            lines.append("")
            lines.append(
                f"Alternatives that can be considered: {sec['Alternatives that can be considered']}"
            )
            lines.append("")

        lines.append(f"Result: {sec['Result']}")
        lines.append("")
        lines.append(f"Next: {sec['What happens next']}")
        lines.append("")

    statuses = {}
    for event in events:
        status = event["metadata"]["Status"]
        statuses[status] = statuses.get(status, 0) + 1

    lines.extend(["## Overall event summary", ""])
    for status in sorted(statuses):
        lines.append(f"- {status}: {statuses[status]}")

    lines.append("")
    lines.append(
        "Blocked, partial and unresolved work remains visible until a later log event records how it was resolved."
    )
    lines.append("")
    return "\n".join(lines)


def main():
    if not LOG_FILE.exists():
        raise SystemExit(f"Missing required log file: {LOG_FILE}")

    events = read_events(LOG_FILE.read_text(encoding="utf-8"))
    STORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    STORY_FILE.write_text(build_story(events), encoding="utf-8")
    print(f"Generated {STORY_FILE} from {len(events)} automation event(s).")


if __name__ == "__main__":
    main()
