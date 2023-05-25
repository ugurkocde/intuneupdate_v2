import { supabase } from "./supabaseClient";
import { MSBlogPostData } from "./components/MSBlogPostCard";

export async function getMSBlogs(): Promise<MSBlogPostData[]> {
  const { data, error, status } = await supabase
    .from("MSBlogPost")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(`Error fetching blogs: ${error.message}, Status: ${status}`);
    throw error;
  }

  return data as MSBlogPostData[];
}
