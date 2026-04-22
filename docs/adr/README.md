# Architecture Decision Records (ADR)

This folder captures significant architecture decisions for
`itm-infinity-aios-studio`.

Each ADR documents the **context**, **decision**, **rationale**,
**consequences**, and **alternatives considered** for a design choice that
was non-trivial, cross-cutting, or likely to surprise future maintainers.

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [001](./001-dual-surface-architecture.md) | Dual Surface Architecture (UI + SDK) | Accepted (Context §3.2 superseded by [ADR-002](./002-dual-supabase-config.md)) | 2026-04-21 |
| [002](./002-dual-supabase-config.md) | Dual-Supabase Configuration Support | Accepted (supersedes ADR-001 §Context partial) | 2026-04-22 |

## When to write a new ADR

Write an ADR when:

- The decision affects **more than one module** (cross-cutting).
- The decision is **hard to reverse** once shipped.
- There are at least **two credible alternatives** that were weighed.
- Future maintainers would ask "why did we do it that way?".

**Don't** write an ADR for local refactors, bug fixes, or choices that can
be revisited in a single PR.

## Template

Copy this scaffold for new ADRs. File name: `NNN-kebab-case-title.md`,
where `NNN` is the next sequential number (zero-padded, three digits).

```markdown
# ADR-NNN: <Short Title>

**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-XXX
**Date**: YYYY-MM-DD
**Deciders**: <names or handles>

## Context

<What problem are we solving? What constraints apply? What forces are at play?>

## Decision

<What did we decide to do? Be specific — name files, APIs, boundaries.>

## Rationale

<Why this decision over the alternatives? Bullet the reasoning.>

## Consequences

### Positive
- ...

### Negative
- ...

### Neutral
- ...

## Alternatives Considered

1. **<Alternative A>** — why rejected.
2. **<Alternative B>** — why rejected.
3. **<Alternative C>** — why rejected.

## References

- Related ADRs: ADR-XXX
- Issues / PRs: #NN
- External links: ...
```

## Status lifecycle

```
Proposed  -->  Accepted  -->  Deprecated
                 |
                 +-->  Superseded by ADR-XXX
```

Once accepted, an ADR should not be rewritten; instead, open a new ADR that
supersedes it and update the old ADR's status line to point to the successor.
