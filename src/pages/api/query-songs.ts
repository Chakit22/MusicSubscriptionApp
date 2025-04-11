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
      {
        title: "Billie Jean",
        artist: "Michael Jackson",
        year: "1982",
        album: "Thriller",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        title: "Sweet Child o' Mine",
        artist: "Guns N' Roses",
        year: "1987",
        album: "Appetite for Destruction",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        title: "Hotel California",
        artist: "Eagles",
        year: "1976",
        album: "Hotel California",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        title: "Imagine",
        artist: "John Lennon",
        year: "1971",
        album: "Imagine",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        title: "Stairway to Heaven",
        artist: "Led Zeppelin",
        year: "1971",
        album: "Led Zeppelin IV",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        year: "1991",
        album: "Nevermind",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        title: "Hey Jude",
        artist: "The Beatles",
        year: "1968",
        album: "Hey Jude",
        image_url: "/placeholder.svg?height=100&width=100",
      },
    ];

    // Filter songs based on search parameters if provided
    const { title, artist, year, album } = req.query;

    console.log("Search query:", { title, artist, year, album });

    const filteredSongs = songs.filter((song) => {
      return (
        (!title ||
          song.title.toLowerCase().includes(String(title).toLowerCase())) &&
        (!artist ||
          song.artist.toLowerCase().includes(String(artist).toLowerCase())) &&
        (!year || song.year === String(year)) &&
        (!album ||
          song.album.toLowerCase().includes(String(album).toLowerCase()))
      );
    });

    console.log(`Found ${filteredSongs.length} songs matching the criteria`);

    return res.status(200).json({
      success: true,
      songs: filteredSongs,
    });
  } catch (error) {
    console.error("Error in query-songs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch songs",
      songs: [],
    });
  }
}
