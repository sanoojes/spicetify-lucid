import appStore from '@store/appStore.ts';
import tempStore from '@store/tempStore.ts';
import serializeFilters from '@utils/dom/serializeFilters.ts';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from 'zustand';

export const SCROLL_SELECTOR =
  '.Root__main-view [data-overlayscrollbars-viewport], .Root__main-view .os-viewport, .Root__main-view .main-view-container > .main-view-container__scroll-node:not([data-overlayscrollbars-initialize]), .Root__main-view .main-view-container__scroll-node > [data-overlayscrollbars-viewport], .main-view-container__scroll-node div:nth-child(2)';

const UnderMainView: React.FC = () => {
  const { type, customUrl, customColor, filter, isScaling, isScrolling } = useStore(
    appStore,
    (s) => s.umv
  );
  const coverPreScroll = useStore(appStore, (s) => s.page.coverPreScroll);
  const { desktop, cover } = useStore(tempStore, (s) => s.pageImg);
  const imgUrl = useStore(tempStore, (s) => s.player?.current?.url);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [styles, setStyles] = useState({
    scale: 1,
    translateY: 0,
    blur: '0px',
  });

  const currentImage = useMemo(() => {
    if (desktop) return desktop;
    if (type === 'custom-img' && cover) return customUrl ?? cover;
    if (type === 'playing' && imgUrl && cover) return imgUrl;
    return cover ?? '';
  }, [type, customUrl, cover, imgUrl, desktop]);

  useEffect(() => {
    if (type === 'custom-color' || currentImage === '') return;

    const el = document.querySelector(SCROLL_SELECTOR) as HTMLDivElement;
    if (!el) return;
    scrollContainerRef.current = el;

    let ticking = false;

    const handleScroll = () => {
      if (!scrollContainerRef.current || ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rawScrollTop = scrollContainerRef.current?.scrollTop ?? 0;
        const scrollTop = Math.max(0, rawScrollTop - coverPreScroll * 0.9);
        const maxScroll = window.innerHeight;
        const progress = Math.min(scrollTop, maxScroll) / maxScroll;

        const scale = isScaling ? 1.1 + 0.75 * progress : 1;
        const translateY = isScrolling ? -scrollTop : 0;

        const baseBlur = currentImage !== desktop ? (filter.blur ?? 0) : 0;
        const blur = `${baseBlur + 32 * progress}px`;

        setStyles({ scale, translateY, blur });
        ticking = false;
      });
    };

    handleScroll();
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [type, currentImage, desktop, filter.blur, isScaling, isScrolling, coverPreScroll]);

  const isDesktop = currentImage === desktop;
  const isColor = type === 'custom-color';

  return (
    <div
      className={`umv${isDesktop ? ' desktop' : isColor ? ' color' : ' img'}`}
      style={
        {
          display: type === 'none' && !desktop ? 'none' : '',
          '--umv-bg': !isColor ? `url("${currentImage}")` : '',
          '--umv-bg-color': isColor && cover ? customColor : '',
          ...(type !== 'custom-color' && {
            filter: `blur(${styles.blur}) ${serializeFilters(filter, {
              skipBlur: true,
            })}`,
            transform: `translate3d(0, ${styles.translateY}px, 0) scale(${styles.scale})`,
          }),
        } as React.CSSProperties
      }
    />
  );
};

export default UnderMainView;
