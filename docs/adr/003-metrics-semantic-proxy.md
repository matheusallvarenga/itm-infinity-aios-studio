# ADR-003: Metrics Semantic Proxy (aios_workflow_runs)

**Status**: Accepted  
**Date**: 2026-04-22  
**Authors**: @data-engineer (Nova), @architect (Sage)  
**Supersedes**: N/A  
**Superseded by**: TBD (v0.3 epic — unified_executions pipeline)

---

## Context

The original `metrics.ts` SDK was designed to query two tables:

| Table | Purpose |
|-------|---------|
| `unified_metrics` | Pre-aggregated KPI rows (period summaries) |
| `unified_executions` | Raw execution telemetry (per request/agent run) |

However, migration `001_create_aios_tables.sql` only created:
- `aios_stories` — Story-driven development backlog
- `aios_workflow_runs` — Workflow execution telemetry

The `unified_*` tables belong to a separate data ingestion pipeline that has not yet been implemented for the INTENTUM project. As a result, all Dashboard KPIs returned 0 silently — Supabase returns `null` on queries against non-existent tables without surfacing an error in some client configurations.

This was discovered during v0.2.0 schema investigation.

---

## Decision

**Repoint all `metrics.ts` queries to `aios_workflow_runs` as a semantic proxy.**

The public API surface of `metrics.ts` (function signatures, return types) is preserved for backward compatibility. The semantic mapping is documented below.

### Column Mapping

| Logical concept | unified_executions column | aios_workflow_runs equivalent | Notes |
|---|---|---|---|
| Execution count | COUNT(*) | COUNT(*) | — |
| Success | `status = 'success'` | `status = 'completed'` | CHECK constraint values differ |
| Failure | `status = 'failure'` | `status = 'failed'` | — |
| Active | (not tracked) | `status = 'running'` | New signal |
| Duration (ms) | `duration_ms` | `completed_at - started_at` | Computed in application layer |
| Cost | `cost` | `0` (hardcoded) | Not tracked in v0.2 |
| Tokens | `tokens` | `0` (hardcoded) | Not tracked in v0.2 |
| Agent identity | `agent_id` / `agent_name` | `workflow_name` + `triggered_by` | Semantic proxy |
| Timestamp (filter) | `created_at` | `started_at` | — |
| Timestamp (display) | `created_at` | `started_at` | — |

### Function Behavior Changes

| Function | Before | After |
|---|---|---|
| `getOverview()` | Queries `unified_metrics` first, falls back to `unified_executions` | Single query to `aios_workflow_runs` |
| `getTrends()` | Queries `unified_executions` | Queries `aios_workflow_runs`, uses `started_at` for bucketing |
| `getTopAgents()` | Groups by `agent_id` from `unified_executions` | Groups by `workflow_name` from `aios_workflow_runs` |

---

## Consequences

### Positive
- Dashboard KPIs now reflect real data from INTENTUM (actual workflow runs)
- Zero schema changes required
- Preserved public API surface (no consumer breaking changes)
- `activeJobs` KPI now works correctly (was always 0 before)

### Negative / Known Limitations
- `totalCost` and `totalTokens` always return `0` (documented in code comments)
- "Top Agents" semantically displays "Top Workflows" — label mismatch acknowledged
- Duration metric accuracy depends on `completed_at` being set (pending/running rows contribute 0)
- No historical data unless workflow runs are backfilled

---

## Backlog

**v0.3 epic — Implement unified_executions pipeline:**

1. Create `unified_executions` migration with schema matching original `metrics.ts` assumptions
2. Build data ingestion layer that populates `unified_executions` from workflow events
3. Revert `metrics.ts` to query `unified_executions` (remove semantic proxy)
4. Create `unified_metrics` as a materialized/aggregated view for performance
5. Deprecate this ADR

---

## References

- `supabase/migrations/001_create_aios_tables.sql` — actual table definitions
- `src/sdk/metrics.ts` — implementation
- ADR-001 (Dual-Supabase Architecture), ADR-002 (host/AIOS project separation)
