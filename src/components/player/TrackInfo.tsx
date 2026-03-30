import UI from '@/components/ui';

const TrackInfo: React.FC<{
  metadata?: Spicetify.PlayerTrack['metadata'];
  artists?: Spicetify.ArtistsEntity[];
  loading: boolean;
}> = ({ metadata, artists, loading }) => (
  <>
    <UI.Marquee className="main-trackInfo-name">
      <div
        className="e-9890-text encore-text-body-small main-trackInfo-name"
        dir="auto"
        data-encore-id="type"
      >
        {loading ? (
          <div className="placeholder-title" />
        ) : (
          <a draggable="false" href={metadata?.album_uri}>
            {metadata?.title ?? ''}
          </a>
        )}
      </div>
    </UI.Marquee>
    <UI.Marquee className="main-trackInfo-artists">
      <div
        className="e-9890-text encore-text-marginal encore-internal-color-text-subdued main-trackInfo-artists main-trackInfo-artists"
        data-encore-id="type"
      >
        {loading ? (
          <div className="placeholder-artist" />
        ) : (
          artists?.map((artist, index) => (
            <span key={artist?.uri}>
              <a draggable="true" dir="auto" href={artist?.uri}>
                {artist?.name}
              </a>
              {index < artists.length - 1 && ', '}
            </span>
          ))
        )}
      </div>
    </UI.Marquee>
  </>
);

export default TrackInfo;
