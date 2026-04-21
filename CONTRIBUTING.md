# Contributing

Thanks for your interest in contributing to `itm-infinity-aios-studio`!
This guide covers the essentials: repo layout, dev setup, test workflow,
commit conventions, and the PR process.

## Repo Structure

```
itm-infinity-aios-studio/
├── src/
│   ├── index.ts              # Root entry (re-exports sdk + ui)
│   ├── lib/                  # Shared helpers (Supabase singleton, utils)
│   ├── sdk/                  # Headless TS SDK (6 modules + types)
│   ├── ui/                   # React components (5 views + primitives)
│   ├── styles/               # Tailwind + aios theme tokens
│   └── demo/                 # Local demo app used by `npm run dev`
├── supabase/
│   ├── migrations/           # DDL (shipped with the package)
│   └── seeds/                # Reference seed data
├── tests/                    # Vitest unit + integration tests
├── docs/                     # Integration guide, ADRs, examples
├── dist/                     # Build output (generated, git-ignored)
└── package.json
```

Key conventions:

- **UI never calls Supabase directly** — it goes through the SDK.
- **SDK has no React imports** — it must run in Node/Deno/Bun/Edge.
- **Shared types live in `src/sdk/types.ts`** and are re-exported by both
  surfaces.

## Dev Environment

Requirements: **Node 18+** and **npm 9+**.

```bash
# 1. Clone and install
git clone https://github.com/matheusallvarenga/itm-infinity-aios-studio.git
cd itm-infinity-aios-studio
npm install

# 2. Configure Supabase credentials for the demo app
cp .env.example .env
# edit VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Run the demo on http://localhost:5173
npm run dev
```

The demo app in `src/demo/` renders the full studio against the live
Supabase tables and is the fastest way to manually test a change.

## Running Tests

```bash
npm run test            # one-shot
npm run test:watch      # watch mode
npm run test:ui         # vitest browser runner
```

Before opening a PR **all three** of these must pass:

```bash
npm run typecheck
npm run lint
npm run test
```

Run them together with:

```bash
npm run typecheck && npm run lint && npm run test
```

## Commit Conventions

This repo uses [Conventional Commits](https://www.conventionalcommits.org/).
Examples:

```
feat(sdk): add stories.updateStatus helper
fix(ui): dnd drop zone misaligned on Safari
docs: document VITE_SUPABASE_URL env var
refactor(kanban): extract KanbanColumn into its own file
test(metrics): cover getTrends() pagination path
chore: bump typescript to 5.2.2
```

Scope is optional but preferred when the change is localized to a module
(`sdk`, `ui`, `kanban`, `dashboard`, `db`, `ci`, ...).

## Pull Request Process

1. **Fork and branch** — branch from `main` with a descriptive name:
   `feat/workflow-history-filters` or `fix/kanban-drop-safari`.
2. **Write/update tests** for any behaviour change.
3. **Run the full check suite** (`typecheck && lint && test`).
4. **Update docs** if you change a public API — the README table, an ADR,
   or `docs/integration.md` (§3 ten-point contract) as appropriate.
5. **Open the PR** with a clear description: what, why, screenshots if UI.
6. **Respond to review** — squash-and-merge is the default; keep the
   squashed commit message in Conventional Commits form.

## Adding a New ADR

If your change introduces a cross-cutting architectural decision, copy
the template from [docs/adr/README.md](./docs/adr/README.md) into a new
file `docs/adr/NNN-your-title.md` and link it from the ADR index.

## Releasing

Releases are cut from `main` with a semver tag (e.g. `v0.2.0`). The tag
triggers the npm publish workflow (coming in a future PR — see the
`Phase 7 CI/CD` milestone).

## Questions?

Open an issue on
[github.com/matheusallvarenga/itm-infinity-aios-studio/issues](https://github.com/matheusallvarenga/itm-infinity-aios-studio/issues)
or ping `@matheusallvarenga`.
