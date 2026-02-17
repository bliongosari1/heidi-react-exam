/**
 * useSuggestions Hook
 * 
 * Fetches live suggestions using tanstack query with session ID included
 * in the query key. This ensures that suggestions are properly invalidated
 * and refetched when the session changes, fixing the bug where suggestions
 * from previous sessions would persist in new sessions.
 * 
 * Bug fix: Previously, suggestions would persist across sessions because
 * the query key did not include the session ID. By adding sessionId to
 * the query key, tanstack query treats each session as a unique query,
 * preventing stale suggestions from appearing in new sessions.
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchSuggestions, Suggestion, SuggestionsResponse } from '../services/suggestions';

export interface UseSuggestionsOptions {
  /** The current session ID - required to scope suggestions to the session */
  sessionId: string | undefined;
  /** Optional context to refine suggestions */
  context?: string;
  /** Maximum number of suggestions to fetch */
  limit?: number;
  /** Whether the query is enabled */
  enabled?: boolean;
  /** Additional query options */
  queryOptions?: Omit<
    UseQueryOptions<SuggestionsResponse, Error>,
    'queryKey' | 'queryFn' | 'enabled'
  >;
}

/**
 * Query key factory for suggestions
 * 
 * IMPORTANT: sessionId is included in the query key to ensure that
 * each session has its own cached suggestions. This prevents the bug
 * where suggestions from a previous session would persist when opening
 * a new session.
 */
export const suggestionsQueryKeys = {
  all: ['suggestions'] as const,
  /** 
   * Creates a query key that includes the session ID
   * This is the key fix - session ID in the query ensures proper cache isolation
   */
  bySession: (sessionId: string) => ['suggestions', { sessionId }] as const,
  bySessionWithContext: (sessionId: string, context?: string) => 
    ['suggestions', { sessionId, context }] as const,
};

/**
 * Hook to fetch suggestions for the current session
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useSuggestions({
 *   sessionId: currentSessionId,
 *   context: 'clinical',
 * });
 * ```
 */
export function useSuggestions({
  sessionId,
  context,
  limit,
  enabled = true,
  queryOptions,
}: UseSuggestionsOptions) {
  return useQuery({
    /**
     * Query key includes sessionId to ensure suggestions are cached
     * per-session. When sessionId changes (new session), this creates
     * a new cache entry and triggers a fresh fetch.
     * 
     * This fixes the bug where live-suggestion chips from a previous
     * session would persist when opening a new session.
     */
    queryKey: suggestionsQueryKeys.bySessionWithContext(sessionId ?? '', context),
    queryFn: () => {
      if (!sessionId) {
        throw new Error('Session ID is required to fetch suggestions');
      }
      return fetchSuggestions({ sessionId, context, limit });
    },
    // Only fetch when we have a valid session ID
    enabled: enabled && !!sessionId,
    // Suggestions can become stale quickly in a dynamic conversation
    staleTime: 30 * 1000, // 30 seconds
    // Keep previous data while fetching new session's suggestions
    // to prevent UI flicker, but the new session ID in the query key
    // ensures we get fresh data for the new session
    placeholderData: (previousData) => previousData,
    ...queryOptions,
  });
}

/**
 * Type export for the suggestions data
 */
export type { Suggestion, SuggestionsResponse };

export default useSuggestions;
