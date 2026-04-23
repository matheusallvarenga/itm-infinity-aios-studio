import { getAIOSClient } from '../lib/supabase';
import type { Story, StoryStatus, CreateStoryInput, ListOptions } from './types';

const TABLE = 'aios_stories';

/**
 * List stories with optional filtering/pagination.
 */
export async function list(options: ListOptions = {}): Promise<Story[]> {
  const client = getAIOSClient();
  let query = client.from(TABLE).select('*');

  if (options.filter) {
    for (const [k, v] of Object.entries(options.filter)) {
      query = query.eq(k, v as string);
    }
  }

  query = query.order(options.orderBy || 'created_at', {
    ascending: options.orderDirection === 'asc',
  });

  if (options.limit) query = query.limit(options.limit);
  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 100) - 1);
  }

  const { data, error } = await query;
  if (error) {
    throw { code: 'STORIES_LIST_FAILED', message: error.message, cause: error };
  }
  return (data as Story[]) || [];
}

/**
 * Fetch a single story by ID. Returns null if not found.
 */
export async function get(id: string): Promise<Story | null> {
  const client = getAIOSClient();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    throw { code: 'STORY_GET_FAILED', message: error.message, cause: error };
  }
  return (data as Story) || null;
}

/**
 * Create a new story. Defaults status to 'Draft' if not supplied.
 */
export async function create(input: CreateStoryInput): Promise<Story> {
  const client = getAIOSClient();
  const { data, error } = await client
    .from(TABLE)
    .insert({ ...input, status: input.status || 'Draft' })
    .select()
    .single();
  if (error) {
    throw { code: 'STORY_CREATE_FAILED', message: error.message, cause: error };
  }
  return data as Story;
}

/**
 * Update a story's status.
 */
export async function updateStatus(id: string, status: StoryStatus): Promise<Story> {
  const client = getAIOSClient();
  const { data, error } = await client
    .from(TABLE)
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    throw {
      code: 'STORY_STATUS_UPDATE_FAILED',
      message: error.message,
      cause: error,
    };
  }
  return data as Story;
}

/**
 * Partial update of a story.
 */
export async function update(id: string, patch: Partial<Story>): Promise<Story> {
  const client = getAIOSClient();
  const { data, error } = await client
    .from(TABLE)
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    throw { code: 'STORY_UPDATE_FAILED', message: error.message, cause: error };
  }
  return data as Story;
}

/**
 * Delete a story by ID.
 */
export async function remove(id: string): Promise<void> {
  const client = getAIOSClient();
  const { error } = await client.from(TABLE).delete().eq('id', id);
  if (error) {
    throw { code: 'STORY_DELETE_FAILED', message: error.message, cause: error };
  }
}
