import type { NextApiRequest, NextApiResponse } from "next";
import { APIParams } from "@/types";
import axios, { AxiosError } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  try {
    const payload = req.query;

    const response = await axios.delete(
      `${process.env.SUBSCRIPTIONS_LAMBDA_URL}/unsubscribe`,
      { params: payload }
    );

    return res.status(response.data.statusCode).json({
      status: response.data.statusCode,
      message: response.data.body,
    });
  } catch (error: unknown) {
    console.error("error", error);
    if (error instanceof AxiosError) {
      return res.status(error.response?.status || 500).json({
        status: error.response?.status || 500,
        message: error.response?.data || "Failed to unsubscribe from song",
      });
    }

    return res.status(500).json({
      status: 500,
      message: "Failed to unsubscribe from song",
    });
  }
}
