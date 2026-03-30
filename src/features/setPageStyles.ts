import appStore from "@/store/appStore.ts";
import debounce from "@/utils/debounce.ts";
import waitForElements from "@/utils/dom/waitForElements.ts";
import { updateCardBgAlpha } from "@/utils/updateCardBgAlpha.ts";

export default function setPageStyles(page = appStore.getState().page) {
  const { coverMode, homeCardGap, mode, panelGap } = page;

  const coverModes = ["hidden", "as-bg", "default"];
  coverModes.forEach((type) => {
    document.body.classList.toggle(`page-cover-${type}`, coverMode === type);
  });

  const layoutModes = ["compact", "compact-card", "card", "default"];
  layoutModes.forEach((type) => {
    document.body.classList.toggle(`page-${type}`, mode === type);
  });

  document.body.style.setProperty("--home-card-gap", `${homeCardGap}px`);
  document.body.style.setProperty("--panel-gap", `${panelGap}px`);
}

const observeForPlaylistModal = () => {
  waitForElements(".Root").then((rootElem) => {
    const rootObserver = new MutationObserver(
      debounce(() => {
        const sourceDiv = rootElem.querySelector(".FP_XXx0FMQPJEu3WzfpM") as HTMLDivElement | null;
        if (!sourceDiv) return;

        const styleObserver = new MutationObserver(() => {
          const rgbRegex = /rgb\(\s*((?:\d{1,3}\s*,\s*){2}\d{1,3})\s*\)/;
          const color = sourceDiv.style.backgroundColor.match(rgbRegex)?.[1];
          if (!color || !sourceDiv.parentElement) return;

          sourceDiv.parentElement.style.setProperty("--accent-color", color);
        });

        styleObserver.observe(sourceDiv, { attributes: true });
      }, 300),
    );
    rootObserver.observe(rootElem, { childList: true });
  });
};

observeForPlaylistModal();
appStore.subscribe((state) => state.page, setPageStyles);
