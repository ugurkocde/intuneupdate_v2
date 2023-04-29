import { supabase } from "../../../supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getLikes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { blogId } = req.query;

  try {
    const { data, error } = await supabase
      .from("Like")
      .select("id, userId")
      .eq("blogId", blogId);

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
