import { argbFromHex, hexFromArgb, themeFromSourceColor } from "@material/material-color-utilities";
import { hexToRGB } from "@/utils/colors/convert.ts";

function getMaterialColors(colorHex: string, isDark: boolean = true, isTinted: boolean = true) {
  const theme = themeFromSourceColor(argbFromHex(colorHex));
  const scheme = (isDark ? theme.schemes.dark : theme.schemes.light).toJSON();

  const cssVariables: string[] = [];

  // material palette tones for surface container
  // referenced from https://github.com/material-foundation/material-color-utilities/blob/main/dart/lib/dynamiccolor/material_dynamic_colors.dart
  const paletteTones: number[] = isDark ? [4, 10, 12, 17, 22] : [100, 96, 94, 92, 90];
  if (paletteTones.length) {
    const paletteKey = "surface";
    for (let i = 0; i < paletteTones.length; i++) {
      const token = `--clr-${paletteKey}${i === 0 ? "" : `-${i}`}`;
      const color = hexFromArgb(
        theme.palettes[isTinted ? "neutralVariant" : "neutral"].tone(paletteTones[i]),
      );
      cssVariables.push(`${token}: ${color};`);
      cssVariables.push(`${token}-rgb: ${hexToRGB(color)};`);
    }
  }

  // Add scheme properties
  for (const [key, value] of Object.entries(scheme)) {
    if (key === "surface") continue; // skip 'surface'
    const token = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const color = hexFromArgb(value);
    cssVariables.push(`--clr-${token}: ${color};`);
    cssVariables.push(`--clr-${token}-rgb: ${hexToRGB(color)};`);
  }

  return `:root{\n${cssVariables.join("\n")}\n}`;
}
export default getMaterialColors;
