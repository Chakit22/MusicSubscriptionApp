import { useState } from "react";
import axios from "axios";
import { Song, Subscription } from "@/types";

export const useSubscription = (userEmail: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeToSong = async (song: Song): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const subscription: Subscription = {
        user_email: userEmail,
        title: song.title,
        album: song.album,
        artist: song.artist,
      };

      const response = await axios.post("/api/subscribe", subscription);
      setLoading(false);
      return response.data.success;
    } catch (err) {
      setError("Failed to subscribe to the song");
      setLoading(false);
      return false;
    }
  };

  const unsubscribeFromSong = async (song: Song): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/unsubscribe", {
        user_email: userEmail,
        title: song.title,
        album: song.album,
        artist: song.artist,
      });
      setLoading(false);
      return response.data.success;
    } catch (err) {
      setError("Failed to unsubscribe from the song");
      setLoading(false);
      return false;
    }
  };

  const checkSubscription = async (song: Song): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/check-subscription", {
        params: {
          user_email: userEmail,
          title: song.title,
          album: song.album,
          artist: song.artist,
        },
      });
      setLoading(false);
      return response.data.isSubscribed;
    } catch (err) {
      setError("Failed to check subscription status");
      setLoading(false);
      return false;
    }
  };

  const getSubscribedSongs = async (): Promise<Song[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/subscribed-songs", {
        params: { user_email: userEmail },
      });
      setLoading(false);
      return response.data.songs;
    } catch (err) {
      setError("Failed to fetch subscribed songs");
      setLoading(false);
      return [];
    }
  };

  return {
    loading,
    error,
    subscribeToSong,
    unsubscribeFromSong,
    checkSubscription,
    getSubscribedSongs,
  };
};
