import type { FileSectionReference, OpenAIModelId } from './types.js';
export type SubmitPromptOptions = {
    /**
     * URL at which to fetch completions
     * @default "https://api.markprompt.com/v1/completions"
     * */
    apiUrl?: string;
    /**
     * Message returned when the model does not have an answer
     * @default "Sorry, I am not sure how to answer that."
     **/
    iDontKnowMessage?: string;
    /**
     * The OpenAI model to use
     * @default "gpt-3.5-turbo"
     **/
    model?: OpenAIModelId;
    /**
     * The prompt template
     * @default "You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say \"{{I_DONT_KNOW}}\".\n\nContext sections:\n---\n{{CONTEXT}}\n\nQuestion: \"{{PROMPT}}\"\n\nAnswer (including related code snippets if available):\n"
     **/
    promptTemplate?: string;
    /**
     * The model temperature
     * @default 0.1
     **/
    temperature?: number;
    /**
     * The model top P
     * @default 1
     **/
    topP?: number;
    /**
     * The model frequency penalty
     * @default 0
     **/
    frequencyPenalty?: number;
    /**
     * The model present penalty
     * @default 0
     **/
    presencePenalty?: number;
    /**
     * The max number of tokens to include in the response
     * @default 500
     * */
    maxTokens?: number;
    /**
     * The number of sections to include in the prompt context
     * @default 10
     * */
    sectionsMatchCount?: number;
    /**
     * The similarity threshold between the input question and selected sections
     * @default 0.5
     * */
    sectionsMatchThreshold?: number;
    /**
     * AbortController signal
     * @default undefined
     **/
    signal?: AbortSignal;
};
export declare const STREAM_SEPARATOR = "___START_RESPONSE_STREAM___";
export declare const DEFAULT_SUBMIT_PROMPT_OPTIONS: SubmitPromptOptions;
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
export declare function submitPrompt(prompt: string, projectKey: string, onAnswerChunk: (answerChunk: string) => boolean | undefined | void, onReferences: (references: FileSectionReference[]) => void, onError: (error: Error) => void, options?: SubmitPromptOptions, debug?: boolean): Promise<void>;
//# sourceMappingURL=prompt.d.ts.map