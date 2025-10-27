'use server';

/**
 * @fileOverview An AI tool that analyzes the artist's work and suggests optimal style and layout options for their portfolio.
 *
 * - getStyleRecommendations - A function that handles the style recommendation process.
 * - StyleRecommendationsInput - The input type for the getStyleRecommendations function.
 * - StyleRecommendationsOutput - The return type for the getStyleRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleRecommendationsInputSchema = z.object({
  artworkSamples: z
    .array(z.string())
    .describe(
      "A list of artwork samples as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  artistPreferences: z.string().optional().describe('Optional preferences of the artist.'),
});
export type StyleRecommendationsInput = z.infer<typeof StyleRecommendationsInputSchema>;

const StyleRecommendationsOutputSchema = z.object({
  styleSuggestions: z.array(z.string()).describe('A list of style suggestions for the portfolio.'),
  layoutSuggestions: z.array(z.string()).describe('A list of layout suggestions for the portfolio.'),
  colorPaletteSuggestions: z.array(z.string()).describe('A list of color palette suggestions.'),
  typographySuggestions: z.array(z.string()).describe('A list of typography suggestions.'),
});
export type StyleRecommendationsOutput = z.infer<typeof StyleRecommendationsOutputSchema>;

export async function getStyleRecommendations(input: StyleRecommendationsInput): Promise<StyleRecommendationsOutput> {
  return styleRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleRecommendationsPrompt',
  input: {schema: StyleRecommendationsInputSchema},
  output: {schema: StyleRecommendationsOutputSchema},
  prompt: `You are an AI assistant that provides style and layout recommendations for an artist's portfolio based on their existing work.

  Analyze the provided artwork samples and artist preferences (if any) to suggest optimal styles, layouts, color palettes, and typography for the portfolio.

  Artwork Samples:{{#each artworkSamples}} {{media url=this}}{{#unless @last}}, {{/unless}}{{/each}}
  Artist Preferences: {{{artistPreferences}}}

  Provide suggestions for:
  - styleSuggestions: A list of styles that would be visually appealing and cohesive for the portfolio.
  - layoutSuggestions: A list of layout options that would showcase the artwork effectively.
  - colorPaletteSuggestions: A list of color palettes that complement the artwork.
  - typographySuggestions: A list of typography options that enhance the overall design.
`,
});

const styleRecommendationsFlow = ai.defineFlow(
  {
    name: 'styleRecommendationsFlow',
    inputSchema: StyleRecommendationsInputSchema,
    outputSchema: StyleRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
