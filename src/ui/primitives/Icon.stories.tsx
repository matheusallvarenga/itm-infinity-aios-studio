import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    name: { control: 'text' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    strokeWidth: { control: { type: 'range', min: 0.5, max: 3, step: 0.5 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'HomeSimple', size: 'md' },
};

export const Settings: Story = {
  args: { name: 'Settings', size: 'md', label: 'Settings' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4 text-aios-text-primary">
      <Icon name="ViewGrid" size="xs" />
      <Icon name="ViewGrid" size="sm" />
      <Icon name="ViewGrid" size="md" />
      <Icon name="ViewGrid" size="lg" />
      <Icon name="ViewGrid" size="xl" />
    </div>
  ),
};

export const CommonIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 text-aios-text-primary">
      {['HomeSimple', 'Settings', 'ViewGrid', 'User', 'PlaySolid', 'StopSolid', 'Code', 'DataBase'].map(
        (name) => (
          <div key={name} className="flex flex-col items-center gap-1">
            <Icon name={name} size="lg" />
            <span className="text-xs text-aios-text-secondary">{name}</span>
          </div>
        )
      )}
    </div>
  ),
};

export const UnknownFallback: Story = {
  args: { name: 'NonExistentIcon123', size: 'md' },
};
