import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './Dialog';
import { Button } from './Button';

const meta: Meta = {
  title: 'Primitives/Dialog',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent onClose={() => setOpen(false)}>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                This will trigger the workflow. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

export const WithLongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button variant="outline" onClick={() => setOpen(true)}>Open with details</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent onClose={() => setOpen(false)}>
            <DialogHeader>
              <DialogTitle>Story 3.2 — Details</DialogTitle>
              <DialogDescription>
                Full acceptance criteria and implementation notes.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-3 space-y-2 text-sm text-aios-text-secondary">
              <p>AC-1: Agent receives context from workflow_run.params</p>
              <p>AC-2: Story status transitions from InProgress → Review</p>
              <p>AC-3: file_list is updated on completion</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => setOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};
