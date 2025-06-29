'use server';
/**
 * @fileOverview An AI agent that explains code snippets.
 *
 * - explainCode - A function that handles the code explanation process.
 * - ExplainCodeInput - The input type for the explainCode function.
 * - ExplainCodeOutput - The return type for the explainCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to explain.'),
  language: z.string().describe('The programming language of the code snippet.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A clear and concise explanation of the code, formatted in basic HTML.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {schema: ExplainCodeInputSchema},
  output: {schema: ExplainCodeOutputSchema},
  prompt: `You are an expert developer and code reviewer.
Your task is to explain the following {{language}} code snippet.

Provide a clear and concise explanation. Focus on the code's purpose, what each part does, and how it works.
Format your explanation using simple HTML tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, and <code>. Do NOT use <html>, <head>, or <body> tags.

Code Snippet:
\`\`\`{{language}}
{{{code}}}
\`\`\`
`,
});

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
