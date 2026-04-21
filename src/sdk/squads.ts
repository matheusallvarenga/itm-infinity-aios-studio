import type { Squad } from './types';

/**
 * Static registry of AIOS squads currently installed.
 * Mirrors the packages in projects/aios-squads-itm/packages/.
 */
const AIOS_SQUADS: Squad[] = [
  {
    id: 'creator-squad',
    name: 'creator-squad',
    version: '1.0.0',
    displayName: 'Creator Squad',
    domain: 'Expansion Pack Creation',
    description: 'Creates and manages AIOS expansion packs.',
    agentCount: 0,
  },
  {
    id: 'etl',
    name: 'etl',
    version: '1.0.0',
    displayName: 'ETL Squad',
    domain: 'Data ETL',
    description: 'Extract, transform, load operations.',
    agentCount: 0,
  },
  {
    id: 'etl-squad',
    name: 'etl-squad',
    version: '1.0.0',
    displayName: 'ETL Squad (extended)',
    domain: 'Data Processing & ETL',
    description: 'Extended ETL pipeline orchestration.',
    agentCount: 0,
  },
  {
    id: 'expansion-creator',
    name: 'expansion-creator',
    version: '1.0.0',
    displayName: 'Expansion Creator',
    domain: 'Expansion Creation',
    description: 'Legacy expansion creation squad.',
    agentCount: 0,
  },
  {
    id: 'mmos',
    name: 'mmos',
    version: '1.0.0',
    displayName: 'MMOS Minds',
    domain: 'MMOS Minds',
    description:
      'Strategic mind personas (Kennedy, Hormozi, Schwartz, etc.).',
    agentCount: 57,
  },
  {
    id: 'mmos-squad',
    name: 'mmos-squad',
    version: '1.0.0',
    displayName: 'MMOS Squad',
    domain: 'MMOS Squad',
    description: 'MMOS orchestration squad.',
    agentCount: 11,
  },
  {
    id: 'claude-code-mastery',
    name: 'claude-code-mastery',
    version: '1.0.0',
    displayName: 'Claude Code Mastery',
    domain: 'Claude Code Ecosystem',
    description:
      'Hooks, skills, MCP, plugins, agent teams expertise.',
    entryAgent: 'claude-mastery-chief',
    agentCount: 8,
  },
  {
    id: 'curator',
    name: 'curator',
    version: '3.4.0',
    displayName: 'Curator Squad',
    domain: 'Content Curation & Production',
    description:
      'Mining transcriptions, high-impact moments, exact timestamps. ZERO INVENTION.',
    agentCount: 12,
  },
  {
    id: 'deep-research',
    name: 'deep-research',
    version: '1.0.0',
    displayName: 'Deep Research',
    domain: 'Evidence-Based Research',
    description: '3-tier pipeline: Diagnostic → Execution → QA.',
    entryAgent: 'dr-orchestrator',
    agentCount: 11,
  },
  {
    id: 'legal-analyst',
    name: 'legal-analyst',
    version: '1.0.0',
    displayName: 'Legal Analyst',
    domain: 'Legal Process Analysis',
    description:
      'JURISPRUDENCIA > OPINIAO. Triagem, Pesquisa, Analise, Fundamentacao, Validacao.',
    agentCount: 15,
  },
];

export async function list(): Promise<Squad[]> {
  return AIOS_SQUADS;
}

export async function getByName(name: string): Promise<Squad | null> {
  return AIOS_SQUADS.find((s) => s.name === name) || null;
}
