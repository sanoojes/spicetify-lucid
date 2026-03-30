export function hexToRGB(hex: string): string {
  const parsed = hex.startsWith('#') ? hex.slice(1) : hex;
  const full =
    parsed.length === 3
      ? parsed
          .split('')
          .map((c) => c + c)
          .join('')
      : parsed;

  const int = parseInt(full, 16);
  return `${(int >> 16) & 255},${(int >> 8) & 255},${int & 255}`;
}
