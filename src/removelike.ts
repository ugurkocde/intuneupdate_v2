import { supabase } from "./supabaseClient";

export async function removeLike(userId: string, id: number, type: string) {
  let column: string;

  switch (type) {
    case "blogId":
      column = "blogId";
      break;
    case "intunemsBlogId":
      column = "intunemsBlogId";
      break;
    case "msBlogId":
      column = "msBlogId";
      break;
    case "windowsBlogId":
      column = "windowsBlogId";
      break;
    default:
      throw new Error("Invalid type");
  }

  const { data, error } = await supabase
    .from("Like")
    .delete()
    .match({ userId, [column]: id });

  if (error) {
    throw error;
  }

  return data;
}
