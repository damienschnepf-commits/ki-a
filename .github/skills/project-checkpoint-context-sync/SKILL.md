---
name: project-checkpoint-context-sync
description: Use to produce or update a compact, evidence-based KI-A/Terra checkpoint for another chat, Terra, or a collaborating agent.
---

# Project Checkpoint / Context Sync

Create a checkpoint from current, inspectable sources so another session can resume without treating stale chat context as project truth. Keep it compact, dated, and explicit about what remains unverified.

## Gather and reconcile

1. Inspect the current repository root, branch, revision, working-tree status, and relevant diff. Preserve and identify existing local changes.
2. Read applicable `AGENTS.md` files, the current backlog item(s), and the project status/roadmap. Confirm the source and revision/date for each status claim.
3. Include only files, decisions, tests, and agent results relevant to the active work. Resolve contradictions against the latest authoritative project evidence; if unresolved, record both claims and mark the conflict.
4. Separate implemented and verified facts from planned work, open acceptance, assumptions, and stale/historical context. A local mock or unit test does not prove an external service, database, device, or deployment is accepted.
5. Update the repository's existing checkpoint/status location only when that is the established workflow and updating it is within scope. Otherwise provide the checkpoint in the requested handoff or conversation; do not invent a parallel status file or new tracking system.

## Checkpoint format

```text
Stand: YYYY-MM-DD
Project / source of truth:
Repository / branch / revision:
Working tree:
Current phase and backlog item:
Verified implementation and test evidence:
Open acceptance / dependencies:
Decisions and constraints:
Relevant files or PR:
Next concrete step:
```

Use short, dated statements and link to existing project records where possible. Do not include secrets, unnecessary personal data, or conclusions that cannot be traced to current evidence. When local state or a source cannot be checked, mark it **unverified** rather than filling the gap from memory.
