import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  if (!process.env.QUERY_SONGS_LAMBDA_URL) {
    return res
      .status(500)
      .json({ success: false, message: "QUERY_SONGS_LAMBDA_URL is not set" });
  }

  try {
    const { title, artist, album, year } = req.query;

    console.log("title", title);
    console.log("artist", artist);
    console.log("album", album);
    console.log("year", year);

    const queryParams = new URLSearchParams();
    if (title) queryParams.append("title", (title as string).toLowerCase());
    if (artist) queryParams.append("artist", (artist as string).toLowerCase());
    if (album) queryParams.append("album", (album as string).toLowerCase());
    if (year) queryParams.append("year", (year as string).toLowerCase());

    const LAMBDA_URL = process.env.QUERY_SONGS_LAMBDA_URL;

    const response = await axios.get(`${LAMBDA_URL}?${queryParams.toString()}`);

    return res.status(200).json({
      success: true,
      songs: response.data || [],
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
