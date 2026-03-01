import appStore from '@store/appStore.ts';
import tempStore from '@store/tempStore.ts';
import { hexToRGB } from '@utils/colors/convert.ts';
import { getCoverColor } from '@utils/colors/getCoverColor.ts';
import waitForGlobal from '@utils/dom/waitForGlobal.ts';
import getArtworkByPageUrl from '@utils/page/getArtworkByPageUrl.ts';
import { updateCardBgAlpha } from '@utils/updateCardBgAlpha.ts';

const SCROLL_SELECTOR =
  '.Root__main-view [data-overlayscrollbars-viewport], .Root__main-view .os-viewport, .Root__main-view .main-view-container > .main-view-container__scroll-node:not([data-overlayscrollbars-initialize]), .Root__main-view .main-view-container__scroll-node > [data-overlayscrollbars-viewport], .main-view-container__scroll-node div:nth-child(2)';

export const addPageStyles = async (url = Spicetify?.Platform?.History?.location) => {
  if (!url?.pathname) return;

  document.body.toggleAttribute('is-at-root', url.pathname === '/');

  const style = document.body.style;

  if (url.pathname === '/search') {
    const intervalId = setInterval(
      () => updateCardBgAlpha('.Vn9yz8P5MjIvDT8c0U6w, .HR4FaJd7xDymgB64NpRG'),
      300
    );
    setTimeout(() => clearInterval(intervalId), 6000);
  }
  document.body.classList.toggle('at-disco', url.pathname?.includes('/discography'));

  const { imageUrl, desktopImageUrl } = await getArtworkByPageUrl(url.pathname);
  tempStore.getState().setPageImg({ cover: imageUrl, desktop: desktopImageUrl });

  if (imageUrl) style.setProperty('--page-img-url', `url("${imageUrl}")`);
  else style.removeProperty('--page-img-url');

  if (desktopImageUrl) style.setProperty('--page-desktop-img-url', `url("${desktopImageUrl}")`);
  else style.removeProperty('--page-desktop-img-url');

  const finalPageImgUrl = desktopImageUrl ?? imageUrl;

  if (finalPageImgUrl) {
    const extractedColors = await getCoverColor(finalPageImgUrl);
    const colorHex = extractedColors?.colorDark?.hex;

    if (colorHex) {
      style.setProperty('--page-accent-color', colorHex);
      style.setProperty('--page-accent-color-rgb', hexToRGB(colorHex));
    } else {
      style.removeProperty('--page-accent-color');
      style.removeProperty('--page-accent-color-rgb');
    }
  }

  const preScroll = appStore.getState().page.coverPreScroll;
  const isEntityPage = /^\/(playlist|artist|album)\//.test(url.pathname);
  if (preScroll > 0 && isEntityPage && desktopImageUrl) {
    const applyPreScroll = () => {
      const scrollEl = document.querySelector(SCROLL_SELECTOR) as HTMLElement | null;
      if (!scrollEl) return;

      const tryScroll = () => {
        const header = scrollEl.querySelector('.main-entityHeader-container') as HTMLElement | null;
        if (!header || header.offsetHeight < preScroll) return false;
        scrollEl.scrollTop = preScroll;
        return true;
      };

      if (tryScroll()) return;

      const observer = new MutationObserver(() => {
        if (tryScroll()) {
          observer.disconnect();
        }
      });
      observer.observe(scrollEl, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 5000);
    };
    setTimeout(applyPreScroll, 100);
  }
};

waitForGlobal(() => Spicetify?.Platform?.History).then((history) => {
  history?.listen(async (url: { pathname: string } | null) => {
    await addPageStyles(url);
  });
});

export default addPageStyles;
