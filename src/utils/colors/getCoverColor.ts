import type { ExtractedColor } from "@/utils/graphql/getters.ts";
import { getExtractedColors } from "@/utils/graphql/getters.ts";

export async function getCoverColor(imageUrl: string): Promise<ExtractedColor | undefined> {
  try {
    const spotifyColors = await getExtractedColors([imageUrl]);
    const extracted = spotifyColors?.data?.extractedColors?.[0];

    if (extracted && !extracted.colorRaw?.fallback) {
      return extracted;
    }
  } catch (error) {
    console.warn("Failed to fetch colors from Spotify API:", error);
  }

  try {
    const [colorData] = await Spicetify.extractColorPreset(imageUrl);

    if (colorData && !colorData.isFallback) {
      return {
        colorRaw: { hex: colorData.colorRaw.toCSS(Spicetify.Color.CSSFormat.HEX), fallback: false },
        colorDark: {
          hex: colorData.colorDark.toCSS(Spicetify.Color.CSSFormat.HEX),
          fallback: false,
        },
        colorLight: {
          hex: colorData.colorLight.toCSS(Spicetify.Color.CSSFormat.HEX),
          fallback: false,
        },
      };
    }
  } catch (error) {
    console.warn("Failed to extract color preset via Spicetify:", error);
  }

  try {
    return await extractCanvasColor(imageUrl);
  } catch (error) {
    console.error("Canvas color extraction failed:", error);
  }

  return undefined;
}

async function extractCanvasColor(imageUrl: string): Promise<ExtractedColor | undefined> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = imageUrl.startsWith("spotify:") ? null : "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return resolve(undefined);

        canvas.width = 1;
        canvas.height = 1;
        ctx.drawImage(img, 0, 0, 1, 1);

        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

        resolve({
          colorRaw: { hex: rgbToHex(r, g, b), fallback: true },
          colorDark: { hex: adjustBrightness(r, g, b, 0.6), fallback: true },
          colorLight: { hex: adjustBrightness(r, g, b, 1.4), fallback: true },
        });
      } catch {
        resolve(undefined);
      }
    };

    img.onerror = () => resolve(undefined);
    img.src = imageUrl;
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

function adjustBrightness(r: number, g: number, b: number, factor: number): string {
  const clamp = (val: number) => Math.min(255, Math.max(0, Math.round(val * factor)));
  return rgbToHex(clamp(r), clamp(g), clamp(b));
}
