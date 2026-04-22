# Changelog

All notable changes to itm-infinity-aios-studio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-04-22

### Added
- **Storybook 8** (`@storybook/react-vite`) with dark-theme preview defaults (`#0f0f13`)
- 8 primitive story files covering all UI primitives: Button, Badge, Card, Dialog, Icon, Input, Select, Skeleton
- **Playwright E2E** test suite (`@playwright/test`) with 15 tests across 5 views (Dashboard, Agents, Kanban, Squads, Workflows)
- GitHub Actions CI pipeline — `quality` job (lint → typecheck → test → build → build-storybook on Node 18+20) + `e2e` job (Playwright Chromium on Node 20)
- `docs/adr/003-metrics-semantic-proxy.md` — documents column mapping from phantom `unified_*` tables to existing `aios_workflow_runs`
- `playwright.config.ts` with Vite preview server (`npm run preview`, port 4173)

### Changed
- **`src/sdk/metrics.ts`** fully rewritten to query `aios_workflow_runs` (semantic proxy per ADR-003); removes phantom `unified_metrics` / `unified_executions` references; `duration_ms` computed in JS from `completed_at - started_at`
- **`src/sdk/types.ts`** — `Execution.status` now typed as `WorkflowRunStatus` instead of `'success' | 'failure' | 'partial'`
- `tsconfig.json` — excludes `tests/e2e`, `**/*.stories.tsx`, `.storybook` from TypeScript compilation
- `vite.config.ts` — excludes `**/*.stories.tsx` and `tests/e2e/**` from Vitest test collection

### Fixed
- Vitest collecting `*.stories.tsx` files that don't export test suites (caused 5 collection errors)
- TypeScript errors from `@playwright/test` import in e2e specs
- Mock chain in `tests/sdk/metrics.test.ts` — `lte()` now correctly returns a Promise via `mockResolvedValue` (was `mockReturnValue`)

## [0.1.1] - 2026-04-22

### Added
- ADR-002 documenting dual-Supabase project configuration support
- Story 0.1.1 tracking the post-delivery verification finding
- `docs/integration.md §3.11` with 4-var `.env.example` and precedence table
- Bootstrap snippet in `docs/integration.md §3.8` now reads
  `VITE_AIOS_SUPABASE_URL` / `VITE_AIOS_SUPABASE_ANON_KEY` first, falling back
  to host `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`

### Changed
- ADR-001 status line annotated with partial supersede by ADR-002
- `docs/adr/README.md` index lists ADR-002
- `docs/examples/learn-studio-integration.md` references ADR-002 and notes
  the new precedence in its bootstrap assumption block

### Notes
- **No SDK runtime changes** — `createAIOSClient({ supabaseUrl, supabaseAnonKey })`
  signature is unchanged. This release is docs-only inside the submodule; the
  host (`itm-legendary-infinity-os`) is where the env-var precedence is applied.
- Non-breaking for v0.1.0 consumers using single-project mode.

## [0.1.0] - 2026-04-21

### Added
- Initial scaffolding (Vite 5 library mode + React 18 + TypeScript 5.2 + Tailwind 3.4)
- SDK with 6 headless modules (metrics, stories, agents, squads, workflows, client)
- Static registries: 12 AIOS agents, 10 squads, 16 workflows
- UI primitives: Button, Card, Badge, Dialog, Input, Select, Skeleton, Icon
- Layout: AIOSLayout, AIOSTopbar, AIOSSidebar
- Views: DashboardHome, StoriesKanban, AgentsGrid, SquadsGrid, WorkflowsList
- Supabase DDL for aios_stories + aios_workflow_runs tables
- Dual surface architecture (ui + sdk exports)
- Demo app at src/demo/
- 49 passing tests (Vitest)
- Violet palette design system
- Dark-first mode with HSL CSS variables
- Documentation (README, integration.md, ADR-001, CONTRIBUTING)

### Infrastructure
- GitHub Actions CI (lint, typecheck, test, build on Node 18 + 20)
- PR validation workflow
- Release workflow (semver tags)
- Dependabot weekly updates
- Issue + PR templates

[Unreleased]: https://github.com/matheusallvarenga/itm-infinity-aios-studio/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/matheusallvarenga/itm-infinity-aios-studio/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/matheusallvarenga/itm-infinity-aios-studio/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/matheusallvarenga/itm-infinity-aios-studio/releases/tag/v0.1.0
