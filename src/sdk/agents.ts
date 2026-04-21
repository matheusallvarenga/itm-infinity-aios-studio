import type { Agent } from './types';

/**
 * Static registry of the 12 AIOS agents.
 * Lives in the filesystem in source installations; the SDK exposes this
 * minimal metadata so the UI (and external consumers) can render without
 * needing filesystem access.
 */
const AIOS_AGENTS: Agent[] = [
  {
    id: 'aios-master',
    name: 'aios-master',
    displayName: 'Orion',
    icon: '👑',
    archetype: 'Orchestrator',
    role: 'Master Orchestrator, Framework Developer & AIOS Method Expert',
    description:
      'Universal executor of all Synkra AIOS capabilities. Creates framework components, orchestrates workflows, executes any task directly.',
    commands: [
      { name: 'help', description: 'Show all available commands' },
      { name: 'kb', description: 'Toggle KB mode' },
      { name: 'status', description: 'Show current context' },
      { name: 'create', description: 'Create new AIOS component' },
      { name: 'workflow', args: '{name}', description: 'Start workflow' },
    ],
  },
  {
    id: 'analyst',
    name: 'analyst',
    displayName: 'Quinn',
    icon: '🔍',
    archetype: 'Analyst',
    role: 'Business Analyst',
    description:
      'Market research, requirements gathering, competitive analysis.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'brainstorm', description: 'Start brainstorming' },
      { name: 'create-brief', description: 'Create project brief' },
    ],
  },
  {
    id: 'pm',
    name: 'pm',
    displayName: 'Riley',
    icon: '📋',
    archetype: 'Strategist',
    role: 'Product Manager',
    description:
      'PRD creation, feature prioritization, strategic planning.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'create-prd', description: 'Create PRD' },
      { name: 'create-epic', description: 'Create epic' },
    ],
  },
  {
    id: 'architect',
    name: 'architect',
    displayName: 'Sage',
    icon: '🏛️',
    archetype: 'Architect',
    role: 'System Architect',
    description:
      'System design, technical architecture, scalability planning.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'design-architecture', description: 'Design system' },
      { name: 'tech-stack', description: 'Define stack' },
    ],
  },
  {
    id: 'sm',
    name: 'sm',
    displayName: 'Sam',
    icon: '🎯',
    archetype: 'Facilitator',
    role: 'Scrum Master',
    description: 'Sprint planning, story creation, PRD fragmentation.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'create-story', description: 'Create story' },
      { name: 'split-story', description: 'Split story' },
    ],
  },
  {
    id: 'dev',
    name: 'dev',
    displayName: 'Dex',
    icon: '⚡',
    archetype: 'Builder',
    role: 'Full-Stack Developer',
    description: 'Story implementation, code development, debugging.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'develop-story', description: 'Develop story' },
      { name: 'read-story', description: 'Read story' },
    ],
  },
  {
    id: 'qa',
    name: 'qa',
    displayName: 'Vera',
    icon: '✅',
    archetype: 'Guardian',
    role: 'QA Engineer',
    description: 'Test planning, quality assurance, code review.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'validate-story', description: 'Validate story' },
      { name: 'qa-gate', description: 'Run QA gate' },
    ],
  },
  {
    id: 'po',
    name: 'po',
    displayName: 'Pax',
    icon: '🎖️',
    archetype: 'Owner',
    role: 'Product Owner',
    description:
      'Backlog management, story validation, acceptance criteria.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'prioritize-backlog', description: 'Prioritize backlog' },
    ],
  },
  {
    id: 'devops',
    name: 'devops',
    displayName: 'Gage',
    icon: '🚀',
    archetype: 'Operator',
    role: 'DevOps Engineer',
    description:
      'CI/CD, deployment, Git operations. EXCLUSIVE push authority.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'pre-push', description: 'Run quality gates' },
      { name: 'create-pr', description: 'Create PR' },
    ],
  },
  {
    id: 'data-engineer',
    name: 'data-engineer',
    displayName: 'Nova',
    icon: '💾',
    archetype: 'Architect',
    role: 'Data Engineer',
    description:
      'Database design, data modeling, Supabase migrations.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'db-design', description: 'Design schema' },
    ],
  },
  {
    id: 'ux-design-expert',
    name: 'ux-design-expert',
    displayName: 'Luna',
    icon: '🎨',
    archetype: 'Designer',
    role: 'UX Designer',
    description: 'UI/UX design, wireframes, user research.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'create-wireframe', description: 'Create wireframe' },
    ],
  },
  {
    id: 'squad-creator',
    name: 'squad-creator',
    displayName: 'Architect',
    icon: '🏗️',
    archetype: 'Builder',
    role: 'Squad Creator',
    description: 'Create and extend custom AIOS squads.',
    commands: [
      { name: 'help', description: 'Show commands' },
      { name: 'create', description: 'Create squad' },
      { name: 'extend', description: 'Extend squad' },
    ],
  },
];

export async function list(): Promise<Agent[]> {
  return AIOS_AGENTS;
}

export async function getByName(name: string): Promise<Agent | null> {
  return (
    AIOS_AGENTS.find((a) => a.name === name || a.displayName === name) || null
  );
}

export async function getCommands(agentId: string): Promise<Agent['commands']> {
  const agent = await getByName(agentId);
  return agent?.commands || [];
}
