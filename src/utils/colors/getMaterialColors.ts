import {
  argbFromHex,
  hexFromArgb,
  Hct,
  DynamicScheme,
  DynamicColor,
  SchemeTonalSpot,
  SchemeFidelity,
  SchemeVibrant,
  SchemeExpressive,
  SchemeNeutral,
  SchemeMonochrome,
  SchemeContent,
  MaterialDynamicColors,
} from "@material/material-color-utilities";
import { hexToRGB } from "@/utils/colors/convert.ts";

export type SchemeVariant =
  | "tonalSpot"
  | "fidelity"
  | "vibrant"
  | "expressive"
  | "neutral"
  | "monochrome"
  | "content";

type MaterialColorKey = keyof typeof MaterialDynamicColors;

function getMaterialColors(
  colorHex: string,
  isDark: boolean = true,
  isTinted: boolean = true,
  schemeVariant: SchemeVariant = "tonalSpot",
): string {
  const hct = Hct.fromInt(argbFromHex(colorHex));

  let scheme: DynamicScheme;
  switch (schemeVariant) {
    case "fidelity":
      scheme = new SchemeFidelity(hct, isDark, 0.0);
      break;
    case "vibrant":
      scheme = new SchemeVibrant(hct, isDark, 0.0);
      break;
    case "expressive":
      scheme = new SchemeExpressive(hct, isDark, 0.0);
      break;
    case "neutral":
      scheme = new SchemeNeutral(hct, isDark, 0.0);
      break;
    case "monochrome":
      scheme = new SchemeMonochrome(hct, isDark, 0.0);
      break;
    case "content":
      scheme = new SchemeContent(hct, isDark, 0.0);
      break;
    case "tonalSpot":
    default:
      scheme = new SchemeTonalSpot(hct, isDark, 0.0);
      break;
  }

  const cssVariables: string[] = [];

  const paletteTones: number[] = isDark ? [4, 10, 12, 17, 22] : [100, 96, 94, 92, 90];
  if (paletteTones.length > 0) {
    const paletteKey = "surface";

    const palette = isTinted ? scheme.neutralVariantPalette : scheme.neutralPalette;

    for (let i = 0; i < paletteTones.length; i++) {
      const token = `--clr-${paletteKey}${i === 0 ? "" : `-${i}`}`;
      const color = hexFromArgb(palette.tone(paletteTones[i]));

      cssVariables.push(`${token}: ${color};`);
      cssVariables.push(`${token}-rgb: ${hexToRGB(color)};`);
    }
  }

  const schemeKeys: MaterialColorKey[] = [
    "primary",
    "onPrimary",
    "primaryContainer",
    "onPrimaryContainer",
    "secondary",
    "onSecondary",
    "secondaryContainer",
    "onSecondaryContainer",
    "tertiary",
    "onTertiary",
    "tertiaryContainer",
    "onTertiaryContainer",
    "error",
    "onError",
    "errorContainer",
    "onErrorContainer",
    "background",
    "onBackground",
    "onSurface",
    "surfaceVariant",
    "onSurfaceVariant",
    "outline",
    "outlineVariant",
    "shadow",
    "scrim",
    "inverseSurface",
    "inverseOnSurface",
    "inversePrimary",
  ];

  for (const key of schemeKeys) {
    const dynamicColor = MaterialDynamicColors[key] as DynamicColor;

    if (dynamicColor) {
      const argbValue = dynamicColor.getArgb(scheme);
      const color = hexFromArgb(argbValue);

      const token = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

      cssVariables.push(`--clr-${token}: ${color};`);
      cssVariables.push(`--clr-${token}-rgb: ${hexToRGB(color)};`);
    }
  }

  return `:root{\n${cssVariables.join("\n")}\n}`;
}

export default getMaterialColors;
