import CoverArt from '@/components/player/CoverArt.tsx';
import TrackInfo from '@/components/player/TrackInfo.tsx';
import appStore from '@/store/appStore.ts';
import tempStore from '@/store/tempStore.ts';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from 'zustand';

const NextSongCard: React.FC = () => {
  const {
    height,
    maxWidth,
    gap,
    paddingX,
    paddingY,
    coverArtSize,
    removeNextUp,
    position,
    isFloating,
  } = useStore(appStore, (state) => state.player.nextSongCard);
  const nextSong = useStore(tempStore, (state) => state.player?.next?.[0].data);
  const [songData, setSongData] = useState(() => Spicetify?.Player?.data?.nextItems?.[0] ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const next = nextSong ?? null;

    if (!next || songData?.uri === next?.uri) return;
    setLoading(true);
    setSongData(next);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [nextSong?.uri]);

  const imageSrc = useMemo(() => {
    const images = songData?.images ?? [];
    return images[3]?.url || images[2]?.url || images[1]?.url || images[0]?.url || null;
  }, [songData]);

  return (
    <div
      className={`next-playing-card ${isFloating ? 'floating' : ''} ${position}`}
      style={
        {
          '--height': `${height}px`,
          '--x-padding': `${paddingX}px`,
          '--y-padding': `${paddingY}px`,
          '--gap': `${gap}px`,
          '--cover-size': `${coverArtSize}px`,
          maxWidth: `${maxWidth}px`,
        } as React.CSSProperties
      }
    >
      <CoverArt imageSrc={loading ? null : imageSrc} href={songData?.metadata?.album_uri} />
      <div className="main-nowPlayingWidget-trackInfo main-trackInfo-container">
        {removeNextUp ? null : (
          <p className="e-9890-text encore-text-marginal encore-internal-color-text-subdued next-up">
            Next Up...
          </p>
        )}
        <TrackInfo
          metadata={songData?.metadata}
          artists={songData?.artists}
          loading={loading || !songData}
        />
      </div>
    </div>
  );
};

export default NextSongCard;
