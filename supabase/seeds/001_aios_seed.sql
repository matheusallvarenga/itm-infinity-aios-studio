-- =====================================================================
-- Seed: 001_aios_seed
-- Project: itm-infinity-aios-studio (Phase 4 — Data Layer)
-- Target Supabase Project: INTENTUM (ref: lqevhazsgtxsiqcdchfq)
-- Author: @data-engineer (Nova)
-- Date: 2026-04-21
-- =====================================================================
-- Populates aios_stories (5 rows, one per status) and aios_workflow_runs
-- (3 rows, one per lifecycle outcome).
--
-- Idempotency: uses fixed UUIDs with ON CONFLICT DO NOTHING so reruns
-- are safe without producing duplicate rows.
-- =====================================================================

-- ---------------------------------------------------------------------
-- aios_stories seed rows
-- ---------------------------------------------------------------------
INSERT INTO public.aios_stories
  (id, title, epic, status, acceptance_criteria, tasks, file_list, assignee, priority, metadata)
VALUES
  -- 1. Draft
  (
    '11111111-1111-1111-1111-111111111101',
    'Implement Kanban drag-drop',
    'ui-kanban',
    'Draft',
    '[
       "Stories can be dragged between status columns",
       "Drop target updates status in Supabase",
       "Optimistic UI with rollback on failure"
     ]'::jsonb,
    '[
       {"id": "t1", "description": "Integrate dnd-kit into KanbanBoard", "completed": false},
       {"id": "t2", "description": "Wire onDragEnd to sdk.stories.update", "completed": false},
       {"id": "t3", "description": "Add optimistic rollback", "completed": false}
     ]'::jsonb,
    ARRAY[]::TEXT[],
    '@sm',
    'high',
    '{"source": "phase-4-seed", "epic_group": "studio-ui"}'::jsonb
  ),

  -- 2. Approved
  (
    '11111111-1111-1111-1111-111111111102',
    'Design Dashboard KPI cards',
    'dashboard',
    'Approved',
    '[
       "Four KPI cards: Stories, Workflows, Agents, Health Score",
       "Each card shows trend arrow (up/down/flat)",
       "Responsive grid (1 col mobile, 2 tablet, 4 desktop)"
     ]'::jsonb,
    '[
       {"id": "t1", "description": "Wireframe layout in Figma", "completed": true},
       {"id": "t2", "description": "Token palette from theme-factory", "completed": true},
       {"id": "t3", "description": "Implement <KpiCard /> primitive", "completed": false}
     ]'::jsonb,
    ARRAY['src/ui/dashboard/KpiCard.tsx']::TEXT[],
    '@ux-design-expert',
    'medium',
    '{"source": "phase-4-seed", "figma_link": "placeholder"}'::jsonb
  ),

  -- 3. InProgress
  (
    '11111111-1111-1111-1111-111111111103',
    'Build Agents Explorer grid',
    'agents-explorer',
    'InProgress',
    '[
       "Grid shows all 28 agents with avatar, name, role",
       "Click opens agent detail drawer",
       "Filter by model (Haiku/Sonnet/Opus)"
     ]'::jsonb,
    '[
       {"id": "t1", "description": "Fetch agent list from SDK", "completed": true},
       {"id": "t2", "description": "Render <AgentCard /> grid", "completed": true},
       {"id": "t3", "description": "Detail drawer + filter controls", "completed": false}
     ]'::jsonb,
    ARRAY['src/ui/agents/AgentExplorer.tsx', 'src/ui/agents/AgentCard.tsx']::TEXT[],
    '@dev',
    'high',
    '{"source": "phase-4-seed", "started_at": "2026-04-20T10:00:00Z"}'::jsonb
  ),

  -- 4. Review
  (
    '11111111-1111-1111-1111-111111111104',
    'Add Storybook stories for UI primitives',
    'quality',
    'Review',
    '[
       "Storybook covers Button, Card, Input, Badge, KpiCard",
       "Each story has Default + edge-case variants",
       "CI runs `storybook:build` without errors"
     ]'::jsonb,
    '[
       {"id": "t1", "description": "Scaffold .storybook config", "completed": true},
       {"id": "t2", "description": "Write primitive stories", "completed": true},
       {"id": "t3", "description": "QA review + screenshots", "completed": true}
     ]'::jsonb,
    ARRAY[
      '.storybook/main.ts',
      'src/ui/primitives/Button.stories.tsx',
      'src/ui/primitives/Card.stories.tsx'
    ]::TEXT[],
    '@qa',
    'medium',
    '{"source": "phase-4-seed", "pr_number": 42}'::jsonb
  ),

  -- 5. Done
  (
    '11111111-1111-1111-1111-111111111105',
    'Scaffold itm-infinity-aios-studio repository',
    'bootstrap',
    'Done',
    '[
       "Vite + React + TS project initialized",
       "Tailwind + ESLint + Prettier configured",
       "First build passes locally"
     ]'::jsonb,
    '[
       {"id": "t1", "description": "npm create vite@latest", "completed": true},
       {"id": "t2", "description": "Add tailwind + postcss", "completed": true},
       {"id": "t3", "description": "Commit initial structure", "completed": true}
     ]'::jsonb,
    ARRAY[
      'package.json',
      'tsconfig.json',
      'tailwind.config.ts',
      'postcss.config.js'
    ]::TEXT[],
    '@architect',
    'critical',
    '{"source": "phase-4-seed", "completed_at": "2026-04-21T00:00:00Z"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- aios_workflow_runs seed rows
-- ---------------------------------------------------------------------
INSERT INTO public.aios_workflow_runs
  (id, workflow_name, params, status, triggered_by, started_at, completed_at, result, error)
VALUES
  -- 1. Completed
  (
    '22222222-2222-2222-2222-222222222201',
    'story-development-cycle',
    '{
       "story_id": "11111111-1111-1111-1111-111111111105",
       "mode": "interactive"
     }'::jsonb,
    'completed',
    'sm',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '45 minutes',
    '{
       "story_status_final": "Done",
       "files_changed": 4,
       "tests_added": 0,
       "duration_minutes": 75
     }'::jsonb,
    NULL
  ),

  -- 2. Running
  (
    '22222222-2222-2222-2222-222222222202',
    'brownfield-discovery',
    '{
       "repo_path": "~/Desktop/itm-dev/github/00-itm-hub-repos/itm-infinity-aios-studio",
       "scope": "full"
     }'::jsonb,
    'running',
    'analyst',
    NOW() - INTERVAL '15 minutes',
    NULL,
    NULL,
    NULL
  ),

  -- 3. Failed
  (
    '22222222-2222-2222-2222-222222222203',
    'qa-loop',
    '{
       "story_id": "11111111-1111-1111-1111-111111111103",
       "test_suite": "e2e"
     }'::jsonb,
    'failed',
    'qa',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '50 minutes',
    NULL,
    'E2E test `agents-grid.spec.ts` failed: selector `[data-testid="agent-card"]` not found within 5000ms'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- END OF SEED 001_aios_seed
-- =====================================================================
