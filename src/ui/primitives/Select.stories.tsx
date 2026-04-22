import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Select>
        <option value="">Select an option</option>
        <option value="greenfield">Greenfield Fullstack</option>
        <option value="brownfield">Brownfield Service</option>
        <option value="story">Story Development</option>
      </Select>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-64">
      <Select label="Workflow Type">
        <option value="">Select workflow</option>
        <option value="greenfield">Greenfield Fullstack</option>
        <option value="brownfield">Brownfield Service</option>
        <option value="story">Story Development</option>
        <option value="qa">QA Loop</option>
      </Select>
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="w-64">
      <Select label="Status" defaultValue="InProgress">
        <option value="Draft">Draft</option>
        <option value="Approved">Approved</option>
        <option value="InProgress">In Progress</option>
        <option value="Review">Review</option>
        <option value="Done">Done</option>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Select label="Priority" disabled defaultValue="high">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </Select>
    </div>
  ),
};
