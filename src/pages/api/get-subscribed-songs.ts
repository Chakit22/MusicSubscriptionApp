import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { Song } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  try {
    const payload = req.query;

    const response = await axios.get(
      `${process.env.SUBSCRIPTIONS_LAMBDA_URL}/all-subscriptions`,
      { params: payload }
    );

    console.log("response in get-subscribed-songs", response.data);

    return res.status(response.status).json({
      status: response.status,
      message: response.data as Song[],
    });
  } catch (error: unknown) {
    console.error("error", error);
    if (error instanceof AxiosError) {
      return res.status(error.response?.status || 500).json({
        status: error.response?.status || 500,
        message: error.response?.data || "Failed to get subscribed songs",
      });
    }

    return res.status(500).json({
      status: 500,
      message: "Failed to get subscribed songs",
    });
  }
}
