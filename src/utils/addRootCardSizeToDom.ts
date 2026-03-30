import waitForElements from '@/utils/dom/waitForElements.ts';

type ObservedElement = {
  selector: string;
  varPrefix: string;
  defaultHeight?: number;
  defaultWidth?: number;
};

const observedElements: ObservedElement[] = [
  { selector: '.Root__main-view', varPrefix: '--main-view' },
  { selector: '.Root__globalNav', varPrefix: '--global-nav' },
  {
    selector: '.Root__nav-bar, #Desktop_LeftSidebar_Id',
    varPrefix: '--left-sidebar',
    defaultWidth: 80,
  },
  { selector: '.Root__right-sidebar', varPrefix: '--right-sidebar', defaultWidth: 80 },
];

const observers: ResizeObserver[] = [];

function updateElementSize(el: Element, prefix: string, defaults = { height: 800, width: 800 }) {
  const target = el as HTMLElement;
  const height = target.offsetHeight || defaults.height;
  const width = target.offsetWidth || defaults.width;

  document.body.style.setProperty(`${prefix}-height`, `${height}px`);
  document.body.style.setProperty(`${prefix}-width`, `${width}px`);
}

export default async function addRootCardSizeToDom() {
  await waitForElements([...observedElements.map((v) => v.selector)]);
  observedElements.forEach(({ selector, varPrefix, defaultHeight = 800, defaultWidth = 800 }) => {
    const el = document.querySelector(selector);
    if (!el) return;

    updateElementSize(el, varPrefix, { height: defaultHeight, width: defaultWidth });

    const observer = new ResizeObserver(() => {
      updateElementSize(el, varPrefix, { height: defaultHeight, width: defaultWidth });
    });

    observer.observe(el);
    observers.push(observer);
  });
}
