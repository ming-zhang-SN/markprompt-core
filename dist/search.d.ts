import type { AlgoliaDocSearchResultsResponse, SearchResultsResponse } from './types.js';
export interface SubmitSearchQueryOptions {
    /**
     * Maximum amount of results to return
     * @default 8
     **/
    limit?: number;
    /**
     * URL at which to fetch search results
     * @default "datahub-brain.smartnews.net/hack"
     **/
    apiUrl?: string;
    /**
     * Custom provider id
     * @default undefined
     **/
    provider?: AlgoliaProvider;
    /**
     * AbortController signal
     * @default undefined
     **/
    signal?: AbortSignal;
}
export interface AlgoliaProvider {
    name: 'algolia';
    /**
     * Algolia API key
     **/
    apiKey: string;
    /**
     * Algolia application ID
     **/
    appId: string;
    /**
     * Algolia index name
     **/
    indexName: string;
    /**
     * Algolia search parameters, like `faceFilters`
     **/
    searchParameters?: any;
}
export declare const DEFAULT_SUBMIT_SEARCH_QUERY_OPTIONS: SubmitSearchQueryOptions;
/**
 * Submit a search query to the Markprompt Search API.
 * @param query - Search query
 * @param projectKey - Project key for the project
 * @param [options] - Optional parameters
 * @returns Search results
 */
export declare function submitSearchQuery(query: string, projectKey: string, options?: SubmitSearchQueryOptions): Promise<SearchResultsResponse | undefined>;
/**
 * Submit a search query to the Algolia Docsearch API.
 * @param query - Search query
 * @param [options] - Optional parameters
 * @returns Search results
 */
export declare function submitAlgoliaDocsearchQuery(query: string, options?: SubmitSearchQueryOptions): Promise<AlgoliaDocSearchResultsResponse | undefined>;
//# sourceMappingURL=search.d.ts.map