/**
 * Suggestions service for fetching live suggestions
 * 
 * This service handles fetching suggestions that are displayed as chips
 * in the evidence panel.
 */

export interface Suggestion {
  id: string;
  text: string;
  type: 'question' | 'action' | 'info';
  icon?: string;
  category?: string;
}

export interface SuggestionsResponse {
  suggestions: Suggestion[];
  sessionId: string;
}

export interface FetchSuggestionsParams {
  sessionId: string;
  context?: string;
  limit?: number;
}

/**
 * Fetch suggestions for a given session
 * 
 * @param params - Parameters including sessionId, context, and limit
 * @returns Promise resolving to suggestions for the session
 */
export async function fetchSuggestions(params: FetchSuggestionsParams): Promise<SuggestionsResponse> {
  const { sessionId, context, limit = 10 } = params;
  
  const queryParams = new URLSearchParams({
    sessionId,
    ...(context && { context }),
    limit: limit.toString(),
  });

  const response = await fetch(`/api/suggestions?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
  }
  
  return response.json();
}

export default {
  fetchSuggestions,
};
