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
      console.error("error", err);
      if (err instanceof AxiosError) {
        return {
          status: err.response?.status || 500,
          message: err.response?.data || "Failed to subscribe to song",
        };
      }

      return {
        status: 500,
        message: "Failed to subscribe to song",
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
        email: userEmail,
        title: song.title,
        album: song.album,
        artist: song.artist,
        year: song.year,
      };

      const response = await axios.delete("/api/unsubscribe", {
        params: payload,
      });

      setLoading(false);
      return response.data;
    } catch (err: unknown) {
      console.error("error", err);
      if (err instanceof AxiosError) {
        return {
          status: err.response?.status || 500,
          message: err.response?.data || "Failed to unsubscribe from song",
        };
      }

      return {
        status: 500,
        message: "Failed to unsubscribe from song",
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
          email: userEmail,
          title: song.title,
          album: song.album,
          artist: song.artist,
        },
      });

      setLoading(false);
      return response.data;
    } catch (err: unknown) {
      console.error("error", err);
      if (err instanceof AxiosError) {
        return {
          status: err.response?.status || 500,
          message: err.response?.data || "Failed to check subscription status",
        };
      }

      return {
        status: 500,
        message: "Failed to check subscription status",
      };
    }
  };

  const getSubscribedSongs = async (): Promise<{
    status: number;
    message: string | Song[];
  }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/get-subscribed-songs", {
        params: {
          email: userEmail,
        },
      });

      setLoading(false);
      return response.data;
    } catch (err: unknown) {
      console.error("error", err);
      if (err instanceof AxiosError) {
        return {
          status: err.response?.status || 500,
          message: err.response?.data || "Failed to fetch subscribed songs",
        };
      }

      return {
        status: 500,
        message: "Failed to fetch subscribed songs",
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
