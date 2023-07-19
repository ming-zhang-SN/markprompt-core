import { getErrorMessage } from './utils.js';
export const DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS = {
    limit: 8,
    apiUrl: 'datahub-brain.smartnews.net/hack',
};
/**
 * Submit a search query to the Markprompt Search API.
 * @param query - Search query
 * @param projectKey - Project key for the project
 * @param [options] - Optional parameters
 * @returns Search results
 */
export async function submitSearchQuery(query, projectKey, options) {
    try {
        const { limit = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.limit, apiUrl = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.apiUrl, } = options ?? {};
        const params = new URLSearchParams({
            query,
            projectKey,
            limit: String(limit),
        });
        const res = await fetch(`${apiUrl}?${params.toString()}`, {
            method: 'GET',
            signal: options?.signal,
        });
        if (!res.ok) {
            const message = await getErrorMessage(res);
            throw new Error(`Failed to fetch search results: ${message || 'Unknown error'}`);
        }
        return res.json();
    }
    catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            // do nothing on AbortError's, this is expected
            return undefined;
        }
        else {
            throw error;
        }
    }
}
/**
 * Submit a search query to the Algolia Docsearch API.
 * @param query - Search query
 * @param [options] - Optional parameters
 * @returns Search results
 */
export async function submitAlgoliaDocsearchQuery(query, options) {
    try {
        const provider = options?.provider;
        if (provider?.name !== 'algolia') {
            throw new Error(`Missing Algolia options.`);
        }
        const { limit = DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS.limit } = options ?? {};
        const res = await fetch(`https://${provider.appId}-dsn.algolia.net/1/indexes/${provider.indexName}/query`, {
            method: 'POST',
            body: JSON.stringify({
                query,
                hitsPerPage: limit,
                getRankingInfo: 1,
                ...options?.provider?.searchParameters,
            }),
            signal: options?.signal,
            headers: {
                'X-Algolia-API-Key': provider.apiKey,
                'X-Algolia-Application-Id': provider.appId,
            },
        });
        if (!res.ok) {
            const message = await getErrorMessage(res);
            throw new Error(`Failed to fetch search results: ${message || 'Unknown error'}`);
        }
        return res.json();
    }
    catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            // do nothing on AbortError's, this is expected
            return undefined;
        }
        else {
            throw error;
        }
    }
}
//# sourceMappingURL=search.js.map