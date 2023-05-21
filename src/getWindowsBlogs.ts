import { supabase } from "./supabaseClient";
import { WindowsBlogPostCard } from "./components/WindowsBlogPostCard";

export async function getWindowsBlogs(): Promise<WindowsBlogPostCard[]> {
  const { data, error, status } = await supabase
    .from("WindowsBlogPost")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(`Error fetching blogs: ${error.message}, Status: ${status}`);
    throw error;
  }

  return data as WindowsBlogPostCard[];
}
