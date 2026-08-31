export function updateCardBgAlpha(className: string, alpha = 0.25) {
  const cards = document.querySelectorAll<HTMLDivElement>(className);

  cards.forEach((card) => {
    const computedStyle = window.getComputedStyle(card);
    const customVar = computedStyle.getPropertyValue("--background-base").trim();
    const prevColor = customVar || card.style.backgroundColor || computedStyle.backgroundColor;

    let r: number | undefined, g: number | undefined, b: number | undefined;

    if (prevColor.startsWith("#") || /^[0-9a-fA-F]{3,8}$/.test(prevColor)) {
      let hex = prevColor.replace(/^#/, "");
      if (hex.length === 3 || hex.length === 4) {
        hex = hex
          .split("")
          .map((c) => c + c)
          .join("");
      }
      if (hex.length >= 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }
    }

    if (r === undefined) {
      const match = prevColor.match(/(?:rgba?\(|^)\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
      if (match) {
        r = Number(match[1]);
        g = Number(match[2]);
        b = Number(match[3]);
      }
    }

    if (
      r !== undefined &&
      g !== undefined &&
      b !== undefined &&
      !isNaN(r) &&
      !isNaN(g) &&
      !isNaN(b)
    ) {
      const rgb = `${r}, ${g}, ${b}`;
      card.style.setProperty("--accent-color", rgb);
      card.style.backgroundColor = `rgba(${rgb}, ${alpha})`;
    }
  });
}
