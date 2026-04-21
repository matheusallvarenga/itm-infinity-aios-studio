# ADR-001: Dual Surface Architecture (UI + SDK)

**Status**: Accepted
**Date**: 2026-04-21
**Deciders**: Matheus Allvarenga

## Context

AIOS Studio needs to serve two distinct audiences that converge on the same
data:

1. **Human operators** who want a visual dashboard to browse stories, agents,
   squads and run workflows.
2. **Other studios and automated services** (Learn Studio, Ops Studio, CLI
   tools, background workers) that need to create stories, trigger workflows,
   or query metrics without rendering anything.

A UI-only package would force every consumer to render the studio in a hidden
iframe or copy-paste Supabase queries into their own code — both fragile.
A headless-only package would require every human-facing usage to reinvent
the layout, kanban, and charts.

The package is also designed to be mounted as a git submodule inside
`itm-legendary-infinity-os`, which imposes two constraints:

- Bundle size matters (tree-shaking across consumers).
- A single Supabase client must be shared between UI and SDK — duplicating
  auth state would break realtime subscriptions and RLS assumptions.

## Decision

Expose **two entry points** from a single npm package, plus a root entry
that re-exports both for convenience:

| Entry | Path | Exports |
|-------|------|---------|
| Root | `itm-infinity-aios-studio` | Namespaces: `sdk.*`, `ui.*` |
| SDK | `itm-infinity-aios-studio/sdk` | `createAIOSClient`, `metrics`, `stories`, `agents`, `squads`, `workflows`, types |
| UI | `itm-infinity-aios-studio/ui` | React components (`AIOSLayout`, `DashboardHome`, `StoriesKanban`, ...) + theme CSS |

The Supabase client is a **process-wide singleton**, created by
`createAIOSClient(config)` and retrieved by `getAIOSClient()`. Both UI and
SDK go through the same singleton, guaranteeing consistent auth, realtime, and
caching behaviour.

Shared TypeScript types (`Story`, `Agent`, `Squad`, `Workflow`, ...) live in
`src/sdk/types.ts` and are re-exported by both surfaces.

## Rationale

- **UI is for end-users** visualising the AIOS stack.
- **SDK is for other studios/services** consuming AIOS programmatically.
- **Shared types** ensure a refactor propagates everywhere — no
  stringly-typed DTOs.
- **Single Supabase client** (singleton pattern) avoids duplicated JWT
  state, duplicate realtime channels, and inconsistent RLS behaviour.
- **SDK works in ANY TS/JS environment** — Node, Deno, Bun, browser, edge
  functions — because it has zero React or DOM dependencies.
- **Consumers import only what they need** — a background worker that
  just calls `workflows.trigger()` ships 6 kB of SDK, not the 400 kB of
  recharts + dnd-kit + framer-motion that ship with the UI bundle.

## Consequences

### Positive

- Reusable in background jobs, CLI tools, Next.js server actions, edge
  functions, and sibling studios.
- Tests for business logic can focus on logic without rendering (SDK unit
  tests in Vitest, no jsdom overhead for pure SDK paths).
- Bundle splitting — the two entries hit separate chunks, so consumers
  only ship what they import.
- Clear layering: **UI -> SDK -> Supabase**. The UI layer never calls
  Supabase directly (enforced by lint rule in a future PR).

### Negative

- Must maintain **two entry points** in `package.json` `exports` map, each
  with its own `import`/`require`/`types` triplet.
- Type definitions must be carefully designed to be shareable between
  surfaces — no React-only types may leak into SDK type exports.
- **Documentation doubles** — quick-start examples for both surfaces, API
  reference split between SDK and UI component sections.
- Slightly higher build complexity (`vite.config.ts` declares multiple
  library entries; `tsc` must emit three `.d.ts` files).

### Neutral

- The root entry (`import ... from 'itm-infinity-aios-studio'`) exposes
  both surfaces as namespaces (`sdk.*`, `ui.*`) for convenience. Tree
  shakers still drop the unused half, so no bundle cost penalty.

## Alternatives Considered

1. **UI only** — Simpler package, but LegendaryOS background services
   would have to either (a) re-implement Supabase queries, or (b) render
   invisible React components to use AIOS. Both break the clean
   cross-studio contract.

2. **SDK only** — Forces every consumer to build their own dashboard,
   kanban, and charts. Violates DRY across studios and makes product
   iteration dramatically slower.

3. **Monolithic export (single entry, no `./sdk` / `./ui` split)** —
   Works, but every consumer pays the UI dependency cost
   (`recharts`, `@dnd-kit`, `framer-motion`) even when they only need
   `stories.create()`. Harder to tree-shake, larger bundles, slower
   cold-start in edge runtimes.

4. **Two separate packages** (`@itm/aios-sdk` + `@itm/aios-ui`) —
   Considered but rejected: requires publishing two npm packages in
   lockstep, two release cadences, two changelogs, and version-skew
   risk between SDK and UI. The single-package dual-export pattern
   captures the benefits of separation without the coordination cost.

## References

- Plan file: `/Users/matheusallvarenga/.claude/plans/itm-infinity-aios-studio.md`
- LegendaryOS pattern: `components/ops/`, `components/studio/`
- package.json exports map: [package.json](../../package.json) (`exports` field)
- SDK entry: [src/sdk/index.ts](../../src/sdk/index.ts)
- UI entry: [src/ui/index.ts](../../src/ui/index.ts)
- Root entry: [src/index.ts](../../src/index.ts)
