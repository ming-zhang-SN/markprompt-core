import { parseEncodedJSONHeader } from './utils.js';
export const STREAM_SEPARATOR = '___START_RESPONSE_STREAM___';
export const DEFAULT_SUBMIT_PROMPT_OPTIONS = {
    apiUrl: 'https://api.markprompt.com/v1/completions',
    iDontKnowMessage: 'Sorry, I am not sure how to answer that.',
    model: 'gpt-3.5-turbo',
    promptTemplate: `You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "{{I_DONT_KNOW}}".\n\nContext sections:\n---\n{{CONTEXT}}\n\nQuestion: "{{PROMPT}}"\n\nAnswer (including related code snippets if available):`,
    temperature: 0.1,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    maxTokens: 500,
    sectionsMatchCount: 10,
    sectionsMatchThreshold: 0.5,
};
/**
 * Submit a prompt to the Markprompt Completions API.
 *
 * @param prompt - Prompt to submit to the model
 * @param projectKey - Project key for the project
 * @param onAnswerChunk - Answers come in via streaming. This function is called when a new chunk arrives
 * @param onReferences - This function is called when a chunk includes references.
 * @param onError - Called when an error occurs
 * @param [options] - Optional parameters
 */
export async function submitPrompt(prompt, projectKey, onAnswerChunk, onReferences, onError, options = {}, debug) {
    if (!projectKey) {
        throw new Error('A projectKey is required.');
    }
    if (!prompt)
        return;
    const iDontKnowMessage = options.iDontKnowMessage ?? DEFAULT_SUBMIT_PROMPT_OPTIONS.iDontKnowMessage;
    try {
        const res = await fetch(options.apiUrl ?? DEFAULT_SUBMIT_PROMPT_OPTIONS.apiUrl, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
                prompt: prompt,
                projectKey: projectKey,
                iDontKnowMessage,
                model: options?.model ?? DEFAULT_SUBMIT_PROMPT_OPTIONS.model,
                promptTemplate: options.promptTemplate ??
                    DEFAULT_SUBMIT_PROMPT_OPTIONS.promptTemplate,
                temperature: options.temperature ?? DEFAULT_SUBMIT_PROMPT_OPTIONS.temperature,
                topP: options.topP ?? DEFAULT_SUBMIT_PROMPT_OPTIONS.topP,
                frequencyPenalty: options.frequencyPenalty ??
                    DEFAULT_SUBMIT_PROMPT_OPTIONS.frequencyPenalty,
                presencePenalty: options.presencePenalty ??
                    DEFAULT_SUBMIT_PROMPT_OPTIONS.presencePenalty,
                maxTokens: options.maxTokens ?? DEFAULT_SUBMIT_PROMPT_OPTIONS.maxTokens,
                sectionsMatchCount: options.sectionsMatchCount ??
                    DEFAULT_SUBMIT_PROMPT_OPTIONS.sectionsMatchCount,
                sectionsMatchThreshold: options.sectionsMatchThreshold ??
                    DEFAULT_SUBMIT_PROMPT_OPTIONS.sectionsMatchThreshold,
            }),
            signal: options.signal,
        });
        if (!res.ok || !res.body) {
            const text = await res.text();
            onAnswerChunk(iDontKnowMessage);
            onError(new Error(text));
            return;
        }
        const data = parseEncodedJSONHeader(res, 'x-markprompt-data');
        const debugInfo = parseEncodedJSONHeader(res, 'x-markprompt-debug-info');
        if (debug && debugInfo) {
            // eslint-disable-next-line no-console
            console.debug(JSON.stringify(debugInfo, null, 2));
        }
        if (data?.references) {
            onReferences(data?.references);
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let startText = '';
        let hasPassedStreamSeparator = false;
        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            if (!hasPassedStreamSeparator) {
                startText = startText + chunkValue;
                // For backwards compatibility, we still stream the response
                // with reference ids first followed by the response, the two
                // parts being separated by `STREAM_SEPARATOR`.
                if (startText.includes(STREAM_SEPARATOR)) {
                    const parts = startText.split(STREAM_SEPARATOR);
                    if (parts[1]) {
                        onAnswerChunk(parts[1]);
                    }
                    hasPassedStreamSeparator = true;
                }
            }
            else if (chunkValue) {
                const shouldContinue = onAnswerChunk(chunkValue);
                if (!shouldContinue) {
                    // If callback returns false, it means it wishes
                    // to interrupt the streaming.
                    done = true;
                }
            }
        }
    }
    catch (error) {
        onError(error instanceof Error ? error : new Error(`${error}`));
    }
}
//# sourceMappingURL=prompt.js.map