# itm-infinity-aios-studio

> AIOS Studio — Visual dashboard + headless SDK for the AIOS framework.

[![npm version](https://img.shields.io/badge/npm-v0.1.0-violet.svg)](https://www.npmjs.com/package/itm-infinity-aios-studio)
[![CI](https://img.shields.io/badge/ci-pending-lightgrey.svg)](https://github.com/matheusallvarenga/itm-infinity-aios-studio/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![React 18](https://img.shields.io/badge/react-18.2-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/typescript-5.2-3178C6.svg)](https://www.typescriptlang.org)

## Overview

AIOS Studio is a **dual-surface** package (UI + SDK) that gives any TypeScript
application a window into the AIOS (AI-Orchestrated) stack. It ships a drop-in
React experience for human operators and a headless SDK for background services,
CLI tools, and sibling studios that need to read metrics, move stories, or
trigger workflows programmatically.

- **UI** — `AIOSLayout` + 5 views (Dashboard, Kanban, Agents Explorer, Squads Browser, Workflow Runner).
- **SDK** — Namespaced async modules (`metrics`, `stories`, `agents`, `squads`, `workflows`) backed by Supabase.
- **Integration-first** — Built to mount as a submodule inside [itm-legendary-infinity-os](https://github.com/matheusallvarenga/itm-legendary-infinity-os), but fully standalone.

## Features

| Surface | Capability | Entry |
|---------|------------|-------|
| UI | **Dashboard** — KPI grid, trend charts, top agents | `DashboardHome` |
| UI | **Kanban** — drag-and-drop story board with detail drawer | `StoriesKanban` |
| UI | **Agents Explorer** — filterable grid of AIOS agents + command reference | `AgentsGrid` |
| UI | **Squads Browser** — packaged squad catalogue with manifests | `SquadsGrid` |
| UI | **Workflow Runner** — trigger workflows + real-time history | `WorkflowsList` |
| SDK | **metrics** — overview, trends, top agents | `metrics.*` |
| SDK | **stories** — CRUD + status transitions | `stories.*` |
| SDK | **agents** — registry lookup + commands | `agents.*` |
| SDK | **squads** — package browsing | `squads.*` |
| SDK | **workflows** — trigger, status, history | `workflows.*` |

## Installation

```bash
npm install itm-infinity-aios-studio
# or
pnpm add itm-infinity-aios-studio
# or
yarn add itm-infinity-aios-studio
```

Peer dependencies: `react@^18.2.0`, `react-dom@^18.2.0`.

## Quick Start (UI)

Mount the full studio in three lines. The singleton Supabase client is created
once; every view below consumes it transparently.

```tsx
import { createAIOSClient } from 'itm-infinity-aios-studio'
import { AIOSLayout, AIOSTopbar, DashboardHome } from 'itm-infinity-aios-studio/ui'
import 'itm-infinity-aios-studio/dist/style.css'  // or use your own Tailwind pipeline

createAIOSClient({
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
})

export default function MyApp() {
  return (
    <AIOSLayout topbar={<AIOSTopbar title="AIOS" />}>
      <DashboardHome />
    </AIOSLayout>
  )
}
```

Swap `<DashboardHome />` for `<StoriesKanban />`, `<AgentsGrid />`,
`<SquadsGrid />`, or `<WorkflowsList />` — or compose your own router to switch
views inside `AIOSLayout`.

## Quick Start (SDK)

Use AIOS from anywhere TypeScript runs — Node scripts, Deno edge functions,
background workers, or another React app. No DOM, no rendering required.

```ts
import {
  createAIOSClient,
  metrics,
  stories,
  workflows,
} from 'itm-infinity-aios-studio/sdk'

createAIOSClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
})

const overview = await metrics.getOverview()
console.log(`Success rate: ${overview.successRate}%`)

const story = await stories.create({
  title: 'Investigate auth regression',
  epic: 'reliability',
  priority: 'high',
})

const run = await workflows.trigger({
  workflow_name: 'story-development-cycle',
  params: { story_id: story.id },
})
console.log(`Workflow run ${run.id} queued.`)
```

## API Reference (SDK)

All functions return native `Promise`s and throw typed `SDKError`s on failure.

### Client Management

| Export | Signature | Description |
|--------|-----------|-------------|
| `createAIOSClient(config)` | `(config: AIOSClientConfig) => SupabaseClient` | Creates the singleton client. Call once at startup. |
| `getAIOSClient()` | `() => SupabaseClient` | Returns the current singleton (throws if not initialised). |
| `resetAIOSClient()` | `() => void` | Disposes the singleton (useful in tests). |

### `metrics`

| Function | Returns |
|----------|---------|
| `metrics.getOverview(period?)` | `MetricsOverview` — totals, success rate, tokens, cost. |
| `metrics.getTrends(options?)` | `MetricsTrendPoint[]` — time-series for charts. |
| `metrics.getTopAgents(limit?)` | `AgentPerformance[]` — ranked agent stats. |

### `stories`

| Function | Returns |
|----------|---------|
| `stories.list(options?)` | `Story[]` — with filter / pagination. |
| `stories.get(id)` | `Story` |
| `stories.create(input)` | `Story` |
| `stories.updateStatus(id, status)` | `Story` — kanban column moves. |
| `stories.update(id, patch)` | `Story` |
| `stories.remove(id)` | `void` |

### `agents`

| Function | Returns |
|----------|---------|
| `agents.list(options?)` | `Agent[]` |
| `agents.getByName(name)` | `Agent` |
| `agents.getCommands(name)` | `AgentCommand[]` |

### `squads`

| Function | Returns |
|----------|---------|
| `squads.list(options?)` | `Squad[]` |
| `squads.getByName(name)` | `Squad` |

### `workflows`

| Function | Returns |
|----------|---------|
| `workflows.list(options?)` | `Workflow[]` |
| `workflows.getByName(name)` | `Workflow` |
| `workflows.trigger(input)` | `WorkflowRun` |
| `workflows.getStatus(runId)` | `WorkflowRun` |
| `workflows.getHistory(options?)` | `WorkflowRun[]` |

## UI Components

Imported from `itm-infinity-aios-studio/ui`:

| Component | Description |
|-----------|-------------|
| `AIOSLayout` | Sidebar + topbar shell; slots for page content. |
| `AIOSTopbar` | Title, breadcrumbs, user actions. |
| `AIOSSidebar` | Navigation across the five views. |
| `DashboardHome` | Full dashboard page (metrics + trends + top agents). |
| `MetricsGrid` | KPI cards. |
| `TrendsChart` | Time-series chart (Recharts). |
| `TopAgentsCard` | Leaderboard of agents by volume. |
| `StoriesKanban` | Drag-and-drop board (`@dnd-kit`). |
| `StoryCard` / `StoryDetail` / `KanbanColumn` | Sub-components if you need a custom board. |
| `AgentsGrid` / `AgentCard` / `AgentDetail` | Agents browsing UI. |
| `SquadsGrid` / `SquadCard` / `SquadDetail` | Squads browsing UI. |
| `WorkflowsList` / `WorkflowCard` / `RunDialog` / `WorkflowHistory` | Workflow triggering UI. |

All primitives (`Button`, `Card`, `Input`, `Badge`, etc.) are also exported
under the same path for consistent styling in host apps.

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL (demo app). | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (demo app). | `eyJ...` |

In production, pass the same values through `createAIOSClient({...})` using
whichever env variable convention your host app prefers (`process.env.*`,
`import.meta.env.*`, Next.js `NEXT_PUBLIC_*`, etc.).

See `.env.example` for the dev/demo defaults.

## Database Schema

The package ships the DDL for the tables it owns in `supabase/migrations/`:

- `aios_stories` — story-driven development backlog.
- `aios_workflow_runs` — workflow execution telemetry.

It also **reads** (but does not own) existing tables in the INTENTUM Supabase
project: `unified_metrics`, `unified_executions`, `unified_learnings`. Those
are provisioned by the host app.

See [docs/integration.md](./docs/integration.md) for the full contract and
migration workflow.

## Integration with itm-legendary-infinity-os

AIOS Studio is designed to mount as a **git submodule** inside
`itm-legendary-infinity-os`, exposing its UI as a dedicated
`section: 'aios'` (violet theme) while also serving SDK calls from background
services in other studios.

Full 10-point integration contract:
[docs/integration.md](./docs/integration.md)

## Stack

- **React 18.2** + **TypeScript 5.2**
- **Vite 5** (library mode via `vite-plugin-dts`)
- **Tailwind CSS 3.4** with a scoped `aios-*` token layer
- **Supabase JS 2.87** for data access
- **Recharts 3** for time-series visualisations
- **@dnd-kit** for the kanban board
- **Framer Motion 12** for micro-interactions
- **Vitest 1** + **@testing-library/react** for tests
- **ESLint + Prettier + prettier-plugin-tailwindcss** for code style

## Development

```bash
# Install
npm install

# Run the demo app (src/demo/App.tsx) on http://localhost:5173
npm run dev

# Build the library (dist/)
npm run build

# Tests
npm run test            # one-shot
npm run test:watch      # watch mode
npm run test:ui         # browser runner

# Static checks
npm run typecheck       # tsc --noEmit
npm run lint            # eslint .
npm run format          # prettier --write
```

Environment setup:

```bash
cp .env.example .env
# edit VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

## Contributing

Bug reports and pull requests are welcome. Before opening a PR please read
[CONTRIBUTING.md](./CONTRIBUTING.md) and make sure:

- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run test` passes.
- Commits follow the [Conventional Commits](https://www.conventionalcommits.org/) spec.

Architecture decisions are recorded in [docs/adr/](./docs/adr/).

## License

MIT — © Matheus Allvarenga. See [LICENSE](./LICENSE).
