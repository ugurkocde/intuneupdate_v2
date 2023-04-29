import { supabase } from "./supabaseClient";

interface BlogData {
  id: number;
  author: string;
  title: string;
  releaseDate: string;
}

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
