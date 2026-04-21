import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import * as metricsSdk from '../../sdk/metrics';
import type { MetricsTrendPoint } from '../../sdk/types';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/Card';
import { Skeleton } from '../primitives/Skeleton';

export function TrendsChart() {
  const [data, setData] = useState<MetricsTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    metricsSdk
      .getTrends()
      .then((points) => {
        if (mounted) {
          setData(points);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.message || 'Failed to load trends');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executions (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : error ? (
          <div className="text-aios-error text-sm">Error: {error}</div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-aios-text-muted text-sm">
            No execution data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorExec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2832" />
              <XAxis dataKey="timestamp" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: '#141220',
                  border: '1px solid #2a2832',
                  borderRadius: 6,
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="executions"
                stroke="#A78BFA"
                fill="url(#colorExec)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
