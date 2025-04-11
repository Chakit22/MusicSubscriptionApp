export type Song = {
  title: string;
  album: string;
  artist: string;
  year: number;
  image_url?: string;
};

export type APIParams = Song & {
  httpMethod: string;
  path: string;
  email: string;
  title: string;
  artist: string;
  album: string;
  year: number;
};
