export enum ApiConfig {
  BASE_URI = 'https://wallies.cacko.net/api',
}


export enum ApiType {
  ARTWORKS = 'artworks',
}


export interface WallEntity {
  title: string;
  raw_src: string;
  web_uri: string;
  webp_src: string;
  category: string;
  colors: string;
}


export enum WSLoading {
  BLOCKING_ON = 'blocking_on',
  BLOCKING_OFF = 'blocking_off',
  MESSAGE_OFF = 'message_off',
  MESSAGE_ON = 'message_on',
}
