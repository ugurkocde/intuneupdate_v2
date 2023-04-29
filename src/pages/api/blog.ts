import type { NextApiRequest, NextApiResponse } from "next";
import { getBlogs } from "../../getBlogs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const blogs = await getBlogs();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
