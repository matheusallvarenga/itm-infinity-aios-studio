# Example: Learn Studio → AIOS Story from Chat

This example shows how the **Learn Studio** (a sibling studio inside
`itm-legendary-infinity-os`) can turn a chat session into an AIOS story —
without rendering any AIOS UI.

## Scenario

A user finishes a Learn Studio chat that surfaces an actionable finding
("refactor auth middleware to support SSO"). Learn wants to:

1. Summarise the chat.
2. Create a story in AIOS with the summary as the title.
3. Trigger the `story-development-cycle` workflow so AIOS picks it up.
4. Link the run ID back to the chat for traceability.

## Full Code

```ts
// src/studios/learn/services/chat-to-aios.ts
import {
  stories,
  workflows,
  type Story,
  type WorkflowRun,
} from 'itm-infinity-aios-studio/sdk'

export interface ChatToAIOSInput {
  chatId: string
  summary: string            // ≤ 80 chars recommended
  epic?: string              // defaults to 'learn-auto'
  userId: string
}

export interface ChatToAIOSResult {
  story: Story
  run: WorkflowRun
}

/**
 * Promotes a Learn Studio chat session into an AIOS story + kicks off
 * the development cycle workflow.
 *
 * Assumes `bootstrapAIOS()` has been called at app startup (see
 * docs/integration.md §3.8).
 */
export async function chatToAIOSStory(
  input: ChatToAIOSInput,
): Promise<ChatToAIOSResult> {
  // 1. Create the story
  const story = await stories.create({
    title: input.summary.slice(0, 80),
    epic: input.epic ?? 'learn-auto',
    status: 'Draft',
    priority: 'medium',
    metadata: {
      source: 'learn-studio',
      chatId: input.chatId,
      createdBy: input.userId,
      createdVia: 'chatToAIOSStory',
    },
  })

  // 2. Trigger the development-cycle workflow for the new story
  const run = await workflows.trigger({
    workflow_name: 'story-development-cycle',
    params: { story_id: story.id },
    triggered_by: `learn:${input.userId}`,
  })

  return { story, run }
}
```

## Usage from a Learn Studio component

```tsx
// src/studios/learn/components/PromoteToAIOSButton.tsx
import { useState } from 'react'
import { chatToAIOSStory } from '../services/chat-to-aios'

export function PromoteToAIOSButton({ chatId, summary, userId }: Props) {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleClick() {
    setPending(true)
    try {
      const { story, run } = await chatToAIOSStory({ chatId, summary, userId })
      setResult(`Story ${story.id} created. Workflow run ${run.id} queued.`)
    } catch (err) {
      setResult(`Error: ${(err as Error).message}`)
    } finally {
      setPending(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={pending}>
      {pending ? 'Promoting...' : 'Promote to AIOS'}
    </button>
  )
}
```

## What happens next

- AIOS Kanban (`StoriesKanban`) immediately shows the new story in the
  `Draft` column — the realtime Supabase channel pushes the insert.
- Workflow Runner (`WorkflowsList` → `WorkflowHistory`) shows the run
  moving from `pending` → `running`.
- Metrics dashboard counts the new execution toward the daily totals.

All three views update without the Learn Studio knowing about them — the
shared Supabase singleton and `@supabase/supabase-js` realtime channels
do the propagation.

## Related

- [Integration Guide §4](../integration.md#4-sdk-usage-in-background-services)
- [ADR-001: Dual Surface Architecture](../adr/001-dual-surface-architecture.md)
