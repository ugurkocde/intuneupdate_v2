import { supabase } from "../../../supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getLikes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { blogId, intunemsBlogId, msBlogId, windowsBlogId } = req.query;

  let column: string;
  let value: any;

  if (blogId) {
    column = "blogId";
    value = blogId;
  } else if (intunemsBlogId) {
    column = "intunemsBlogId";
    value = intunemsBlogId;
  } else if (msBlogId) {
    column = "msBlogId";
    value = msBlogId;
  } else if (windowsBlogId) {
    column = "windowsBlogId";
    value = windowsBlogId;
  } else {
    return res.status(400).json({ error: "Missing id or type" });
  }

  try {
    const { data, error } = await supabase
      .from("Like")
      .select("id, userId")
      .eq(column, value);

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
