import { useState } from "react";
import axios from "axios";
import { Song, APIParams } from "@/types";

export const useSubscription = (userEmail: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeToSong = async (song: Song): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const payload: APIParams = {
        httpMethod: "POST",
        path: "/subscribe",
        email: userEmail,
        title: song.title,
        album: song.album,
        artist: song.artist,
        year: song.year,
      };

      const response = await axios.post("/api/subscribe", payload);
      setLoading(false);
      return response.data.status === 200;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to subscribe to the song"
      );
      setLoading(false);
      return false;
    }
  };

  const unsubscribeFromSong = async (song: Song): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const payload: APIParams = {
        httpMethod: "DELETE",
        path: "/unsubscribe",
        email: userEmail,
        title: song.title,
        album: song.album,
        artist: song.artist,
        year: song.year,
      };

      // Note: Using axios.delete with a request body requires special handling
      const response = await axios({
        method: "DELETE",
        url: "/api/unsubscribe",
        data: payload,
      });

      setLoading(false);
      return response.data.status === 200;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to unsubscribe from the song"
      );
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
          httpMethod: "GET",
          path: "/check-subscription",
          email: userEmail,
          title: song.title,
          album: song.album,
          artist: song.artist,
          // Note: year is intentionally omitted as seen in the API
        },
      });

      setLoading(false);
      // Parse the JSON string body to get the actual result
      const bodyData =
        typeof response.data.message === "string"
          ? JSON.parse(response.data.message)
          : response.data.message;

      return bodyData.isSubscribed || false;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to check subscription status"
      );
      setLoading(false);
      return false;
    }
  };

  const getSubscribedSongs = async (): Promise<Song[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/get-subscribed-songs", {
        params: {
          email: userEmail,
        },
      });

      setLoading(false);

      // Parse the response body if it's a string
      let songs: Song[] = [];
      if (response.data.status === 200) {
        const bodyData =
          typeof response.data.songs === "string"
            ? JSON.parse(response.data.songs)
            : response.data.songs;

        songs = Array.isArray(bodyData) ? bodyData : [];
      }

      return songs;
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch subscribed songs"
      );
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
