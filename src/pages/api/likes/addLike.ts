import { supabase } from "../../../supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

interface InsertData {
  userId: any;
  blogId?: any;
  intunemsBlogId?: any;
  msBlogId?: any;
  windowsBlogId?: any;
}

export default async function addLike(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { blogId, userId, intunemsBlogId, msBlogId, windowsBlogId } = req.body;

  //console.log("Request body:", req.body);

  // Input validation
  if (!userId || !(blogId || intunemsBlogId || msBlogId || windowsBlogId)) {
    res.status(400).json({
      error:
        "Missing blogId or intunemsBlogId or msBlogId or windowsBlogId or userId",
    });
    return;
  }

  try {
    let existingLike;
    let error;

    if (blogId) {
      ({ data: existingLike, error } = await supabase
        .from("Like")
        .select("*")
        .eq("blogId", blogId)
        .eq("userId", userId));
    }
    if (!existingLike && intunemsBlogId) {
      ({ data: existingLike, error } = await supabase
        .from("Like")
        .select("*")
        .eq("intunemsBlogId", intunemsBlogId)
        .eq("userId", userId));
    }
    if (!existingLike && msBlogId) {
      ({ data: existingLike, error } = await supabase
        .from("Like")
        .select("*")
        .eq("msBlogId", msBlogId)
        .eq("userId", userId));
    }
    if (!existingLike && windowsBlogId) {
      ({ data: existingLike, error } = await supabase
        .from("Like")
        .select("*")
        .eq("windowsBlogId", windowsBlogId)
        .eq("userId", userId));
    }

    // console.log("Existing like:", existingLike);

    if (error) {
      console.error("Error fetching existing like:", error);
      res.status(500).json({ error: error.message });
      return;
    }

    // If existingLike is not null and it has one or more records
    if (existingLike && existingLike.length > 0) {
      res.status(409).json({ error: "Like already exists" });
      return;
    }

    let insertData: InsertData = { userId };
    if (blogId) insertData.blogId = blogId;
    if (intunemsBlogId) insertData.intunemsBlogId = intunemsBlogId;
    if (msBlogId) insertData.msBlogId = msBlogId;
    if (windowsBlogId) insertData.windowsBlogId = windowsBlogId;

    const { data, error: insertError } = await supabase
      .from("Like")
      .insert([insertData]);

    if (insertError) {
      console.error("Error inserting like:", insertError);
      res.status(500).json({ error: insertError.message });
      return;
    }

    res.status(200).json({ data });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
