export function updateCardBgAlpha(className: string, alpha = 0.25) {
  const cards = document.querySelectorAll<HTMLDivElement>(className);
  cards.forEach((card) => {
    const prevColor = card.style.backgroundColor;
    const match = prevColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (match) {
      const [, r, g, b] = match;
      const rgb = `${r},${g},${b}`;

      card.style.setProperty('--accent-color', rgb);
      card.style.backgroundColor = `rgba(${rgb}, ${alpha})`;
    }
  });
}
