import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  try {
    const { email } = req.query;

    const response = await axios.get(
      `${process.env.SUBSCRIPTIONS_LAMBDA_URL}`,
      { params: { email } }
    );

    return res.status(response.data.statusCode).json({
      status: response.data.statusCode,
      songs: response.data.body,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to retrieve subscribed songs",
    });
  }
}
