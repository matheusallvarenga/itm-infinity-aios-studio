import { useState } from 'react';
import { createAIOSClient } from '../lib/supabase';
import {
  AIOSLayout,
  AIOSTopbar,
  AIOSSidebar,
  DashboardHome,
  StoriesKanban,
  AgentsGrid,
  SquadsGrid,
  WorkflowsList,
  type AIOSView,
} from '../ui';

// Initialize SDK (reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from env)
try {
  createAIOSClient();
} catch (err) {
  // eslint-disable-next-line no-console
  console.warn('[AIOS Studio] Supabase client not initialized:', err);
}

const TITLES: Record<AIOSView, string> = {
  dashboard: 'Dashboard',
  stories: 'Stories',
  agents: 'Agents',
  squads: 'Squads',
  workflows: 'Workflows',
};

export function App() {
  const [view, setView] = useState<AIOSView>('dashboard');

  return (
    <AIOSLayout
      topbar={
        <AIOSTopbar
          title={`AIOS Studio — ${TITLES[view]}`}
          breadcrumb={['Studio', TITLES[view]]}
        />
      }
      sidebar={<AIOSSidebar current={view} onSelect={setView} />}
    >
      {view === 'dashboard' && <DashboardHome />}
      {view === 'stories' && <StoriesKanban />}
      {view === 'agents' && <AgentsGrid />}
      {view === 'squads' && <SquadsGrid />}
      {view === 'workflows' && <WorkflowsList />}
    </AIOSLayout>
  );
}
