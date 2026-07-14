import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Total members
  const { count: totalMembers } = await getSupabase()
    .from("members")
    .select("*", { count: "exact", head: true });

  // Active members
  const { count: activeMembers } = await getSupabase()
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Today's check-ins
  const { count: todayCheckIns } = await getSupabase()
    .from("check_ins")
    .select("*", { count: "exact", head: true })
    .gte("check_in_time", today);

  // Monthly revenue
  const { data: monthlyPayments } = await getSupabase()
    .from("payments")
    .select("amount")
    .gte("payment_date", thirtyDaysAgo);

  const monthlyRevenue =
    monthlyPayments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

  // Active plans
  const { count: activePlans } = await getSupabase()
    .from("membership_plans")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  return NextResponse.json({
    totalMembers: totalMembers || 0,
    activeMembers: activeMembers || 0,
    todayCheckIns: todayCheckIns || 0,
    monthlyRevenue,
    activePlans: activePlans || 0,
  });
}
