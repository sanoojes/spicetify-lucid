export type GoogleFont = {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  category: string;
  kind: string;
};

const API_KEY = 'AIzaSyAwBDuGYjhn4LTTkLShD0LLRTs8oGsxVhw'; // public key ??
const API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

const loadedFonts = new Set<string>();

let fontsCache: GoogleFont[] | null = null;
let fontsCacheTimestamp: number | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  if (fontsCache && fontsCacheTimestamp && Date.now() - fontsCacheTimestamp < CACHE_DURATION) {
    return fontsCache;
  }

  if (!API_KEY) {
    throw new Error('Google Fonts API key is not configured');
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}&sort=popularity`);
    if (!response.ok) {
      throw new Error('Failed to fetch Google Fonts');
    }
    const data = await response.json();
    fontsCache = data.items;
    fontsCacheTimestamp = Date.now();
    return data.items;
  } catch (error) {
    if (fontsCache) {
      return fontsCache;
    }
    console.error('Error fetching Google Fonts:', error);
    throw error;
  }
}

export function getFontUrl(family: string, variants: string[]): string {
  const fontFamily = family.replace(/\s+/g, '+');

  const weights = new Set<string>();
  const italics = new Set<string>();

  for (const variant of variants) {
    if (variant === 'regular') {
      weights.add('400');
    } else if (variant === 'italic') {
      italics.add('400');
    } else if (/italic/.test(variant)) {
      const match = variant.match(/^(\d+)italic$/);
      if (match) italics.add(match[1]);
    } else {
      weights.add(variant);
    }
  }

  let variantString = '';

  if (italics.size > 0 && weights.size > 0) {
    const entries: string[] = [];
    italics.forEach((weight) => {
      entries.push(`1,${weight}`);
    });
    weights.forEach((weight) => {
      entries.push(`0,${weight}`);
    });

    entries.sort((a, b) => {
      const [aItalic, aWeight] = a.split(',').map(Number);
      const [bItalic, bWeight] = b.split(',').map(Number);
      return aItalic - bItalic || aWeight - bWeight;
    });

    variantString = `ital,wght@${entries.join(';')}`;
  } else if (italics.size > 0) {
    const sorted = [...italics].map(Number).sort((a, b) => a - b);
    variantString = `ital,wght@${sorted.map((w) => `1,${w}`).join(';')}`;
  } else if (weights.size > 0) {
    const sorted = [...weights].map(Number).sort((a, b) => a - b);
    variantString = `wght@${sorted.join(';')}`;
  }
  return `https://fonts.googleapis.com/css2?family=${fontFamily}${variantString ? `:${variantString}` : ''}&display=swap`;
}

export async function loadFont(fontFamily: string, variant = 'regular'): Promise<void> {
  if (loadedFonts.has(fontFamily)) {
    return;
  }

  function getFontUrl(family: string, variant = 'regular'): string {
    const fontFamily = family.replace(/\s+/g, '+');
    const fontVariant = variant === 'regular' ? '400' : variant;
    return `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${fontVariant}&display=swap`;
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.href = getFontUrl(fontFamily, variant);
    link.rel = 'stylesheet';

    link.onload = () => {
      loadedFonts.add(fontFamily);
      resolve();
    };

    link.onerror = () => {
      reject(new Error(`Failed to load font: ${fontFamily}`));
    };

    document.head.appendChild(link);
  });
}

export function injectFontLink(id: string, href: string) {
  if (!href || typeof href !== 'string') return;

  const existingLink = document.getElementById(id) as HTMLLinkElement | null;

  if (existingLink) {
    if (existingLink.href !== href) {
      existingLink.href = href;
    }
    return;
  }

  const newLink = document.createElement('link');
  newLink.id = id;
  newLink.rel = 'stylesheet';
  newLink.href = href;
  newLink.crossOrigin = 'anonymous';

  document.head.appendChild(newLink);
}

export const FONT_CATEGORIES = [
  'serif',
  'sans-serif',
  'display',
  'handwriting',
  'monospace',
] as const;

export type FontCategory = (typeof FONT_CATEGORIES)[number];

export const FONT_WEIGHTS = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
] as const;

export type FontWeight = (typeof FONT_WEIGHTS)[number];
