# ADR-002: Dual-Supabase Configuration Support

**Status**: Accepted (supersedes ADR-001 §"Single Supabase client must be shared
between UI and SDK" — partial)
**Date**: 2026-04-22
**Deciders**: Matheus Allvarenga
**Supersedes**: Partial — ADR-001, Context paragraph 3, point 2.

## Context

ADR-001 accepted "Dual Surface Architecture" and, in its *Context* section,
listed as a constraint:

> A single Supabase client must be shared between UI and SDK — duplicating
> auth state would break realtime subscriptions and RLS assumptions.

That constraint was implicitly stronger: it also assumed a **single Supabase
project** sits behind both host and studio. Post-delivery verification on
2026-04-22 (see
[Story 0.1.1](../stories/story-0.1.1-dual-supabase-split.md)) showed this to
be an invalid assumption for the canonical consumer,
`itm-legendary-infinity-os`:

| Project | Owns |
|---------|------|
| LegendaryOS production Supabase | `user_profiles`, `user_roles`, `roles`, `subscriptions`, `v_books_pt`, domain RPCs, RLS policies for end-user apps |
| INTENTUM (`lqevhazsgtxsiqcdchfq`) | `aios_stories`, `aios_workflow_runs`, MMOS/Hub/ITM Command Center schemas |

Provisioning `aios_*` tables in the LegendaryOS production project was rejected
for three reasons:

1. **Separation of concerns** — AIOS Studio is a studio for *developer/ops
   observability of the AIOS framework*, not a feature of the end-user product.
   Its data has a different audience and lifecycle.
2. **Cross-host reuse** — the submodule will eventually be mounted in other
   hosts (Ops Studio, standalone CLI, sibling products). Hard-coding
   LegendaryOS's Supabase project breaks that reusability.
3. **Blast radius** — putting framework-level telemetry tables in the user-
   facing production DB would increase the blast radius of a mistaken
   `DROP TABLE` or RLS misconfiguration.

Conversely, forcing LegendaryOS onto INTENTUM was rejected because INTENTUM
has no LegendaryOS product schema and adding it there would duplicate the
problem from the other direction.

## Decision

The SDK does **not** change. `createAIOSClient({ supabaseUrl, supabaseAnonKey })`
stays explicit and host-agnostic.

What changes is the **canonical host bootstrap pattern** documented in
`docs/integration.md §3.8`:

```ts
// Host bootstrap — e.g., LegendaryOS src/main.tsx or index.tsx
import { createAIOSClient } from 'itm-infinity-aios-studio/sdk';

// Prefer dedicated AIOS vars, fall back to host vars for single-project setups.
const aiosUrl =
  import.meta.env.VITE_AIOS_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
const aiosAnonKey =
  import.meta.env.VITE_AIOS_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY;

if (aiosUrl && aiosAnonKey) {
  createAIOSClient({ supabaseUrl: aiosUrl, supabaseAnonKey: aiosAnonKey });
}
```

And the canonical `.env.example` becomes:

```bash
# Host app (LegendaryOS production DB)
VITE_SUPABASE_URL=https://<host-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<host anon>

# AIOS Studio target (optional — omit to reuse host project)
VITE_AIOS_SUPABASE_URL=https://<aios-ref>.supabase.co
VITE_AIOS_SUPABASE_ANON_KEY=<aios anon>
```

When only the host pair is set, the SDK reuses the host project (ADR-001
original assumption). When both pairs are set, AIOS Studio talks to a
separate project. This keeps the single-project path frictionless and the
dual-project path explicit.

## Rationale

- **Non-breaking** — no SDK signature changes; existing consumers keep
  working.
- **Explicit > magic** — the host controls where AIOS Studio reads from,
  via env vars named after their purpose. No string introspection, no
  environment guessing inside the SDK.
- **Tree-shake friendly** — fallback logic lives in the host bootstrap,
  so the SDK surface stays pure and bundler-friendly.
- **Auditable** — each mount can be traced to a specific Supabase project
  by grepping the host's env config.
- **Reversible** — dropping the AIOS-specific env vars collapses back to
  the single-project configuration without code changes.

## Consequences

### Positive
- AIOS Studio can be mounted in hosts that own different Supabase projects.
- Framework-level observability data stays out of end-user production DBs.
- The `Multiple GoTrueClient` warning (from ADR-001) is retained but now
  spans *two projects*, which is semantically cleaner: two clients for two
  auth domains.

### Negative
- The `Multiple GoTrueClient instances detected` console warning from
  Supabase is louder when both projects are configured. It remains benign
  because AIOS Studio SDK never calls `signIn/signOut` — the warning is
  about shared localStorage key namespaces, not actual state conflicts.
- Host operators must now provision two sets of credentials when using
  dual-project mode.

### Neutral
- Single-project setups work exactly as before — the new env vars are
  additive and optional.

## Alternatives Considered

1. **Migrate `aios_*` tables to the LegendaryOS production project** —
   Rejected. Couples framework observability to end-user schema, violates
   the separation-of-concerns constraint, and forces the same coupling on
   any future host that wants to mount AIOS Studio.

2. **Expose a `createAIOSClient({ useHostSupabase: true })` flag and read
   env vars from inside the SDK** — Rejected. Pollutes the SDK with
   framework-specific `import.meta.env` reads, which breaks Node/Deno/Bun
   consumers that do not have that binding.

3. **Ship a `bootstrapAIOS()` helper that reads env vars** — Rejected.
   The helper would have to be duplicated per framework (Vite vs Next.js
   vs Astro). A documented 4-line snippet in the host is clearer and
   removes the helper surface from the API.

4. **Use connection strings with embedded project refs** — Rejected.
   Supabase publishable keys are JWTs bound to one project; mixing
   projects inside a single connection string is not supported.

5. **Runtime project switching** — Rejected. Out of scope for v0.1.1 and
   would need lifecycle management (tearing down realtime channels on
   switch). Re-evaluate for v1.0 if multi-tenant AIOS Studio becomes a
   requirement.

## References

- Supersedes (partial): [ADR-001 §Context](./001-dual-surface-architecture.md)
- Story: [Story 0.1.1](../stories/story-0.1.1-dual-supabase-split.md)
- Integration guide: [§3.11 Dual-Supabase Configuration](../integration.md#311--dual-supabase-configuration)
- Verification session: `claude-code/sessions/2026/04-April/2026-04-22/2026-04-22-itm-infinity-aios-studio-Post-Delivery-Verification-Report.md`
