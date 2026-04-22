import type { Meta, StoryObj } from '@storybook/react';
import { Input, Textarea } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter value...' },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};

export const WithLabel: Story = {
  args: { label: 'Story Title', placeholder: 'e.g. Implement auth flow' },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};

export const WithError: Story = {
  args: {
    label: 'Assignee',
    placeholder: '@dev',
    error: 'Agent not found in registry',
  },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};

export const Disabled: Story = {
  args: { label: 'Epic', value: 'foundation-quality', disabled: true },
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};

export const TextareaDefault: Story = {
  render: () => (
    <div className="w-72">
      <Textarea
        label="Acceptance Criteria"
        placeholder="AC-1: ...&#10;AC-2: ..."
        rows={4}
      />
    </div>
  ),
};

export const TextareaWithError: Story = {
  render: () => (
    <div className="w-72">
      <Textarea
        label="Description"
        error="Description is required"
        rows={3}
      />
    </div>
  ),
};
