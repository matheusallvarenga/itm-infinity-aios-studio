import { useEffect, useState } from 'react';
import * as agentsSdk from '../../sdk/agents';
import type { Agent } from '../../sdk/types';
import { AgentCard } from './AgentCard';
import { AgentDetail } from './AgentDetail';
import { Skeleton } from '../primitives/Skeleton';

export function AgentsGrid() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    agentsSdk
      .list()
      .then((res) => {
        if (mounted) {
          setAgents(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.message || 'Failed to load agents');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-aios-error text-sm">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a) => (
          <AgentCard
            key={a.id}
            agent={a}
            onClick={(agent) => {
              setSelected(agent);
              setOpen(true);
            }}
          />
        ))}
      </div>
      <AgentDetail agent={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
