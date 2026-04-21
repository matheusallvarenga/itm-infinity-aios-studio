-- =====================================================================
-- Migration: 001_create_aios_tables
-- Project: itm-infinity-aios-studio (Phase 4 — Data Layer)
-- Target Supabase Project: INTENTUM (ref: lqevhazsgtxsiqcdchfq)
-- Author: @data-engineer (Nova)
-- Date: 2026-04-21
-- =====================================================================
-- Creates:
--   1. aios_stories           — Story-driven development backlog
--   2. aios_workflow_runs     — Workflow execution telemetry
--   Supporting triggers, indexes, and RLS policies.
--
-- Idempotency: uses IF NOT EXISTS and DROP IF EXISTS on triggers/policies
-- so re-runs are safe in dev environments.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Extensions (safe if already enabled)
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. Shared trigger function: auto-refresh updated_at
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at()
  IS 'Trigger helper: refreshes updated_at on row UPDATE. Shared across aios_* tables.';

-- =====================================================================
-- TABLE 1: aios_stories
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.aios_stories (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                TEXT NOT NULL,
  epic                 TEXT,
  status               TEXT NOT NULL
                         CHECK (status IN ('Draft', 'Approved', 'InProgress', 'Review', 'Done'))
                         DEFAULT 'Draft',
  acceptance_criteria  JSONB,                       -- array of strings
  tasks                JSONB,                       -- array of { id, description, completed }
  file_list            TEXT[],                      -- file paths touched during dev
  assignee             TEXT,                        -- agent id or user id
  priority             TEXT
                         CHECK (priority IN ('low', 'medium', 'high', 'critical'))
                         DEFAULT 'medium',
  metadata             JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.aios_stories                      IS 'Story-driven development backlog (AIOS methodology).';
COMMENT ON COLUMN public.aios_stories.epic                 IS 'Epic slug reference (e.g., "learn-engagement").';
COMMENT ON COLUMN public.aios_stories.acceptance_criteria  IS 'JSONB array of acceptance-criteria strings.';
COMMENT ON COLUMN public.aios_stories.tasks                IS 'JSONB array: [{ id, description, completed }].';
COMMENT ON COLUMN public.aios_stories.file_list            IS 'File paths touched during development.';
COMMENT ON COLUMN public.aios_stories.assignee             IS 'Agent id (e.g., "@dev") or user id.';
COMMENT ON COLUMN public.aios_stories.metadata             IS 'Free-form metadata; "source" key indexed.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_aios_stories_status
  ON public.aios_stories (status);

CREATE INDEX IF NOT EXISTS idx_aios_stories_epic
  ON public.aios_stories (epic);

CREATE INDEX IF NOT EXISTS idx_aios_stories_created_at
  ON public.aios_stories (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_aios_stories_metadata_source
  ON public.aios_stories ((metadata->>'source'))
  WHERE metadata ? 'source';

-- Trigger: updated_at auto-refresh
DROP TRIGGER IF EXISTS trg_aios_stories_updated_at ON public.aios_stories;
CREATE TRIGGER trg_aios_stories_updated_at
  BEFORE UPDATE ON public.aios_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.aios_stories ENABLE ROW LEVEL SECURITY;

-- Drop any pre-existing same-named policies (idempotent re-run)
DROP POLICY IF EXISTS "Allow all for authenticated" ON public.aios_stories;
DROP POLICY IF EXISTS "Allow read for anon"         ON public.aios_stories;

-- Authenticated users: full CRUD
CREATE POLICY "Allow all for authenticated"
  ON public.aios_stories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anonymous users: SELECT-only (for public dashboards)
CREATE POLICY "Allow read for anon"
  ON public.aios_stories
  FOR SELECT
  TO anon
  USING (true);

-- =====================================================================
-- TABLE 2: aios_workflow_runs
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.aios_workflow_runs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name  TEXT NOT NULL,
  params         JSONB NOT NULL DEFAULT '{}'::jsonb,
  status         TEXT NOT NULL
                   CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled'))
                   DEFAULT 'pending',
  triggered_by   TEXT,                       -- user or agent id
  started_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at   TIMESTAMPTZ,                -- nullable
  result         JSONB,                      -- nullable output payload
  error          TEXT                        -- nullable error message
);

COMMENT ON TABLE  public.aios_workflow_runs               IS 'Execution telemetry for AIOS workflows (greenfield, brownfield, story cycle, etc.).';
COMMENT ON COLUMN public.aios_workflow_runs.workflow_name IS 'Registered workflow identifier (e.g., "story-development-cycle").';
COMMENT ON COLUMN public.aios_workflow_runs.params        IS 'Input parameters captured at trigger time.';
COMMENT ON COLUMN public.aios_workflow_runs.triggered_by  IS 'Agent id (e.g., "@sm") or user id.';
COMMENT ON COLUMN public.aios_workflow_runs.result        IS 'Output payload when status = completed.';
COMMENT ON COLUMN public.aios_workflow_runs.error         IS 'Error message when status = failed.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_aios_workflow_runs_status
  ON public.aios_workflow_runs (status);

CREATE INDEX IF NOT EXISTS idx_aios_workflow_runs_workflow_name
  ON public.aios_workflow_runs (workflow_name);

CREATE INDEX IF NOT EXISTS idx_aios_workflow_runs_started_at
  ON public.aios_workflow_runs (started_at DESC);

CREATE INDEX IF NOT EXISTS idx_aios_workflow_runs_triggered_by
  ON public.aios_workflow_runs (triggered_by)
  WHERE triggered_by IS NOT NULL;

-- RLS
ALTER TABLE public.aios_workflow_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert + select for authenticated" ON public.aios_workflow_runs;
DROP POLICY IF EXISTS "Allow update for authenticated"          ON public.aios_workflow_runs;
DROP POLICY IF EXISTS "Allow select for anon"                   ON public.aios_workflow_runs;

-- Authenticated users: INSERT + SELECT (runs are append-mostly; updates require explicit policy)
CREATE POLICY "Allow insert + select for authenticated"
  ON public.aios_workflow_runs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated"
  ON public.aios_workflow_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated: UPDATE (needed to transition pending -> running -> completed/failed)
CREATE POLICY "Allow update for authenticated"
  ON public.aios_workflow_runs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anonymous users: SELECT only (activity feeds)
CREATE POLICY "Allow select for anon"
  ON public.aios_workflow_runs
  FOR SELECT
  TO anon
  USING (true);

-- =====================================================================
-- END OF MIGRATION 001_create_aios_tables
-- =====================================================================
