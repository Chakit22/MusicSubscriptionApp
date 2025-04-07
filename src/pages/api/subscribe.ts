import type { NextApiRequest, NextApiResponse } from "next";
import { Subscription } from "@/types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const subscription = req.body as Subscription;

    // In a real implementation, this would save to database
    // Mocking successful subscription

    return res.status(200).json({
      success: true,
      message: "Successfully subscribed to song",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to subscribe to song",
    });
  }
}
