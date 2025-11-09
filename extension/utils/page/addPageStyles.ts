import tempStore from '@store/tempStore.ts';
import { hexToRGB } from '@utils/colors/convert.ts';
import waitForGlobal from '@utils/dom/waitForGlobal.ts';
import getArtworkByPageUrl from '@utils/page/getArtworkByPageUrl.ts';
import { updateCardBgAlpha } from '@utils/updateCardBgAlpha.ts';
import { getCoverColor } from "@utils/colors/getCoverColor.ts";

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
};

waitForGlobal(() => Spicetify?.Platform?.History).then((history) => {
  history?.listen(async (url: { pathname: string } | null) => {
    await addPageStyles(url);
  });
});

export default addPageStyles;
