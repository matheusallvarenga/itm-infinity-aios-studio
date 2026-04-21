import { useEffect, useState } from 'react';
import * as squadsSdk from '../../sdk/squads';
import type { Squad } from '../../sdk/types';
import { SquadCard } from './SquadCard';
import { SquadDetail } from './SquadDetail';
import { Skeleton } from '../primitives/Skeleton';

export function SquadsGrid() {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Squad | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    squadsSdk
      .list()
      .then((res) => {
        if (mounted) {
          setSquads(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.message || 'Failed to load squads');
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
        {squads.map((s) => (
          <SquadCard
            key={s.id}
            squad={s}
            onClick={(squad) => {
              setSelected(squad);
              setOpen(true);
            }}
          />
        ))}
      </div>
      <SquadDetail squad={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
