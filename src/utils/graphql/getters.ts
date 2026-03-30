import { makeRequest } from '@/utils/graphql/makeRequest.ts';

type Color = { hex: string; fallback: boolean };
export type ExtractedColor = {
  colorDark?: Color;
  colorLight?: Color;
  colorRaw?: Color;
};

type ColorsData = {
  data?: {
    extractedColors?: ExtractedColor[];
  };
};

type ImageData = {
  sources: {
    url: string;
    width?: number;
    height?: number;
  }[];
};

type Artist = {
  data?: {
    artistUnion?: {
      visuals?: {
        avatarImage?: ImageData;
        headerImage?: ImageData;
      };
    };
  };
};

type Album = {
  data?: {
    albumUnion?: {
      coverArt?: ImageData;
    };
  };
};

export const getAlbum = (uri: string): Promise<Album | null> =>
  makeRequest<Album>(
    {
      name: 'getAlbum',
      sha256Hash: '469874edcad37b7a379d4f22f0083a49ea3d6ae097916120d9bbe3e36ca79e9d',
    },
    { uri, locale: null, offset: 0, limit: 50 }
  );

export const getArtist = (uri: string): Promise<Artist | null> =>
  makeRequest<Artist>(
    {
      name: 'queryArtistOverview',
      sha256Hash: '35648a112beb1794e39ab931365f6ae4a8d45e65396d641eeda94e4003d41497',
    },
    { uri, includePrerelease: true, locale: null }
  );

export const getExtractedColors = (uris: string[]) =>
  makeRequest<ColorsData>(
    {
      name: 'fetchExtractedColors',
      sha256Hash: '86bdf61bb598ee07dc85d6c3456d9c88eb94f33178509ddc9b33fc9710aa9e9c',
    },
    { uris }
  );
