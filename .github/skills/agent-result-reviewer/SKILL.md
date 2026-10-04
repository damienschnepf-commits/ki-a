---
name: agent-result-reviewer
description: Use after a VS Code agent reports completion to judge its commit, diff, tests, and PR against the original assignment.
---

# Agent Result Reviewer

Review the result against the original handoff, not against a newly invented scope. Inspect the repository state and the agent's reported branch, commit, diff, tests, and PR (if one exists). Verify evidence directly where repository access permits.

## Review procedure

1. Retrieve the original assignment, including its acceptance criteria, allowed files, exclusions, tests, and abort conditions.
2. Identify the exact change under review: branch/base, commit(s), working-tree diff, and PR. Distinguish agent changes from pre-existing changes; do not attribute unrelated edits to the agent.
3. Check that changed files and behavior stay within the authorized scope and satisfy each acceptance criterion.
4. Read the relevant implementation and tests for correctness, regressions, error handling, and consistency with existing project patterns. Do not infer correctness solely from a green test report.
5. Verify the reported targeted tests/checks when feasible. Report unavailable checks and their impact explicitly; never claim a test passed without evidence.
6. Check that documentation and project status/backlog updates required by the assignment are accurate and included.
7. Return exactly one verdict: **passt**, **nacharbeiten**, or **stoppen**.

## Verdicts

- **passt** — the authorized scope and acceptance criteria are met, with adequate evidence and no material blocker.
- **nacharbeiten** — the work is safe to continue but has concrete, bounded gaps. List the exact corrections and verification needed; do not silently broaden the original handoff.
- **stoppen** — the change violates a boundary, has a serious unresolved risk, lacks a required approval/prerequisite, or cannot be safely evaluated. State the blocking evidence and what must be decided or supplied before continuing.

Keep the conclusion decisive and evidence-based. If repository access is unavailable, say which claims could not be verified and do not give **passt** on the basis of an agent's assertion alone.
