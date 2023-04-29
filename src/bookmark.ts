// src/bookmarks.ts
import { supabase } from "./supabaseClient";

export async function addBookmark(userId: string, blogId: number) {
  const { data, error } = await supabase
    .from("Bookmark")
    .insert([{ userId, blogId }]);

  if (error) {
    throw error;
  }

  return data;
}

export async function removeBookmark(userId: string, blogId: number) {
  const { data, error } = await supabase
    .from("Bookmark")
    .delete()
    .eq("userId", userId)
    .eq("blogId", blogId);

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserBookmarks(userId: string) {
  const { data, error } = await supabase
    .from("Bookmark")
    .select(`*, BlogPost(*)`)
    .eq("userId", userId);

  if (error) {
    throw error;
  }

  return data.reduce((acc, bookmark) => {
    acc[bookmark.blogId] = bookmark;
    return acc;
  }, {});
}
