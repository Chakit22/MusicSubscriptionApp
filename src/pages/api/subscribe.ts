import type { NextApiRequest, NextApiResponse } from "next";
import { APIParams } from "@/types";
import axios, { AxiosError } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  if (!process.env.SUBSCRIPTIONS_LAMBDA_URL) {
    return res
      .status(500)
      .json({ status: 500, message: "SUBSCRIPTIONS_LAMBDA_URL is not set" });
  }

  try {
    const payload = req.body as APIParams;

    console.log("payload in subscribe", payload);

    const response = await axios.post(
      `${process.env.SUBSCRIPTIONS_LAMBDA_URL}/subscribe`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("response in subscribe", response.data);

    return res.status(response.status).json({
      status: response.status,
      message: response.data,
    });
  } catch (error: unknown) {
    console.error("error", error);
    if (error instanceof AxiosError) {
      return res.status(error.response?.status || 500).json({
        status: error.response?.status || 500,
        message: error.response?.data || "Failed to subscribe to song",
      });
    }

    return res.status(500).json({
      status: 500,
      message: "Failed to subscribe to song",
    });
  }
}
