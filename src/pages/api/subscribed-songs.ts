import type { NextApiRequest, NextApiResponse } from "next";
import { Song } from "@/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { user_email } = req.query;

    // In a real implementation, this would query the database
    // Mocking subscribed songs for demonstration
    const mockSubscriptions: Song[] = [
      {
        title: "Rivers of Babylon",
        artist: "Boney M.",
        year: "1978",
        album: "Nightflight to Venus",
        image_url: "/placeholder.svg?height=100&width=100",
      },
      {
        title: "Fearless",
        artist: "Taylor Swift",
        year: "2008",
        album: "Fearless",
        image_url: "/placeholder.svg?height=100&width=100",
      },
    ];

    return res.status(200).json({
      success: true,
      songs: mockSubscriptions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve subscribed songs",
      songs: [],
    });
  }
}
