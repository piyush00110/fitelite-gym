import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { member_id, plan_id } = body;

  // Get the plan details
  const { data: plan, error: planError } = await getSupabase()
    .from("membership_plans")
    .select("*")
    .eq("id", plan_id)
    .single();

  if (planError || !plan) {
    return NextResponse.json(
      { error: "Plan not found" },
      { status: 404 }
    );
  }

  // Create membership
  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date(
    Date.now() + (plan as any).duration_days * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  const { data: membership, error: membershipError } = await getSupabase()
    .from("member_memberships")
    .insert({
      member_id,
      plan_id,
      start_date: startDate,
      end_date: endDate,
      is_active: true,
    } as any)
    .select()
    .single();

  if (membershipError) {
    return NextResponse.json(
      { error: membershipError.message },
      { status: 500 }
    );
  }

  // Create payment record
  const { error: paymentError } = await getSupabase().from("payments").insert({
    member_id,
    amount: (plan as any).price,
    payment_date: new Date().toISOString(),
    payment_method: "Cash",
    notes: `New ${(plan as any).name} membership`,
  } as any);

  if (paymentError) {
    return NextResponse.json(
      { error: paymentError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(membership, { status: 201 });
}
