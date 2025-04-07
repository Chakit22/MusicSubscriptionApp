import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { user_email, title, album, artist } = req.query;

    // In a real implementation, this would query the database
    // Mocking a random subscription status for demonstration
    const isSubscribed = Math.random() > 0.5;

    return res.status(200).json({
      isSubscribed,
      message: isSubscribed
        ? "User is subscribed to this song"
        : "User is not subscribed to this song",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to check subscription status",
    });
  }
}
