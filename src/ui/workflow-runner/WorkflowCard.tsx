import React from 'react';
import type { Workflow } from '../../sdk/types';
import { Card, CardHeader, CardContent } from '../primitives/Card';
import { Badge, type BadgeProps } from '../primitives/Badge';
import { Button } from '../primitives/Button';

const CAT_VARIANT: Record<Workflow['category'], BadgeProps['variant']> = {
  greenfield: 'success',
  brownfield: 'warning',
  story: 'info',
  qa: 'error',
  research: 'default',
  other: 'default',
};

export interface WorkflowCardProps {
  workflow: Workflow;
  onTrigger?: (w: Workflow) => void;
}

export function WorkflowCard({ workflow, onTrigger }: WorkflowCardProps) {
  return (
    <Card className="hover:border-aios-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-display text-base font-semibold text-aios-text-primary truncate">
              {workflow.name}
            </div>
            {workflow.estimatedDuration && (
              <div className="text-xs text-aios-text-muted">~{workflow.estimatedDuration}</div>
            )}
          </div>
          <Badge variant={CAT_VARIANT[workflow.category]}>{workflow.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        <p className="text-sm text-aios-text-secondary line-clamp-2">
          {workflow.description}
        </p>
        {workflow.agentSequence && workflow.agentSequence.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {workflow.agentSequence.map((a, i) => (
              <React.Fragment key={a + i}>
                {i > 0 && <span className="text-aios-text-muted">→</span>}
                <code className="px-1.5 py-0.5 rounded bg-aios-border/50 font-mono text-aios-text-secondary">
                  @{a}
                </code>
              </React.Fragment>
            ))}
          </div>
        )}
        <Button
          size="sm"
          variant="glowing"
          className="w-full"
          onClick={() => onTrigger?.(workflow)}
        >
          Trigger
        </Button>
      </CardContent>
    </Card>
  );
}
