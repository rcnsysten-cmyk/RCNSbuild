// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview A translation AI agent for build information.
 *
 * - translateBuildInfo - A function that translates build information to a specified language.
 * - TranslateBuildInfoInput - The input type for the translateBuildInfo function.
 * - TranslateBuildInfoOutput - The return type for the translateBuildInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateBuildInfoInputSchema = z.object({
  text: z.string().describe('The build information to translate.'),
  language: z
    .enum(['Portuguese', 'English', 'Spanish'])
    .describe('The target language for the translation.'),
});
export type TranslateBuildInfoInput = z.infer<typeof TranslateBuildInfoInputSchema>;

const TranslateBuildInfoOutputSchema = z.object({
  translatedText: z.string().describe('The translated build information.'),
});
export type TranslateBuildInfoOutput = z.infer<typeof TranslateBuildInfoOutputSchema>;

export async function translateBuildInfo(input: TranslateBuildInfoInput): Promise<TranslateBuildInfoOutput> {
  return translateBuildInfoFlow(input);
}

const translateBuildInfoPrompt = ai.definePrompt({
  name: 'translateBuildInfoPrompt',
  input: {schema: TranslateBuildInfoInputSchema},
  output: {schema: TranslateBuildInfoOutputSchema},
  prompt: `Translate the following build information to {{language}}:

{{{text}}}`,
});

const translateBuildInfoFlow = ai.defineFlow(
  {
    name: 'translateBuildInfoFlow',
    inputSchema: TranslateBuildInfoInputSchema,
    outputSchema: TranslateBuildInfoOutputSchema,
  },
  async input => {
    const {output} = await translateBuildInfoPrompt(input);
    return output!;
  }
);
