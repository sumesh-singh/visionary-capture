// 'use server';

/**
 * @fileOverview An AI agent that extracts text from a screenshot.
 *
 * - extractTextFromScreenshot - A function that handles the text extraction process.
 * - ExtractTextFromScreenshotInput - The input type for the extractTextFromScreenshot function.
 * - ExtractTextFromScreenshotOutput - The return type for the extractTextFromScreenshot function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextFromScreenshotInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A screenshot, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromScreenshotInput = z.infer<typeof ExtractTextFromScreenshotInputSchema>;

const ExtractTextFromScreenshotOutputSchema = z.object({
  extractedText: z.string().describe('The extracted text from the screenshot.'),
});
export type ExtractTextFromScreenshotOutput = z.infer<typeof ExtractTextFromScreenshotOutputSchema>;

export async function extractTextFromScreenshot(input: ExtractTextFromScreenshotInput): Promise<ExtractTextFromScreenshotOutput> {
  return extractTextFromScreenshotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTextFromScreenshotPrompt',
  input: {schema: ExtractTextFromScreenshotInputSchema},
  output: {schema: ExtractTextFromScreenshotOutputSchema},
  prompt: `Extract the text from the following screenshot:

  {{media url=photoDataUri}}
  `,
});

const extractTextFromScreenshotFlow = ai.defineFlow(
  {
    name: 'extractTextFromScreenshotFlow',
    inputSchema: ExtractTextFromScreenshotInputSchema,
    outputSchema: ExtractTextFromScreenshotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
