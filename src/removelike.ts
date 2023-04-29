// src/removelike.ts
import { supabase } from "./supabaseClient";

export async function removeLike(userId: string, blogId: number) {
  const { data, error } = await supabase
    .from("Like")
    .delete()
    .match({ userId, blogId });

  if (error) {
    throw error;
  }

  return data;
}
