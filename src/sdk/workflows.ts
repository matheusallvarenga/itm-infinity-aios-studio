import { getAIOSClient } from '../lib/supabase';
import type {
  Workflow,
  WorkflowRun,
  TriggerWorkflowInput,
  WorkflowCategory,
} from './types';

const TABLE = 'aios_workflow_runs';

/**
 * Static registry of 16 AIOS workflows.
 */
const AIOS_WORKFLOWS: Workflow[] = [
  {
    id: 'greenfield-fullstack',
    name: 'greenfield-fullstack',
    category: 'greenfield',
    description:
      'New fullstack project setup with PM → Architect → UX → SM/Dev/QA cycle.',
    agentSequence: [
      'analyst',
      'pm',
      'architect',
      'ux-design-expert',
      'sm',
      'dev',
      'qa',
    ],
  },
  {
    id: 'greenfield-service',
    name: 'greenfield-service',
    category: 'greenfield',
    description: 'New service/API project.',
    agentSequence: ['analyst', 'pm', 'architect', 'sm', 'dev', 'qa'],
  },
  {
    id: 'greenfield-ui',
    name: 'greenfield-ui',
    category: 'greenfield',
    description: 'New UI project.',
    agentSequence: [
      'analyst',
      'pm',
      'ux-design-expert',
      'architect',
      'sm',
      'dev',
      'qa',
    ],
  },
  {
    id: 'brownfield-fullstack',
    name: 'brownfield-fullstack',
    category: 'brownfield',
    description: 'Integrate AIOS into existing fullstack project.',
    agentSequence: ['analyst', 'pm', 'architect', 'sm', 'dev', 'qa'],
  },
  {
    id: 'brownfield-service',
    name: 'brownfield-service',
    category: 'brownfield',
    description: 'Integrate AIOS into existing service.',
    agentSequence: ['analyst', 'pm', 'architect', 'sm', 'dev', 'qa'],
  },
  {
    id: 'brownfield-ui',
    name: 'brownfield-ui',
    category: 'brownfield',
    description: 'Integrate AIOS into existing UI.',
    agentSequence: [
      'analyst',
      'pm',
      'ux-design-expert',
      'architect',
      'sm',
      'dev',
      'qa',
    ],
  },
  {
    id: 'brownfield-discovery',
    name: 'brownfield-discovery',
    category: 'brownfield',
    description: 'Analyze existing project for AIOS integration readiness.',
    agentSequence: ['analyst'],
  },
  {
    id: 'story-development-cycle',
    name: 'story-development-cycle',
    category: 'story',
    description: 'Single story SM → Dev → QA cycle.',
    agentSequence: ['sm', 'dev', 'qa'],
  },
  {
    id: 'development-cycle',
    name: 'development-cycle',
    category: 'story',
    description: 'Core story-driven development workflow.',
    agentSequence: ['sm', 'dev', 'qa'],
  },
  {
    id: 'epic-orchestration',
    name: 'epic-orchestration',
    category: 'story',
    description: 'Multi-epic coordination.',
    agentSequence: ['pm', 'sm', 'dev', 'qa'],
  },
  {
    id: 'spec-pipeline',
    name: 'spec-pipeline',
    category: 'story',
    description: 'Requirements to executable specs transformation.',
    agentSequence: ['analyst', 'pm', 'architect'],
  },
  {
    id: 'qa-loop',
    name: 'qa-loop',
    category: 'qa',
    description: 'Iterative QA review cycle (max 5 iterations).',
    agentSequence: ['qa', 'dev'],
  },
  {
    id: 'auto-worktree',
    name: 'auto-worktree',
    category: 'other',
    description: 'Automated Git worktree management.',
    agentSequence: ['devops'],
  },
  {
    id: 'design-system-build-quality',
    name: 'design-system-build-quality',
    category: 'qa',
    description: 'Quality gates for design system development.',
    agentSequence: ['ux-design-expert', 'dev', 'qa'],
  },
  {
    id: 'research-orchestration',
    name: 'research-orchestration',
    category: 'research',
    description: 'ITM custom research orchestration workflow.',
    agentSequence: ['analyst'],
  },
  {
    id: 'deep-research-orchestration',
    name: 'deep-research-orchestration',
    category: 'research',
    description: 'Deep-research squad 3-tier pipeline.',
    agentSequence: [],
  },
];

export async function list(filter?: {
  category?: WorkflowCategory;
}): Promise<Workflow[]> {
  if (filter?.category) {
    return AIOS_WORKFLOWS.filter((w) => w.category === filter.category);
  }
  return AIOS_WORKFLOWS;
}

export async function getByName(name: string): Promise<Workflow | null> {
  return AIOS_WORKFLOWS.find((w) => w.name === name) || null;
}

/**
 * Trigger a workflow run — inserts a row in `aios_workflow_runs`
 * (table created in Phase 4).
 */
export async function trigger(input: TriggerWorkflowInput): Promise<WorkflowRun> {
  const client = getAIOSClient();
  const { data, error } = await client
    .from(TABLE)
    .insert({
      workflow_name: input.workflow_name,
      params: input.params || {},
      triggered_by: input.triggered_by,
      status: 'pending',
      started_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) {
    throw {
      code: 'WORKFLOW_TRIGGER_FAILED',
      message: error.message,
      cause: error,
    };
  }
  return data as WorkflowRun;
}

export async function getStatus(runId: string): Promise<WorkflowRun | null> {
  const client = getAIOSClient();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .eq('id', runId)
    .maybeSingle();
  if (error) {
    throw {
      code: 'WORKFLOW_STATUS_FAILED',
      message: error.message,
      cause: error,
    };
  }
  return (data as WorkflowRun) || null;
}

export async function getHistory(limit: number = 20): Promise<WorkflowRun[]> {
  const client = getAIOSClient();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);
  if (error) {
    throw {
      code: 'WORKFLOW_HISTORY_FAILED',
      message: error.message,
      cause: error,
    };
  }
  return (data as WorkflowRun[]) || [];
}
