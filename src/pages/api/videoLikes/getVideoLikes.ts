// pages/api/videolikes/getVideoLikes.ts
import { supabase } from "../../../supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getVideoLikes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoId } = req.query;

  try {
    const { data, error } = await supabase
      .from("VideoLike")
      .select("id, userId")
      .eq("videoId", videoId);

    if (error) {
      throw error;
    }

    res.status(200).json({ data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
