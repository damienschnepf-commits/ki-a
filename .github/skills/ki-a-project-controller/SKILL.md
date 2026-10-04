---
name: ki-a-project-controller
description: Use before substantial KI-A/Terra work to establish the current repository, project instructions, backlog, and next safe step.
---

# KI-A Project Controller

Use this skill before starting a substantial change and again before each materially different phase. The purpose is to work from the current project state, not from chat memory or an assumed architecture.

## Procedure

1. Check the local repository root, current branch, working-tree status, and relevant diff. Preserve pre-existing user changes; do not reset, overwrite, or silently absorb them.
2. Read the applicable `AGENTS.md` files from the repository root down to the target files. Resolve conflicting guidance in favor of the most specific applicable instructions and report unresolved conflicts.
3. Inspect the actual backlog and current project-status/roadmap sources. Confirm the item, status, owner, acceptance criteria, and dependencies. Never invent a backlog item or present remembered status as current.
4. Read files directly related to the requested change and any recent changes that can affect it. Check their current local contents, not just a remote or remembered copy.
5. Reconcile local state with the repository's declared source of truth when relevant. State which source and revision were checked. Do not switch branches, fetch, pull, push, or create commits unless requested or required by an explicitly authorized workflow.
6. Summarize the verified context and choose exactly the next concrete step. For work spanning phases, repeat this check before moving to the next phase.

## Output

Keep the checkpoint concise:

- **Verified:** branch/revision, relevant instructions, backlog item/status, and pertinent changes.
- **Unclear or blocked:** missing sources, conflicting facts, or required approval.
- **Next step:** one specific action and its expected result.

Do not propose replacement architecture when the current project already defines a structure. If the local repository cannot be inspected, say so and do not claim its status is verified.
