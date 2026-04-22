import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Default', variant: 'default' },
};

export const Success: Story = {
  args: { children: 'Completed', variant: 'success' },
};

export const Warning: Story = {
  args: { children: 'Running', variant: 'warning' },
};

export const Error: Story = {
  args: { children: 'Failed', variant: 'error' },
};

export const Info: Story = {
  args: { children: 'Pending', variant: 'info' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Completed</Badge>
      <Badge variant="warning">Running</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="info">Pending</Badge>
    </div>
  ),
};
