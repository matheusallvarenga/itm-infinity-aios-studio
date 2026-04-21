/**
 * itm-infinity-aios-studio — UI entry point
 *
 * React components for AIOS Studio. Consumes the SDK (../sdk) —
 * no direct Supabase calls should happen in this layer.
 */

// Primitives
export * from './primitives';

// Layout
export { AIOSLayout, type AIOSLayoutProps } from './shared/AIOSLayout';
export { AIOSTopbar, type AIOSTopbarProps } from './shared/AIOSTopbar';
export { AIOSSidebar, type AIOSSidebarProps, type AIOSView } from './shared/AIOSSidebar';

// Dashboard
export { DashboardHome } from './dashboard/DashboardHome';
export { MetricsGrid } from './dashboard/MetricsGrid';
export { TrendsChart } from './dashboard/TrendsChart';
export { TopAgentsCard } from './dashboard/TopAgentsCard';

// Kanban
export { StoriesKanban } from './kanban/StoriesKanban';
export { StoryCard, type StoryCardProps } from './kanban/StoryCard';
export { StoryDetail, type StoryDetailProps } from './kanban/StoryDetail';
export { KanbanColumn, type KanbanColumnProps } from './kanban/KanbanColumn';

// Agents Explorer
export { AgentsGrid } from './agents-explorer/AgentsGrid';
export { AgentCard, type AgentCardProps } from './agents-explorer/AgentCard';
export { AgentDetail, type AgentDetailProps } from './agents-explorer/AgentDetail';

// Squads Browser
export { SquadsGrid } from './squads-browser/SquadsGrid';
export { SquadCard, type SquadCardProps } from './squads-browser/SquadCard';
export { SquadDetail, type SquadDetailProps } from './squads-browser/SquadDetail';

// Workflow Runner
export { WorkflowsList } from './workflow-runner/WorkflowsList';
export { WorkflowCard, type WorkflowCardProps } from './workflow-runner/WorkflowCard';
export { RunDialog, type RunDialogProps } from './workflow-runner/RunDialog';
export { WorkflowHistory, type WorkflowHistoryProps } from './workflow-runner/WorkflowHistory';

// Theme CSS side-effect import (ensures tailwind vars are available)
import '../styles/aios-theme.css';
