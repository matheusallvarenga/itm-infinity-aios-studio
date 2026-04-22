# Story 0.1.1 — Dual-Supabase Config Support

**Status**: Done
**Version target**: v0.1.1
**Epic**: integration-hardening
**Priority**: high
**Created**: 2026-04-22
**Closed**: 2026-04-22
**Driver**: Matheus Allvarenga
**Discovered via**: Post-delivery verification session (see
[`sessions/2026/04-April/2026-04-22/2026-04-22-itm-infinity-aios-studio-Post-Delivery-Verification-Report.md`](../../../../claude-code/sessions/2026/04-April/2026-04-22/2026-04-22-itm-infinity-aios-studio-Post-Delivery-Verification-Report.md))

---

## Problem

The v0.1.0 integration assumed the host app (LegendaryOS) and the AIOS Studio
SDK would point to the **same** Supabase project. Verification on 2026-04-22
exposed the gap:

- LegendaryOS production Supabase holds `user_profiles`, `user_roles`, `roles`,
  `v_books_pt`, subscription/plan tables, RPCs, and the RLS model for end-user
  auth.
- AIOS Studio tables (`aios_stories`, `aios_workflow_runs`) were provisioned in
  **INTENTUM** (`lqevhazsgtxsiqcdchfq`), the Claude Code Config project, not in
  the LegendaryOS production DB.

Wiring `VITE_SUPABASE_URL` to INTENTUM broke LegendaryOS (RBAC/subscription
queries 404'd against a schema that does not exist there). Wiring it to
LegendaryOS's real project made AIOS views hit a DB without the
`aios_*` tables.

Root cause: a **single env-var pair** cannot serve two Supabase projects.

## Acceptance Criteria

- [x] **AC1** — `createAIOSClient(config)` continues to accept an explicit
  `{ supabaseUrl, supabaseAnonKey }` pair. No breaking change to the SDK
  public API.
- [x] **AC2** — The canonical host bootstrap snippet (documented in
  `docs/integration.md §3.8`) prefers `VITE_AIOS_SUPABASE_URL` /
  `VITE_AIOS_SUPABASE_ANON_KEY` when present, and falls back to the host's
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` when absent. This preserves
  compatibility with single-project setups.
- [x] **AC3** — An ADR records the decision, supersedes the section of ADR-001
  that implied "single Supabase project" usage, and lists rejected
  alternatives.
- [x] **AC4** — `docs/integration.md` gains a new section that documents the
  dual-Supabase configuration with a 4-variable `.env.example`.
- [x] **AC5** — `docs/examples/learn-studio-integration.md` references the
  dual-config pattern in its bootstrap assumption block.
- [x] **AC6** — `CHANGELOG.md` records the v0.1.1 release.
- [x] **AC7** — `package.json` version bumps to `0.1.1`.
- [x] **AC8** — No change to runtime code is required inside this repo — all
  wiring happens in the host via documented env-var precedence. The SDK stays
  host-agnostic.
- [x] **AC9** — Release tag `v0.1.1` is pushed to GitHub, and LegendaryOS
  submodule pin is bumped to match.

## Tasks

- [x] T1 — Write `docs/adr/002-dual-supabase-config.md`
- [x] T2 — Update `docs/adr/README.md` index to list ADR-002
- [x] T3 — Add "§3.11 Dual-Supabase Configuration" to `docs/integration.md`
- [x] T4 — Update the bootstrap example in `docs/integration.md §3.8` with
  env-var precedence
- [x] T5 — Update `docs/examples/learn-studio-integration.md` bootstrap
  reference
- [x] T6 — Add `[0.1.1]` entry to `CHANGELOG.md`
- [x] T7 — Bump `package.json` `version` to `0.1.1`
- [x] T8 — Commit with conventional-commit subject + push
- [x] T9 — Tag `v0.1.1` + push tag
- [x] T10 — Host-side wiring in LegendaryOS (bootstrap + `.env.local` + pin
  bump + commit)
- [x] T11 — Visual verification with Playwright + screenshots in report

## File List

- `docs/stories/story-0.1.1-dual-supabase-split.md` (this file, NEW)
- `docs/adr/002-dual-supabase-config.md` (NEW)
- `docs/adr/README.md` (edit — index row)
- `docs/integration.md` (edit — new §3.11 + updated §3.8 bootstrap snippet)
- `docs/examples/learn-studio-integration.md` (edit — assumption block)
- `CHANGELOG.md` (edit — `[0.1.1]` section)
- `package.json` (edit — version bump)

## Non-goals

- No change to SDK runtime code — `createAIOSClient` already accepts explicit
  config; the problem is purely how the host calls it.
- No SDK-level env-var reading — SDK stays framework-agnostic and does not
  import `import.meta.env` itself.
- No new tests — the change is docs-only in this repo (host-side integration
  tests live in LegendaryOS).

## Definition of Done

- All AC boxes checked.
- `git log --oneline` shows a commit on `main` with subject
  `feat(config): support dual-Supabase project separation (v0.1.1)` or similar.
- `git tag -l` lists `v0.1.1`.
- LegendaryOS submodule pin reflects the new tag.
- Post-delivery verification report contains a "Visual Validation" section with
  screenshots of the 5 AIOS views rendered against real INTENTUM data.
