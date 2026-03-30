import { MusicNote2Filled } from '@fluentui/react-icons';

const CoverArt: React.FC<{ imageSrc: string | null; href?: string }> = ({ imageSrc, href }) => (
  <div className="main-coverSlotCollapsed-container main-coverSlotCollapsed-navAltContainer">
    <div draggable="false">
      <div className="GlueDropTarget GlueDropTarget--albums GlueDropTarget--tracks GlueDropTarget--episodes GlueDropTarget--local-tracks">
        <a draggable="false" data-context-item-type="track" href={href}>
          <div className="main-nowPlayingWidget-coverArt">
            <div className="cover-art" aria-hidden="true">
              <div className="cover-art-icon">
                <MusicNote2Filled />
              </div>
              {imageSrc && (
                <img
                  src={imageSrc}
                  aria-hidden="false"
                  draggable="false"
                  loading="lazy"
                  className="main-image-image cover-art-image main-image-loaded"
                />
              )}
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
);

export default CoverArt;
