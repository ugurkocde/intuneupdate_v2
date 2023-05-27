// src/bookmarks.ts
import { supabase } from "./supabaseClient";

export async function addBookmark(
  userId: string,
  blogId?: number,
  windowsBlogId?: number
) {
  const bookmark = {
    userId,
    ...(blogId && { blogId }),
    ...(windowsBlogId && { windowsBlogId }),
  };

  const { data, error } = await supabase.from("Bookmark").insert([bookmark]);

  if (error) {
    throw error;
  }

  return data;
}

export async function removeBookmark(
  userId: string,
  blogId?: number,
  windowsBlogId?: number
) {
  let query = supabase.from("Bookmark").delete().eq("userId", userId);

  if (blogId) {
    query = query.eq("blogId", blogId);
  }

  if (windowsBlogId) {
    query = query.eq("windowsBlogId", windowsBlogId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

export const getUserBookmarks = async (userId: string) => {
  const { data, error } = await supabase
    .from("Bookmark")
    .select("*, BlogPost(*), WindowsBlogPost(*)")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  const { data: videoBookmarks, error: videoError } = await supabase
    .from("VideoBookmark")
    .select("*, YoutubeVideos(*)")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error || videoError) {
    console.error("Error fetching bookmarks", error, videoError);
    return;
  }

  return { blogBookmarks: data, videoBookmarks };
};
