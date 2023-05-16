import { supabase } from "./supabaseClient";
import { MSBlogPostCard } from "../src/components/MSBlogPostCard";

export async function getMSBlogs(): Promise<MSBlogPostCard[]> {
  const { data, error, status } = await supabase
    .from("MSBlogPost")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(`Error fetching blogs: ${error.message}, Status: ${status}`);
    throw error;
  }

  return data as MSBlogPostCard[];
}
