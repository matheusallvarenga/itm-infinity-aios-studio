import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from './Button';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80 p-6">
      <p className="text-aios-text-primary">A simple card with content.</p>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Story 2.1</CardTitle>
        <CardDescription>Implement auth flow for agents</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-aios-text-secondary">
          Acceptance criteria defined. Ready for development.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Workflow Run</CardTitle>
        <CardDescription>greenfield-fullstack — completed</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-aios-text-secondary">Duration: 4.2s</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">View Logs</Button>
        <Button variant="ghost" size="sm">Dismiss</Button>
      </CardFooter>
    </Card>
  ),
};
