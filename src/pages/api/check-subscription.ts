import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("check-subscription");
  if (req.method !== "GET") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  if (!process.env.SUBSCRIPTIONS_LAMBDA_URL) {
    return res
      .status(500)
      .json({ status: 500, message: "SUBSCRIPTIONS_LAMBDA_URL is not set" });
  }

  try {
    const { ...apiParams } = req.query;

    const response = await axios.get(
      `${process.env.SUBSCRIPTIONS_LAMBDA_URL}/check-subscription`,
      { params: apiParams }
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
        message: error.response?.data || "Failed to check subscription",
      });
    }

    return res.status(500).json({
      status: 500,
      message: "Failed to check subscription",
    });
  }
}
