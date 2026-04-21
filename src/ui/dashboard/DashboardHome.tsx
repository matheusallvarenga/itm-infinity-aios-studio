import { MetricsGrid } from './MetricsGrid';
import { TrendsChart } from './TrendsChart';
import { TopAgentsCard } from './TopAgentsCard';

export function DashboardHome() {
  return (
    <div className="space-y-6 p-6">
      <MetricsGrid />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendsChart />
        </div>
        <div>
          <TopAgentsCard />
        </div>
      </div>
    </div>
  );
}
