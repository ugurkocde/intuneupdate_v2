import { supabase } from "./supabaseClient";

interface VideoData {
  id: number;
  url: string;
  author: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tweeted: boolean;
}

export async function getVideos(): Promise<VideoData[]> {
  const { data, error, status } = await supabase
    .from("YoutubeVideos")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(`Error fetching videos: ${error.message}, Status: ${status}`);
    throw error;
  }

  return data as VideoData[];
}
