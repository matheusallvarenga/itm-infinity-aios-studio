/**
 * SDK type definitions.
 * All domain types used across the AIOS Studio SDK.
 */

// ----- Stories -----

export type StoryStatus = 'Draft' | 'Approved' | 'InProgress' | 'Review' | 'Done';

export interface StoryTask {
  id: string;
  description: string;
  completed: boolean;
}

export interface Story {
  id: string;
  title: string;
  epic?: string;
  status: StoryStatus;
  acceptance_criteria?: string[];
  tasks?: StoryTask[];
  file_list?: string[];
  assignee?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface CreateStoryInput {
  title: string;
  epic?: string;
  status?: StoryStatus;
  acceptance_criteria?: string[];
  priority?: Story['priority'];
  metadata?: Record<string, unknown>;
}

// ----- Agents -----

export interface AgentCommand {
  name: string;
  args?: string;
  description: string;
}

export interface Agent {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  archetype: string;
  role: string;
  description: string;
  commands: AgentCommand[];
  dependencies?: {
    tasks?: string[];
    templates?: string[];
    workflows?: string[];
    data?: string[];
  };
}

// ----- Squads -----

export interface Squad {
  id: string;
  name: string;
  version: string;
  displayName: string;
  domain: string;
  description: string;
  entryAgent?: string;
  agentCount: number;
  agents?: string[];
}

// ----- Workflows -----

export type WorkflowCategory =
  | 'greenfield'
  | 'brownfield'
  | 'story'
  | 'qa'
  | 'research'
  | 'other';

export type WorkflowRunStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Workflow {
  id: string;
  name: string;
  category: WorkflowCategory;
  description: string;
  estimatedDuration?: string;
  agentSequence?: string[];
  triggerCommands?: string[];
}

export interface WorkflowRun {
  id: string;
  workflow_name: string;
  params: Record<string, unknown>;
  status: WorkflowRunStatus;
  triggered_by?: string;
  started_at: string;
  completed_at?: string;
  result?: Record<string, unknown>;
  error?: string;
}

export interface TriggerWorkflowInput {
  workflow_name: string;
  params?: Record<string, unknown>;
  triggered_by?: string;
}

// ----- Metrics -----

export interface MetricsOverview {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: number;
  avgDuration: number;
  totalCost: number;
  totalTokens: number;
  activeJobs: number;
  period: { start: string; end: string };
}

export interface MetricsTrendPoint {
  timestamp: string;
  executions: number;
  errors: number;
  avgLatency: number;
  cost: number;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  executions: number;
  successRate: number;
  avgDuration: number;
  avgTokens: number;
}

// ----- Executions -----

export interface Execution {
  id: string;
  agent_id?: string;
  agent_name?: string;
  prompt?: string;
  complexity?: number;
  routing?: string;
  result?: string;
  status: 'success' | 'failure' | 'partial';
  duration_ms?: number;
  tokens?: number;
  cost?: number;
  created_at: string;
}

// ----- Common -----

export interface ListOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filter?: Record<string, unknown>;
}

export interface SDKError {
  code: string;
  message: string;
  cause?: unknown;
}
