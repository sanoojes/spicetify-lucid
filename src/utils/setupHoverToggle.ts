import debounce from "@/utils/debounce.ts";
import getOrCreateElement from "@/utils/dom/getOrCreateElement.ts";
import waitForElements from "@/utils/dom/waitForElements.ts";

interface HoverToggleOptions {
  bodyClass?: string;
  onHoverBodyClass?: string;
  onNotHoverBodyClass?: string;
  containerSelector: string;
  onTopContainerSelectors: string[];
  className?: string;
  hoverTargetId?: string;
}

export default function setupHoverToggle({
  containerSelector,
  onTopContainerSelectors,
  className = "show",
  hoverTargetId = "hover-target",
  bodyClass,
  onHoverBodyClass,
  onNotHoverBodyClass,
}: HoverToggleOptions) {
  let hoverTarget: HTMLElement | null = null;
  let targetElements: HTMLElement[] = [];
  let isHoveringTarget = false;
  let isHoveringElements = false;
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  let isDelayingUpdate = false;
  let mutationObserver: MutationObserver | null = null;

  const isResizingOrContextMenuOpen = () =>
    targetElements.some((el) =>
      el.querySelector('.LayoutResizer__resize-bar--resizing, [data-context-menu-open="true"]'),
    );

  const performUpdateVisibility = () => {
    if (onHoverBodyClass)
      document.body.classList.toggle(onHoverBodyClass, isHoveringElements || isHoveringTarget);
    if (onNotHoverBodyClass)
      document.body.classList.toggle(
        onNotHoverBodyClass,
        !(isHoveringElements || isHoveringTarget),
      );
    targetElements.forEach((el) =>
      el.classList.toggle(className, isHoveringTarget || isHoveringElements),
    );
  };

  const updateVisibility = () => {
    if (isResizingOrContextMenuOpen()) {
      if (!isDelayingUpdate) {
        isDelayingUpdate = true;
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          isDelayingUpdate = false;
          updateVisibility();
        }, 1000);
      }
      return;
    }

    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = null;
      isDelayingUpdate = false;
    }

    performUpdateVisibility();
  };

  const handleElementEnter = () => {
    isHoveringElements = true;
    updateVisibility();
  };

  const handleElementLeave = () => {
    isHoveringElements = false;
    updateVisibility();
  };

  const attachHoverListeners = () => {
    targetElements.forEach((el) => {
      el.removeEventListener("mouseenter", handleElementEnter);
      el.removeEventListener("mouseleave", handleElementLeave);
      el.addEventListener("mouseenter", handleElementEnter);
      el.addEventListener("mouseleave", handleElementLeave);
    });
  };

  const updateTargetElements = () => {
    const newElements = onTopContainerSelectors
      .map((selector) => document.querySelector(selector) as HTMLElement | null)
      .filter(Boolean) as HTMLElement[];

    const isChanged =
      newElements.length !== targetElements.length ||
      newElements.some((el, i) => el !== targetElements[i]);

    if (isChanged) {
      targetElements = newElements;
      attachHoverListeners();
      updateVisibility();
    }
  };

  const debouncedUpdate = debounce(updateTargetElements, 100);

  const observeBodyChanges = () => {
    mutationObserver = new MutationObserver((mutations) => {
      const relevantChange = mutations.some(
        (mutation) =>
          Array.from(mutation.addedNodes).some(
            (node) =>
              node instanceof HTMLElement &&
              onTopContainerSelectors.some(
                (sel) => node.matches?.(sel) || node.querySelector?.(sel),
              ),
          ) ||
          Array.from(mutation.removedNodes).some(
            (node) =>
              node instanceof HTMLElement &&
              onTopContainerSelectors.some(
                (sel) => node.matches?.(sel) || node.querySelector?.(sel),
              ),
          ),
      );

      if (relevantChange) debouncedUpdate();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  const destroy = () => {
    targetElements.forEach((el) => {
      el.removeEventListener("mouseenter", handleElementEnter);
      el.removeEventListener("mouseleave", handleElementLeave);
      el.classList.remove(className);
    });

    if (hoverTarget) {
      hoverTarget.remove();
      hoverTarget = null;
    }

    if (bodyClass) document.body.classList.remove(bodyClass);
    if (onHoverBodyClass) document.body.classList.remove(onHoverBodyClass);
    if (onNotHoverBodyClass) document.body.classList.remove(onNotHoverBodyClass);

    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }

    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = null;
    }

    targetElements = [];
    isHoveringTarget = false;
    isHoveringElements = false;
  };

  const init = () => {
    waitForElements(containerSelector).then((container) => {
      if (bodyClass) document.body.classList.add(bodyClass);

      hoverTarget = getOrCreateElement("div", hoverTargetId, container);

      hoverTarget.addEventListener("mouseenter", () => {
        isHoveringTarget = true;
        updateVisibility();
      });

      hoverTarget.addEventListener("mouseleave", () => {
        isHoveringTarget = false;
        updateVisibility();
      });

      updateTargetElements();
      observeBodyChanges();
    });
  };

  init();

  return destroy;
}
