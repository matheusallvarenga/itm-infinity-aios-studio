import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: 'h-4 w-48' },
};

export const TextLines: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-72">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <div className="w-72 rounded-xl border border-aios-border bg-aios-card-bg p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-md" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  ),
};

export const Circle: Story = {
  args: { className: 'h-12 w-12 rounded-full' },
};

export const MetricsGridSkeleton: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 w-80">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-aios-border bg-aios-card-bg p-4 flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-12" />
        </div>
      ))}
    </div>
  ),
};
