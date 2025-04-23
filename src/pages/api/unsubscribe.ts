import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  if (!process.env.SUBSCRIPTIONS_LAMBDA_URL) {
    return res
      .status(500)
      .json({ status: 500, message: "SUBSCRIPTIONS_LAMBDA_URL is not set" });
  }

  try {
    const payload = req.query;

    console.log("payload in unsubscribe", payload);

    const response = await axios.delete(
      `${process.env.SUBSCRIPTIONS_LAMBDA_URL}/unsubscribe`,
      { params: payload }
    );

    return res.status(response.status).json({
      status: response.status,
      message: response.data,
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
