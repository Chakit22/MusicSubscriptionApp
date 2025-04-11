import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Song, APIParams } from "@/types";

export const useSubscription = (userEmail: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeToSong = async (
    song: Song
  ): Promise<{
    status: number;
    message: string;
  }> => {
    setLoading(true);
    setError(null);

    try {
      const payload: APIParams = {
        httpMethod: "POST",
        path: "subscribe",
        email: userEmail,
        title: song.title,
        album: song.album,
        artist: song.artist,
        year: song.year,
      };

      const response = await axios.post("/api/subscribe", payload);
      setLoading(false);
      return response.data;
    } catch (err: unknown) {
      return {
        status: 500,
        message:
          err instanceof Error ? err.message : "Failed to subscribe to song",
      };
    }
  };

  const unsubscribeFromSong = async (
    song: Song
  ): Promise<{
    status: number;
    message: string;
  }> => {
    setLoading(true);
    setError(null);

    try {
      const payload: APIParams = {
        httpMethod: "DELETE",
        path: "unsubscribe",
        email: userEmail,
        title: song.title,
        album: song.album,
        artist: song.artist,
        year: song.year,
      };

      const response = await axios.delete("/api/unsubscribe", {
        params: payload,
      });

      console.log("response in unsubscribeFromSong", response.data);

      setLoading(false);
      return response.data;
    } catch (err: unknown) {
      return {
        status: 500,
        message:
          err instanceof Error
            ? err.message
            : "Failed to unsubscribe from the song",
      };
    }
  };

  const checkSubscription = async (
    song: Song
  ): Promise<{
    status: number;
    message: string;
  }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/check-subscription", {
        params: {
          httpMethod: "GET",
          path: "check-subscription",
          email: userEmail,
          title: song.title,
          album: song.album,
          artist: song.artist,
        },
      });

      setLoading(false);
      return response.data;
    } catch (err: unknown) {
      return {
        status: 500,
        message:
          err instanceof Error
            ? err.message
            : "Failed to check subscription status",
      };
    }
  };

  const getSubscribedSongs = async (): Promise<{
    status: number;
    message: string;
  }> => {
    setLoading(true);
    setError(null);

    try {
      console.log("userEmail in useSubscription", userEmail);
      const response = await axios.get("/api/get-subscribed-songs", {
        params: {
          email: userEmail,
          httpMethod: "GET",
          path: "subscriptions",
        },
      });

      console.log("response in useSubscription", response.data);

      setLoading(false);
      return response.data;
    } catch (err: unknown) {
      return {
        status: 500,
        message:
          err instanceof Error
            ? err.message
            : "Failed to fetch subscribed songs",
      };
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
