# Integration Guide — Mounting AIOS Studio in `itm-legendary-infinity-os`

This document is the authoritative 10-point contract for embedding
`itm-infinity-aios-studio` into the LegendaryOS monorepo as a mounted studio.

Audience: engineers integrating AIOS into LegendaryOS for the first time, or
upgrading the submodule after a new Studio release.

---

## 1. Overview — Dual-Location Model

AIOS Studio lives in **two physical locations** by design:

| Location | Role | Git status |
|----------|------|------------|
| `itm-infinity-aios-studio/` (this repo) | Source of truth. All development and releases happen here. | Independent repo. |
| `itm-legendary-infinity-os/studios/aios/` | Mounted submodule (read-only inside LegendaryOS). | Submodule pointer. |

This mirrors the pattern used by `studios/learn`, `studios/ops`, `studios/sales`
in LegendaryOS. Treat the LegendaryOS copy as a **consumer** — never edit files
there; make changes in this repo, push, and bump the submodule pointer.

> See [ADR-001: Dual Surface Architecture](./adr/001-dual-surface-architecture.md)
> for the rationale behind exporting both UI and SDK from the same package.

---

## 2. Adding the Submodule

From the LegendaryOS repo root:

```bash
# 1. Add the submodule at the canonical mount path
git submodule add \
  https://github.com/matheusallvarenga/itm-infinity-aios-studio.git \
  studios/aios

# 2. Pin it to the latest tag (recommended — avoids surprise upgrades)
cd studios/aios
git fetch --tags
git checkout v0.1.0
cd ../..

# 3. Stage and commit
git add .gitmodules studios/aios
git commit -m "feat(aios): mount itm-infinity-aios-studio as submodule"

# 4. Install + build from inside the submodule
cd studios/aios
npm install
npm run build
cd ../..
```

After this, anyone cloning LegendaryOS must run:

```bash
git clone --recursive https://github.com/matheusallvarenga/itm-legendary-infinity-os.git
# or, if already cloned:
git submodule update --init --recursive
```

---

## 3. Registering the Studio — 10-Point Contract

Every LegendaryOS studio mount must touch the following ten surfaces. Below are
the canonical code snippets.

### 3.1 — Section enum additions

`src/types/section.ts`:

```ts
export type Section =
  | 'learn'
  | 'ops'
  | 'sales'
  | 'aios'   // <-- add

export const SECTIONS: Section[] = ['learn', 'ops', 'sales', 'aios']
```

### 3.2 — Routes registration

`src/routes.ts`:

```ts
import { lazy } from 'react'

const AIOSRoutes = lazy(() => import('@/studios/aios/AppRoutes'))

export const routes: RouteDescriptor[] = [
  // ...existing
  {
    section: 'aios',
    path: '/aios/*',
    Component: AIOSRoutes,
    title: 'AIOS',
  },
]
```

### 3.3 — Nav structure registration

`src/config/navigation.ts`:

```ts
export const navigation: NavSection[] = [
  // ...existing entries
  {
    section: 'aios',
    label: 'aios.sidebar.title',
    icon: 'sparks',
    items: [
      { label: 'aios.sidebar.dashboard', href: '/aios' },
      { label: 'aios.sidebar.stories',   href: '/aios/stories' },
      { label: 'aios.sidebar.agents',    href: '/aios/agents' },
      { label: 'aios.sidebar.squads',    href: '/aios/squads' },
      { label: 'aios.sidebar.workflows', href: '/aios/workflows' },
    ],
  },
]
```

### 3.4 — Translations (PT + EN)

`src/i18n/pt-BR.json` and `src/i18n/en-US.json`:

```json
{
  "aios": {
    "sidebar": {
      "title": "AIOS",
      "dashboard": "Painel",
      "stories": "Estórias",
      "agents": "Agentes",
      "squads": "Squads",
      "workflows": "Workflows"
    },
    "topbar": {
      "title": "AIOS Studio"
    }
  }
}
```

EN mirror:

```json
{
  "aios": {
    "sidebar": {
      "title": "AIOS",
      "dashboard": "Dashboard",
      "stories": "Stories",
      "agents": "Agents",
      "squads": "Squads",
      "workflows": "Workflows"
    },
    "topbar": {
      "title": "AIOS Studio"
    }
  }
}
```

### 3.5 — Theme (violet)

`src/themes/index.ts`:

```ts
export const themeBySection: Record<Section, Theme> = {
  learn: 'emerald',
  ops:   'amber',
  sales: 'rose',
  aios:  'violet',     // <-- add
}
```

`src/themes/violet.css`:

```css
[data-section='aios'] {
  --accent-50:  #f5f3ff;
  --accent-100: #ede9fe;
  --accent-500: #8b5cf6;
  --accent-600: #7c3aed;
  --accent-700: #6d28d9;
  --ring:       var(--accent-500);
}
```

### 3.6 — `useAppSection` detection

`src/hooks/useAppSection.ts`:

```ts
export function useAppSection(): Section {
  const { pathname } = useLocation()
  if (pathname.startsWith('/learn')) return 'learn'
  if (pathname.startsWith('/ops'))   return 'ops'
  if (pathname.startsWith('/sales')) return 'sales'
  if (pathname.startsWith('/aios'))  return 'aios'   // <-- add
  return 'learn'
}
```

### 3.7 — `AppRoutes` lazy import file

`studios/aios/AppRoutes.tsx` (generated — do not edit the submodule, place
adapter in LegendaryOS):

```tsx
// LegendaryOS-side adapter: src/studios/aios/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom'
import {
  AIOSLayout,
  AIOSTopbar,
  AIOSSidebar,
  DashboardHome,
  StoriesKanban,
  AgentsGrid,
  SquadsGrid,
  WorkflowsList,
} from 'itm-infinity-aios-studio/ui'
import { useTranslation } from 'react-i18next'

export default function AIOSAppRoutes() {
  const { t } = useTranslation()
  return (
    <AIOSLayout
      topbar={<AIOSTopbar title={t('aios.topbar.title')} />}
      sidebar={<AIOSSidebar current="dashboard" />}
    >
      <Routes>
        <Route path="/"           element={<DashboardHome />} />
        <Route path="/stories"    element={<StoriesKanban />} />
        <Route path="/agents"     element={<AgentsGrid />} />
        <Route path="/squads"     element={<SquadsGrid />} />
        <Route path="/workflows"  element={<WorkflowsList />} />
      </Routes>
    </AIOSLayout>
  )
}
```

### 3.8 — Studio folder structure in LegendaryOS

```
itm-legendary-infinity-os/
├── src/
│   └── studios/
│       └── aios/
│           ├── AppRoutes.tsx          # The adapter above
│           ├── bootstrap.ts           # createAIOSClient(...) initialiser
│           └── services/              # Domain services using AIOS SDK
│               └── stories.service.ts
└── studios/
    └── aios/                          # ← git submodule (this repo)
```

`src/studios/aios/bootstrap.ts`:

```ts
import { createAIOSClient } from 'itm-infinity-aios-studio/sdk'

export function bootstrapAIOS() {
  // Prefer AIOS-dedicated env vars (dual-project mode, see §3.11).
  // Fall back to host vars for single-project setups.
  const supabaseUrl =
    import.meta.env.VITE_AIOS_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey =
    import.meta.env.VITE_AIOS_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) return

  createAIOSClient({ supabaseUrl, supabaseAnonKey })
}
```

Call `bootstrapAIOS()` once in the LegendaryOS root (typically
`src/main.tsx` before `<App />` renders).

> The env-var precedence is documented in [ADR-002](./adr/002-dual-supabase-config.md)
> and detailed in [§3.11](#311--dual-supabase-configuration) below.

### 3.9 — Palette tokens

`src/styles/palettes.ts`:

```ts
export const palettes = {
  // ...existing
  aios: {
    primary:   'violet-600',
    secondary: 'violet-100',
    accent:    'fuchsia-500',
    surface:   'zinc-50',
    fg:        'zinc-900',
  },
} satisfies Record<Section, Palette>
```

### 3.11 — Dual-Supabase Configuration

AIOS Studio and its host may point to **different Supabase projects**. This
is the recommended configuration when the host owns its own production DB
(users, subscriptions, domain entities) while AIOS Studio tables
(`aios_stories`, `aios_workflow_runs`, future telemetry) live in a framework-
level project (e.g., INTENTUM).

See [ADR-002](./adr/002-dual-supabase-config.md) for the full rationale.

#### `.env.example` (host, 4 vars)

```bash
# Host app — production DB (users, subscriptions, domain)
VITE_SUPABASE_URL=https://<host-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<host anon key>

# AIOS Studio target — optional, dedicated project for framework telemetry.
# Omit these two to reuse the host project (single-project mode).
VITE_AIOS_SUPABASE_URL=https://<aios-ref>.supabase.co
VITE_AIOS_SUPABASE_ANON_KEY=<aios anon key>
```

#### Precedence

The bootstrap in §3.8 reads the AIOS-specific vars first and falls back to
the host vars. The resulting behaviour is:

| `VITE_AIOS_SUPABASE_*` set | `VITE_SUPABASE_*` set | AIOS Studio reads from |
|----------------------------|-----------------------|------------------------|
| ✓ | ✓ | AIOS project (preferred) |
| ✗ | ✓ | Host project (single-project mode) |
| ✓ | ✗ | AIOS project |
| ✗ | ✗ | SDK not initialised; views show empty/loading state |

#### Known warning

With both projects configured, Supabase emits:

```
GoTrueClient@sb-<ref>-auth-token: Multiple GoTrueClient instances detected
```

This is benign. AIOS Studio's SDK never calls `signIn`/`signOut`, so there
is no auth-state race. The warning exists because two `supabase-js` clients
share the browser's localStorage namespace.

#### Audit trail

Record the mapping between host and AIOS projects in your deployment docs:

```
# Example: LegendaryOS dev environment
VITE_SUPABASE_URL         = https://syirdoexfqshfltolitm.supabase.co   # LegendaryOS prod
VITE_AIOS_SUPABASE_URL    = https://lqevhazsgtxsiqcdchfq.supabase.co   # INTENTUM (framework)
```

---

### 3.10 — Testing

Ensure the integration is covered:

```ts
// src/__tests__/aios.integration.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AIOSAppRoutes from '@/studios/aios/AppRoutes'
import { bootstrapAIOS } from '@/studios/aios/bootstrap'

beforeAll(() => bootstrapAIOS())

describe('AIOS studio mount', () => {
  it('renders the dashboard at /aios', () => {
    render(
      <MemoryRouter initialEntries={['/aios']}>
        <AIOSAppRoutes />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })
})
```

---

## 4. SDK Usage in Background Services

The headless SDK unlocks cross-studio choreography. A few real use cases:

### 4.1 — Learn Studio creates a story from a chat session

```ts
// src/studios/learn/services/chat-to-story.ts
import { stories } from 'itm-infinity-aios-studio/sdk'

export async function promoteChatToStory(chatSummary: string, epic: string) {
  return stories.create({
    title: chatSummary.slice(0, 80),
    epic,
    status: 'Draft',
    priority: 'medium',
    metadata: { source: 'learn-chat', createdVia: 'auto' },
  })
}
```

Full example: [docs/examples/learn-studio-integration.md](./examples/learn-studio-integration.md).

### 4.2 — Ops Studio triggers a workflow

```ts
// src/studios/ops/services/runbook.ts
import { workflows } from 'itm-infinity-aios-studio/sdk'

export async function runDeploymentRunbook(env: 'staging' | 'prod') {
  const run = await workflows.trigger({
    workflow_name: 'deployment-runbook',
    params: { environment: env },
    triggered_by: 'ops.runbook',
  })
  return run.id
}
```

### 4.3 — Sales Studio queries agents for an outreach flow

```ts
// src/studios/sales/services/outreach.ts
import { agents } from 'itm-infinity-aios-studio/sdk'

export async function getCopywriterCommands() {
  const agent = await agents.getByName('social-media-copywriter')
  return agent.commands   // used to populate a Sales UI dropdown
}
```

---

## 5. Updating the Submodule

Development workflow when a new feature lands upstream:

```bash
# 1. Develop + push in the AIOS Studio repo
cd ~/Desktop/itm-dev/github/00-itm-hub-repos/itm-infinity-aios-studio
git checkout -b feat/new-view
# ...work + commit
git push origin feat/new-view
# open PR, merge to main, cut a release tag (e.g. v0.2.0)

# 2. Bump the submodule pointer in LegendaryOS
cd ~/Desktop/itm-dev/github/.../itm-legendary-infinity-os
cd studios/aios
git fetch --tags
git checkout v0.2.0
cd ../..
git add studios/aios
git commit -m "chore(aios): bump submodule to v0.2.0"
git push
```

In CI, always run `git submodule update --init --recursive` before
`npm install`.

---

## 6. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `studios/aios` directory empty after clone | Forgot `--recursive` | `git submodule update --init --recursive` |
| Submodule appears modified in `git status` | HEAD drifted; LegendaryOS expects a specific tag | `cd studios/aios && git checkout <pinned-tag>` |
| `createAIOSClient must be called before getAIOSClient` | `bootstrapAIOS()` not invoked | Call it at app boot (`src/main.tsx`) before any SDK usage |
| White screen inside `/aios/*` | Stale build in `studios/aios/dist/` | `cd studios/aios && npm run build` after bumping |
| `401 JWT expired` from Supabase | Wrong or expired anon key | Verify `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in host `.env` |
| CSS tokens bleed into other sections | `[data-section='aios']` scope not set | Ensure `AIOSLayout` wrapper applies `data-section="aios"` on its root |
| Drag-and-drop broken in kanban | `@dnd-kit` peer mismatch between host and submodule | Dedupe React in the host bundler config (`resolve.dedupe: ['react','react-dom']`) |

If the above does not help, open an issue on
[github.com/matheusallvarenga/itm-infinity-aios-studio/issues](https://github.com/matheusallvarenga/itm-infinity-aios-studio/issues)
with: submodule commit SHA, LegendaryOS commit SHA, browser console log,
network tab snapshot.

---

## Related documents

- [ADR-001: Dual Surface Architecture](./adr/001-dual-surface-architecture.md)
- [Learn Studio + AIOS SDK example](./examples/learn-studio-integration.md)
- [Root README](../README.md)
- [CONTRIBUTING](../CONTRIBUTING.md)
