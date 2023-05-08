// pages/api/videoLikes/addVideoLike.ts
import { supabase } from "../../../supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function addVideoLike(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoId, userId } = req.body;

  try {
    const { data, error } = await supabase
      .from("VideoLike")
      .insert([{ videoId, userId }]);

    if (error) {
      throw error;
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error in addVideoLike:", error); // Add error logging here
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
