---
name: vscode-agent-handoff
description: Use to turn an approved KI-A/Terra decision into a bounded, actionable assignment for the right-hand VS Code agent.
---

# VS Code Agent Handoff

Create a handoff only after the requested decision and project context have been checked. The handoff should let the receiving agent act within a clear boundary and return evidence, without guessing at missing requirements.

## Prepare the assignment

1. State the agreed decision and desired outcome in one or two sentences.
2. Name the relevant repository, branch or base revision when verified, and the exact files or areas expected to change. Mark uncertain paths as candidates to inspect, not guaranteed targets.
3. Separate permitted inspection from permitted edits. Explicitly list out-of-scope areas and preserve unrelated working-tree changes.
4. Translate the goal into observable acceptance criteria. Include required behavior, constraints, and any documentation or compatibility requirements.
5. Specify focused tests or checks, plus any broader test that is needed. Ask the agent to report commands run and their actual results.
6. Set an abort condition for missing prerequisites, contradictory instructions, unexpected scope expansion, risky data changes, or a need for human approval.
7. Require a return at completion or immediately on abort, including the commit/branch or uncommitted diff, changed files, test evidence, known gaps, and any requested decision.

## Handoff format

```text
Decision/context:
Goal:
Repository and verified base:
Files/areas to inspect:
Files/areas the agent may edit:
Out of scope:
Acceptance criteria:
Tests/checks:
Abort if:
Report back when:
Return with:
```

Keep the scope as small as possible while still meeting the decision. Do not delegate work that is already complete, expand the assignment into unrelated cleanup, or describe an unverified branch or file state as fact.
