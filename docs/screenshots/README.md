# AIOS Studio — Verification Screenshots

Capturas de tela dos 5 views renderizados em produção local durante a verificação
visual de 2026-04-22 (end-to-end integration com LegendaryOS em dual-Supabase
mode, ADR-002).

| # | Arquivo | View | Rota | Status |
|---|---------|------|------|--------|
| 1 | [aios-01-dashboard.png](./aios-01-dashboard.png) | Dashboard | `/studio/aios/dashboard` | ✅ / ⚠️ schema drift em `unified_executions.cost/agent_id` |
| 2 | [aios-02-stories-kanban.png](./aios-02-stories-kanban.png) | Stories Kanban | `/studio/aios/stories` | ✅ 4 colunas renderizadas com seed data de `aios_stories` (Review cortada em viewport 1120px) |
| 3 | [aios-03-agents-explorer.png](./aios-03-agents-explorer.png) | Agents Explorer | `/studio/aios/agents` | ✅ 12 agents (static registry) |
| 4 | [aios-04-squads-browser.png](./aios-04-squads-browser.png) | Squads Browser | `/studio/aios/squads` | ✅ 10 squads (static registry) |
| 5 | [aios-05-workflows-list.png](./aios-05-workflows-list.png) | Workflow Runner | `/studio/aios/workflows` | ✅ 16 workflows + 3 real runs de `aios_workflow_runs` |

## Context

- **Host**: `itm-legendary-infinity-os` (LegendaryOS), commit `b2183dc`
  (pending push at time of capture)
- **Submodule pin**: `eefe801` = v0.1.1 (this repo)
- **Data source AIOS**: Supabase INTENTUM (`lqevhazsgtxsiqcdchfq`)
- **Data source host**: LegendaryOS Supabase (`syirdoexfqshfltolitm`)
- **Theme**: violet (AIOS)
- **Dev server**: Vite 5.4.21 on port 5174
- **Captured via**: Playwright MCP full-page screenshots (scale css, PNG)

## Related

- [Story 0.1.1 — Dual-Supabase Split](../stories/story-0.1.1-dual-supabase-split.md)
- [ADR-002: Dual-Supabase Configuration Support](../adr/002-dual-supabase-config.md)
- [Integration Guide §3.11](../integration.md#311--dual-supabase-configuration)
- Session verification report:
  `~/Desktop/itm-dev/claude-code/sessions/2026/04-April/2026-04-22/2026-04-22-itm-infinity-aios-studio-Post-Delivery-Verification-Report.md`

## Known v0.2 follow-ups identified in verification

- Dashboard: `unified_executions` schema drift — query references
  `cost` and `agent_id` columns missing in INTENTUM. Fix: align view query
  with actual INTENTUM schema or migrate columns.
- Kanban: 5th column (Review) cut off at 1120px viewport. Needs responsive
  layout or horizontal scroll indicator.
- Auth guard triggers loading state between navigations ("Verificando
  autenticação..."). Consider session-scoped cache to avoid re-check on
  every route change.
