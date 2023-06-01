// pages/api/likes/removelike.js
import { removeLike } from "../../../removelike";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { blogId, intunemsBlogId, msBlogId, windowsBlogId, userId } = req.body;

  let id, type;
  if (blogId) {
    id = blogId;
    type = "blogId";
  } else if (intunemsBlogId) {
    id = intunemsBlogId;
    type = "intunemsBlogId";
  } else if (msBlogId) {
    id = msBlogId;
    type = "msBlogId";
  } else if (windowsBlogId) {
    id = windowsBlogId;
    type = "windowsBlogId";
  } else {
    return res.status(400).json({ error: "Missing id or type" });
  }

  try {
    const result = await removeLike(userId, id, type);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({ error: "Failed to remove like" });
  }
}
