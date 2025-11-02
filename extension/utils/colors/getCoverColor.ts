import type { ExtractedColor } from '@utils/graphql/getters.ts';
import { getExtractedColors } from '@utils/graphql/getters.ts';

export async function getCoverColor(imageUrl: string): Promise<ExtractedColor | undefined> {
  // Try getting colour from Spotify first
  const spotifyColors = await getExtractedColors([imageUrl]);

  const extracted = spotifyColors?.data?.extractedColors?.[0];

  if (extracted && !extracted.colorRaw?.fallback) {
    return extracted;
  }

  // Fallback to Spicetify's extractColorPreset for local tracks
  const [colorData] = await Spicetify.extractColorPreset(imageUrl);

  if (colorData && !colorData.isFallback) {
    return {
      // Convert the Color object to the "#abcdef" format
      colorRaw: { hex: colorData.colorRaw.toCSS(Spicetify.Color.CSSFormat.HEX), fallback: false },
      colorDark: { hex: colorData.colorDark.toCSS(Spicetify.Color.CSSFormat.HEX), fallback: false },
      colorLight: { hex: colorData.colorLight.toCSS(Spicetify.Color.CSSFormat.HEX), fallback: false }
    };
  }

  // Else, return undefined
  return undefined;
}
