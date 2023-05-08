// pages/api/videolikes/removeVideoLike.ts
import { removeVideoLike } from "../../../removeVideoLike";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoId, userId } = req.body;

  try {
    const result = await removeVideoLike(userId, videoId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({ error: "Failed to remove like" });
  }
}
