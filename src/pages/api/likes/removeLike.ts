// pages/api/likes/removelike.js
import { removeLike } from "../../../removelike";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { blogId, userId } = req.body;

  try {
    const result = await removeLike(userId, blogId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({ error: "Failed to remove like" });
  }
}
