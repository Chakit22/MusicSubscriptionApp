export type Song = {
  title: string;
  album: string;
  artist: string;
  year: string;
  image_url?: string;
};

export type APIParams = {
  email: string;
  title: string;
  artist: string;
  album: string;
  year: string;
};
