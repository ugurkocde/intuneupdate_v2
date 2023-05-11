import { supabase } from "./supabaseClient";
import { BlogData } from "../src/components/BlogPostCard";

export async function getBlogs(): Promise<BlogData[]> {
  const { data, error, status } = await supabase
    .from("BlogPost")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(`Error fetching blogs: ${error.message}, Status: ${status}`);
    throw error;
  }

  return data as BlogData[];
}
