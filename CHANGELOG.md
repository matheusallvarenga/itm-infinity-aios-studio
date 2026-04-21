# Changelog

All notable changes to itm-infinity-aios-studio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/matheusallvarenga/itm-infinity-aios-studio/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/matheusallvarenga/itm-infinity-aios-studio/releases/tag/v0.1.0
