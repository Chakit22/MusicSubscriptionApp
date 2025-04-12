import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { title, artist, album, year } = req.query;

    const queryParams = new URLSearchParams();
    if (title) queryParams.append("title", title as string);
    if (artist) queryParams.append("artist", artist as string);
    if (album) queryParams.append("album", album as string);
    if (year) queryParams.append("year", year as string);

    const LAMBDA_URL = "https://oz1t1rbcu5.execute-api.us-east-1.amazonaws.com/query_music";

    const response = await axios.get(`${LAMBDA_URL}?${queryParams.toString()}`);

    return res.status(200).json({
      success: true,
      songs: response.data.songs || [],
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