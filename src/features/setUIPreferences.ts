import appStore from '@/store/appStore.ts';
import getOrCreateStyle from '@/utils/dom/getOrCreateStyle.ts';
import { getFontUrl, injectFontLink } from '@/utils/font.ts';

export default function setUIPreferences(uiPreferences = appStore.getState().uiPreferences) {
  setFonts(uiPreferences);
  setBorders(uiPreferences.border);
}

appStore.subscribe((state) => state.uiPreferences, setUIPreferences);

function setBorders(border = appStore.getState().uiPreferences.border) {
  const { color, style, thickness, hoverColor } = border;
  const css = `:root{
  --border-clr: ${color};
  --border-h-clr: ${hoverColor};
  --border-style: ${style};
  --border-thickness: ${thickness}px;
}`;

  const styleElem = getOrCreateStyle('lucid-border');
  styleElem.textContent = css;
}

const usedUrls = new Set<string>();

function setFonts(uiPreferences = appStore.getState().uiPreferences) {
  const { titleFont, bodyFont } = uiPreferences;

  const fontSources = [
    { key: 'titleFont', value: titleFont },
    { key: 'bodyFont', value: bodyFont },
    { key: 'variableFont', value: bodyFont },
  ];

  for (const { key, value } of fontSources) {
    const url = getFontUrl(value.family, value.variants);
    if (url && !usedUrls.has(url)) {
      injectFontLink(`dynamic-font-${key}`, url);
      usedUrls.add(url);
    }
  }

  const fallbackFonts =
    'CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,var(--fallback-fonts))';
  const titleFontStack = `${titleFont?.family || 'SpotifyMixUITitle'},${fallbackFonts}`;
  const variableFontStack = `${bodyFont?.family || 'SpotifyMixUITitleVariable'},${fallbackFonts}`;
  const bodyFontStack = `${bodyFont?.family || 'SpotifyMixUI'},${fallbackFonts}`;

  const style =
    (document.getElementById('dynamic-font-style') as HTMLStyleElement) ??
    (() => {
      const el = document.createElement('style');
      el.id = 'dynamic-font-style';
      document.head.appendChild(el);
      return el;
    })();

  const newFontStyles = `
* {
font-family: "${bodyFont.family}", var(--fallback-fonts);
}
:root {
  --font-family: "${bodyFont.family}", var(--fallback-fonts);
  --encore-title-font-stack: ${titleFontStack} !important;
  --encore-variable-font-stack: ${variableFontStack} !important;
  --encore-body-font-stack: ${bodyFontStack} !important;
}
a, button, input, select, textarea, nav, section, article, aside, footer {
  font-family: "${bodyFont.family}", var(--fallback-fonts) !important;
}
header, h1, h2, h3, h4, h5, h6, strong, b {
  font-family: "${titleFont.family}", var(--fallback-fonts);
}
`;

  if (style.textContent !== newFontStyles) {
    style.textContent = newFontStyles;
  }
}
