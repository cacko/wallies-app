export enum ApiConfig {
  BASE_URI = 'https://wallies.cacko.net/api',
}

export enum ApiType {
  ARTWORKS = 'artworks',
  ARTWORK = 'artwork',
}

export enum WallCategory {
  MINIMAL = 'minimal',
  ABSTRACT = 'abstract',
  LANDSCAPE = 'landscape',
  SPORT = 'sport',
  GAMES = 'games',
  CARTOON = 'cartoon',
  FANTASY = 'fantasy',
  NATURE = 'nature',
}

export interface WallEntity {
  id: string;
  title: string;
  raw_src: string;
  web_uri: string;
  webp_src: string;
  thumb_src: string;
  category: WallCategory;
  colors: string;
  last_modified: number;
  deleted?: boolean;
  filtered?: boolean;
}

export enum WSLoading {
  BLOCKING_ON = 'blocking_on',
  BLOCKING_OFF = 'blocking_off',
  MESSAGE_OFF = 'message_off',
  MESSAGE_ON = 'message_on',
}
