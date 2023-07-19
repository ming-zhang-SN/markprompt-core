export interface SubmitFeedbackBody {
    /**
     * Whether the prompt was helpful or not.
     */
    helpful: boolean;
    /** ID of the prompt for which feedback is being submitted. */
    promptId: string;
}
export interface SubmitFeedbackOptions {
    /**
     * URL to submit feedback to.
     * @default 'https://api.markprompt.com/v1/feedback'
     */
    apiUrl?: string;
    signal?: AbortSignal;
}
export declare const DEFAULT_SUBMIT_FEEDBACK_OPTIONS: {
    apiUrl: string;
};
export declare function submitFeedback(projectKey: string, body: SubmitFeedbackBody, options?: SubmitFeedbackOptions): Promise<void>;
//# sourceMappingURL=feedback.d.ts.map