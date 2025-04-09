export type Song = {
  title: string;
  album: string;
  artist: string;
  year: string;
};

export type SubscriptionPayload = Song & { email: string };
