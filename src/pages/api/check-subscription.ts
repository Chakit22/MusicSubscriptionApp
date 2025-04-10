import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("check-subscription");
  if (req.method !== "GET") {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }

  try {
    const { year, ...apiParams } = req.query;

    const response = await axios.get(
      `${process.env.SUBSCRIPTIONS_LAMBDA_URL}`,
      {
        params: apiParams,
      }
    );

    if (response.data.body.error) {
      throw new Error(response.data.body.message);
    }

    return res.status(response.data.statusCode).json({
      status: response.data.statusCode,
      message: response.data.body,
    });
  } catch (error) {
    console.error("error", error);
    return res.status(500).json({
      status: 500,
      message: "Failed to check subscription status",
    });
  }
}
