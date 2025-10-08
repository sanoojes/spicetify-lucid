import AnimatedBackgroundCanvas from '@components/background/AnimatedBackgroundCanvas.tsx';
import StaticBackground from '@components/background/StaticBackground.tsx';
import appStore from '@store/appStore.ts';
import tempStore from '@store/tempStore.ts';
import { useStore } from 'zustand';

const Background: React.FC = () => {
  const mode = useStore(appStore, (state) => state.bg.mode);
  const color = useStore(appStore, (state) => state.bg.options.color);
  const imageMode = useStore(appStore, (state) => state.bg.options.imageMode);
  const customUrl = useStore(appStore, (state) => state.bg.options.imageSrc);
  const npUrl = useStore(tempStore, (state) => state.player?.current?.url);
  const pageImgUrl = useStore(tempStore, (state) => state.pageImg);

  const imageSrc = (() => {
    if (imageMode === 'custom' && customUrl) return customUrl;

    if (imageMode === 'page') {
      const { desktop, cover } = pageImgUrl || {};
      if (desktop) return desktop;
      if (cover) return cover;
    }

    if (npUrl) return npUrl;

    return null;
  })();

  return (
    <div className="bg-wrapper">
      {mode === 'animated' ? (
        <div className="bg animated">
          <AnimatedBackgroundCanvas imageSrc={imageSrc} />
        </div>
      ) : mode === 'solid' ? (
        <div className="bg solid" style={{ backgroundColor: color }}></div>
      ) : (
        <StaticBackground imageSrc={imageSrc} />
      )}
    </div>
  );
};

export default Background;
