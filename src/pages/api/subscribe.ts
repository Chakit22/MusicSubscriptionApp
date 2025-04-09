import type { NextApiRequest, NextApiResponse } from "next";
import { SubscriptionPayload } from "@/types";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  try {
    const body = req.body as SubscriptionPayload;

    const payload = {
      httpMethod: "POST",
      path: "/subscribe",
      body: JSON.stringify(body),
    };

    const response = await axios.post(
      `${process.env.SUBSCRIPTIONS_LAMBDA_URL}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(response.data.statusCode).json({
      status: response.data.statusCode,
      message: response.data.body,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to subscribe to song",
    });
  }
}
