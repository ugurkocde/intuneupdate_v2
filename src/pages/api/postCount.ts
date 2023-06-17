import { PrismaClient } from "@prisma/client";
import { supabase } from "~/supabaseClient";

const prisma = new PrismaClient();

export default async (req: any, res: any) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  const monthAgo = new Date(today);
  monthAgo.setMonth(today.getMonth() - 1);

  const tableNames = [
    "BlogPost",
    "MSBlogPost",
    "WindowsBlogPost",
    "IntuneMSBlogPost",
  ];

  let totalPostCount = 0;
  let dailyPostCount = 0;
  let weeklyPostCount = 0;
  let monthlyPostCount = 0;

  for (let i = 0; i < tableNames.length; i++) {
    const tableName = tableNames[i];

    if (!tableName) {
      console.error(`Table name at index ${i} is undefined.`);
      return res.status(500).json({ error: "Table name is undefined" });
    }

    // daily count
    const {
      data: dailyData,
      error: dailyError,
      count: dailyCount,
    } = await supabase
      .from(tableName)
      .select("id", { count: "exact" })
      .gte("createdAt", today.toISOString());

    if (dailyError) {
      console.error(
        `Error fetching daily posts count from ${tableName}: ${dailyError.message}`
      );
      return res.status(500).json({ error: dailyError.message });
    }

    dailyPostCount += dailyCount ?? 0;

    // weekly count
    const {
      data: weeklyData,
      error: weeklyError,
      count: weeklyCount,
    } = await supabase
      .from(tableName)
      .select("id", { count: "exact" })
      .gte("createdAt", weekAgo.toISOString());

    if (weeklyError) {
      console.error(
        `Error fetching weekly posts count from ${tableName}: ${weeklyError.message}`
      );
      return res.status(500).json({ error: weeklyError.message });
    }

    weeklyPostCount += weeklyCount ?? 0;

    // monthly count
    const {
      data: monthlyData,
      error: monthlyError,
      count: monthlyCount,
    } = await supabase
      .from(tableName)
      .select("id", { count: "exact" })
      .gte("createdAt", monthAgo.toISOString());

    if (monthlyError) {
      console.error(
        `Error fetching monthly posts count from ${tableName}: ${monthlyError.message}`
      );
      return res.status(500).json({ error: monthlyError.message });
    }

    monthlyPostCount += monthlyCount ?? 0;

    // total count
    const {
      data: totalData,
      error: totalError,
      count: totalCount,
    } = await supabase.from(tableName).select("id", { count: "exact" });

    if (totalError) {
      console.error(
        `Error fetching total posts count from ${tableName}: ${totalError.message}`
      );
      return res.status(500).json({ error: totalError.message });
    }

    totalPostCount += totalCount ?? 0;
  }

  res.status(200).json({
    totalPostCount: totalPostCount,
    dailyPostCount: dailyPostCount,
    weeklyPostCount: weeklyPostCount,
    monthlyPostCount: monthlyPostCount,
  });
};
