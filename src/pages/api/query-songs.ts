import type { NextApiRequest, NextApiResponse } from "next";
import { Song } from "@/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  try {
    // In a real implementation, this would query the database
    // Mocking songs data for demonstration
    const songs: Song[] = [
      {
        title: "Rivers of Babylon",
        artist: "The Melodians",
        year: "1970",
        album: "Rivers of Babylon",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        title: "White Blood Cells",
        artist: "The White Stripes",
        year: "2001",
        album: "White Blood Cells",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        title: "Fearless",
        artist: "Taylor Swift",
        year: "2008",
        album: "Fearless",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        title: "Bohemian Rhapsody",
        artist: "Queen",
        year: "1975",
        album: "A Night at the Opera",
        image_url: "/placeholder.svg?height=100&width=100",
      },
    ];

    // Filter songs based on search parameters if provided
    const { title, artist, year, album } = req.query;

    const filteredSongs = songs.filter((song) => {
      return (
        (!title ||
          song.title.toLowerCase().includes(String(title).toLowerCase())) &&
        (!artist ||
          song.artist.toLowerCase().includes(String(artist).toLowerCase())) &&
        (!year || song.year.includes(String(year))) &&
        (!album ||
          song.album.toLowerCase().includes(String(album).toLowerCase()))
      );
    });

    return res.status(200).json({
      success: true,
      songs: filteredSongs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch songs",
      songs: [],
    });
  }
}
