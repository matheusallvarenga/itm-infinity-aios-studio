import { useState } from 'react';
import type { Workflow, WorkflowRun } from '../../sdk/types';
import * as workflowsSdk from '../../sdk/workflows';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../primitives/Dialog';
import { Button } from '../primitives/Button';
import { Textarea } from '../primitives/Input';
import { Badge } from '../primitives/Badge';

export interface RunDialogProps {
  workflow: Workflow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTriggered?: (run: WorkflowRun) => void;
}

export function RunDialog({ workflow, open, onOpenChange, onTriggered }: RunDialogProps) {
  const [paramsJson, setParamsJson] = useState('{}');
  const [submitting, setSubmitting] = useState(false);
  const [run, setRun] = useState<WorkflowRun | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrigger = async () => {
    if (!workflow) return;
    let params: Record<string, unknown> = {};
    try {
      params = paramsJson.trim() ? JSON.parse(paramsJson) : {};
    } catch {
      setError('Invalid JSON');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await workflowsSdk.trigger({ workflow_name: workflow.name, params });
      setRun(res);
      onTriggered?.(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to trigger workflow');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (o: boolean) => {
    if (!o) {
      setParamsJson('{}');
      setRun(null);
      setError(null);
    }
    onOpenChange(o);
  };

  if (!workflow) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent onClose={() => handleClose(false)}>
        <DialogHeader>
          <DialogTitle>Trigger: {workflow.name}</DialogTitle>
          <DialogDescription>{workflow.description}</DialogDescription>
        </DialogHeader>

        {!run ? (
          <>
            <Textarea
              label="Params (JSON)"
              value={paramsJson}
              onChange={(e) => setParamsJson(e.target.value)}
              rows={6}
              className="font-mono text-sm"
              placeholder='{"storyId": "..."}'
            />
            {error && <p className="mt-2 text-xs text-aios-error">{error}</p>}
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button
                variant="glowing"
                disabled={submitting}
                onClick={handleTrigger}
              >
                {submitting ? 'Triggering...' : 'Trigger'}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-aios-text-muted">Run ID:</span>
              <code className="font-mono text-aios-primary">{run.id}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-aios-text-muted">Status:</span>
              <Badge
                variant={
                  run.status === 'completed'
                    ? 'success'
                    : run.status === 'failed'
                      ? 'error'
                      : 'info'
                }
              >
                {run.status}
              </Badge>
            </div>
            <Button onClick={() => handleClose(false)} className="w-full mt-2">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
