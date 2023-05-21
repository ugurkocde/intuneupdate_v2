import { supabase } from "./supabaseClient";
import { IntuneMSBlogPostCard } from "./components/IntuneMSBlogPostCard";

export async function getIntuneMSBlogs(): Promise<IntuneMSBlogPostCard[]> {
  const { data, error, status } = await supabase
    .from("IntuneMSBlogPost")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(`Error fetching blogs: ${error.message}, Status: ${status}`);
    throw error;
  }

  return data as IntuneMSBlogPostCard[];
}
