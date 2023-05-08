// src/videoBookmarks.ts
import { supabase } from "./supabaseClient";

export async function addVideoBookmark(userId: string, videoId: number) {
  const { data, error } = await supabase
    .from("VideoBookmark")
    .insert([{ userId, videoId }]);

  if (error) {
    throw error;
  }

  return data;
}

export async function removeVideoBookmark(userId: string, videoId: number) {
  const { data, error } = await supabase
    .from("VideoBookmark")
    .delete()
    .eq("userId", userId)
    .eq("videoId", videoId);

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserVideoBookmarks(userId: string) {
  const { data, error } = await supabase
    .from("VideoBookmark")
    .select(`*, YoutubeVideos(*)`)
    .eq("userId", userId);

  if (error) {
    throw error;
  }

  return data.reduce((acc, bookmark) => {
    acc[bookmark.videoId] = bookmark;
    return acc;
  }, {});
}
