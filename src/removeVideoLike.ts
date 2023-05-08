// src/removeVideoLike.ts
import { supabase } from "./supabaseClient";

export async function removeVideoLike(userId: string, videoId: number) {
  const { data, error } = await supabase
    .from("VideoLike")
    .delete()
    .match({ userId, videoId });

  if (error) {
    throw error;
  }

  return data;
}
