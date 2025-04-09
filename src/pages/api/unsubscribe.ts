import type { NextApiRequest, NextApiResponse } from "next";
import { SubscriptionPayload } from "@/types";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  try {
    const body = req.body as SubscriptionPayload;

    const payload = {
      httpMethod: "DELETE",
      path: "/unsubscribe",
      body: JSON.stringify(body),
    };

    const response = await axios.delete(
      `${process.env.SUBSCRIPTIONS_LAMBDA_URL}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      }
    );

    return res.status(response.data.statusCode).json({
      status: response.data.statusCode,
      message: response.data.body,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to unsubscribe from song",
    });
  }
}
