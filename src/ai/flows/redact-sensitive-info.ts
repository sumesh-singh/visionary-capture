// This is an AI-powered tool that automatically detects and redacts sensitive information from screenshots.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RedactSensitiveInfoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the screenshot to redact, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type RedactSensitiveInfoInput = z.infer<typeof RedactSensitiveInfoInputSchema>;

const RedactSensitiveInfoOutputSchema = z.object({
  redactedPhotoDataUri: z
    .string()
    .describe(
      'A photo of the screenshot with sensitive information redacted, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});

export type RedactSensitiveInfoOutput = z.infer<typeof RedactSensitiveInfoOutputSchema>;

export async function redactSensitiveInfo(input: RedactSensitiveInfoInput): Promise<RedactSensitiveInfoOutput> {
  return redactSensitiveInfoFlow(input);
}

const redactSensitiveInfoPrompt = ai.definePrompt({
  name: 'redactSensitiveInfoPrompt',
  input: {schema: RedactSensitiveInfoInputSchema},
  output: {schema: RedactSensitiveInfoOutputSchema},
  prompt: `You are an AI that redacts sensitive information from screenshots.

  The user will provide you with a screenshot as a data URI.
  Your task is to identify and redact any sensitive information, such as email addresses, phone numbers, credit card numbers, etc.
  Return the redacted screenshot as a data URI in the same format as the input.

  Here is the screenshot:
  {{media url=photoDataUri}}
  `,
});

const redactSensitiveInfoFlow = ai.defineFlow(
  {
    name: 'redactSensitiveInfoFlow',
    inputSchema: RedactSensitiveInfoInputSchema,
    outputSchema: RedactSensitiveInfoOutputSchema,
  },
  async input => {
    const {output} = await redactSensitiveInfoPrompt(input);
    return output!;
  }
);
