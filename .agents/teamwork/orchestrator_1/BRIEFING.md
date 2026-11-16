# BRIEFING — 2026-11-15T10:49:00Z

## Mission
Orchestrate the development and verification of the three-tab buyer profile page (Account Info, Addresses, Orders & Payments) with full mobile responsiveness down to 360px and zero regressions.

## 🔒 My Identity
- Archetype: orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: j:\dev\projects\fine-shop\.agents\teamwork\orchestrator_1
- Original parent: Sentinel
- Original parent conversation ID: 498ebc9e-36b5-47e7-8dc5-fc4e561d2715

## 🔒 My Workflow
- **Pattern**: Project Pattern
- **Scope document**: j:\dev\projects\fine-shop\.agents\teamwork\PROJECT.md
1. **Decompose**: Survey codebase, inventory features, break down into milestones or direct iteration loop.
2. **Dispatch & Execute**:
   - Survey: Spawn 3 Explorers in parallel to map full scope, existing profile components, tabs UI component, address/order services and types.
   - Decompose / Iterate: Formulate PROJECT.md, dispatch worker to implement, reviewers and challengers to verify, auditor for integrity check.
3. **On failure**:
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: Threshold at 16 spawns, write handoff.md, spawn successor.
- **Work items**:
  1. Survey and Scope Mapping [in-progress]
  2. Implementation: 3-tab layout and components [pending]
  3. Mobile responsive optimization & styling [pending]
  4. Verification: typecheck, build, test, browser verification [pending]
  5. Audit & Final Review [pending]
- **Current phase**: 1 (Survey)
- **Current focus**: Surveying existing codebase and components via parallel Explorers

## 🔒 Key Constraints
- DISPATCH-ONLY: NEVER write, modify, or create source code directly.
- NEVER run build/test commands directly — workers must run them.
- Follow AGENTS.md conventions (Next.js 16, `@base-ui/react/tabs`, TanStack Query, Lucide icons, etc.).
- Strictly English comments only in code (NO Persian comments).
- Tab triggers and panels must work seamlessly down to 360px viewport without horizontal scroll.
- Audit is a binary veto: clean audit required.
- Never reuse a subagent after handoff.

## Current Parent
- Conversation ID: 498ebc9e-36b5-47e7-8dc5-fc4e561d2715
- Updated: 2026-11-15T10:49:00Z

## Key Decisions Made
- Project Orchestrator initialized.
- Using 3 parallel explorers for initial survey per Project Pattern Step 0.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|

## Succession Status
- Succession required: no
- Spawn count: 0 / 16
- Pending subagents: none
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: c8b538e3-1c2c-4b2f-ab4f-807095cc0ad0/task-17
- Safety timer: none
- On succession: kill all timers before spawning successor
- On context truncation: run `manage_task(Action="list")` — re-create if missing

## Artifact Index
- j:\dev\projects\fine-shop\.agents\teamwork\ORIGINAL_REQUEST.md — User request specification
- j:\dev\projects\fine-shop\.agents\teamwork\orchestrator_1\DISPATCH.md — Parent dispatch instruction
- j:\dev\projects\fine-shop\.agents\teamwork\orchestrator_1\progress.md — Liveness & status tracking
- j:\dev\projects\fine-shop\.agents\teamwork\PROJECT.md — Global architecture and milestones
