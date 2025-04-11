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
      `${process.env.SUBSCRIPTIONS_LAMBDA_URL}`,
      { params: payload }
    );

    if (response.data.statusCode !== 200) {
      throw new Error(JSON.parse(response.data.body));
    }

    return res.status(response.data.statusCode).json({
      status: response.data.statusCode,
      message: JSON.parse(response.data.body),
    });
  } catch (error: unknown) {
    console.log("error", error);
    return res.status(500).json({
      status: 500,
      message:
        error instanceof Error
          ? error.message
          : "Failed to unsubscribe from song",
    });
  }
}
