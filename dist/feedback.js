export const DEFAULT_SUBMIT_FEEDBACK_OPTIONS = {
    apiUrl: 'https://api.markprompt.com/v1/feedback',
};
export async function submitFeedback(projectKey, body, options) {
    const { apiUrl = DEFAULT_SUBMIT_FEEDBACK_OPTIONS.apiUrl, signal } = options ?? {};
    const params = new URLSearchParams({
        projectKey,
    });
    try {
        const response = await fetch(apiUrl + `?${params}`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(body),
            signal,
        });
        if (!response.ok) {
            const error = (await response.json())?.error;
            throw new Error(`Failed to submit feedback: ${error || 'Unknown error'}`);
        }
        return response.json();
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
//# sourceMappingURL=feedback.js.map