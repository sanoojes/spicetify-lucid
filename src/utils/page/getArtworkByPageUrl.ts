import { getAlbum, getArtist } from '@/utils/graphql/getters.ts';

export const getSpotifyURL = (pathname: string): string | null => {
  const id = pathname.match(/\/(playlist|artist|album|user|show|collection)\/([^/]+)/);

  if (!id) {
    console.warn('No valid type or ID found in pathname:', pathname);
    return null;
  }

  const [, type, extractedId] = id;
  return `spotify:${type}:${extractedId}`;
};

const getArtworkByPageUrl = async (
  url: string
): Promise<{ imageUrl?: string; desktopImageUrl?: string }> => {
  if (url === '/collection/tracks') {
    return { imageUrl: 'https://misc.scdn.co/liked-songs/liked-songs-300.jpg' }; // its liked songs
  }

  const uri = getSpotifyURL(url);
  if (!uri) return {};
  const [, type, id] = uri.split(':');

  try {
    switch (type) {
      case 'playlist':
      case 'show': {
        const meta = await Spicetify.Platform.PlaylistAPI.getMetadata(uri);
        return {
          imageUrl: meta?.images[0]?.url,
          desktopImageUrl: meta?.formatListData?.attributes?.header_image_url_desktop,
        };
      }
      case 'artist': {
        const meta = await getArtist(uri);
        const visuals = meta?.data?.artistUnion?.visuals;
        return {
          imageUrl: visuals?.avatarImage?.sources[0]?.url,
          desktopImageUrl: visuals?.headerImage?.sources[0]?.url,
        };
      }
      case 'album': {
        const meta = await getAlbum(uri);
        const sources = meta?.data?.albumUnion?.coverArt?.sources;
        return { imageUrl: sources?.[2]?.url || sources?.[0]?.url };
      }
      case 'user': {
        const response = await Spicetify.Platform.RequestBuilder.build()
          .withHost('https://spclient.wg.spotify.com/user-profile-view/v3')
          .withPath(`/profile/${id}`)
          .send();
        return { imageUrl: response?.body?.image_url };
      }
      default:
        return {};
    }
  } catch (error) {
    console.error(`Error fetching ${type} artwork:`, error);
    return {};
  }
};

export default getArtworkByPageUrl;
