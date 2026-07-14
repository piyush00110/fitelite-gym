import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("member_id");

  let query = getSupabase()
    .from("check_ins")
    .select("*, member:members(first_name, last_name)")
    .order("check_in_time", { ascending: false });

  if (memberId) {
    query = query.eq("member_id", memberId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { member_id, action } = body;

  if (action === "checkin") {
    // Check if member has active membership
    const { data: membership } = await getSupabase()
      .from("member_memberships")
      .select("*")
      .eq("member_id", member_id)
      .eq("is_active", true)
      .gte("end_date", new Date().toISOString().split("T")[0])
      .single();

    if (!membership) {
      return NextResponse.json(
        { error: "Member does not have an active membership" },
        { status: 400 }
      );
    }

    // Check if already checked in today
    const today = new Date().toISOString().split("T")[0];
    const { data: existingCheckIn } = await getSupabase()
      .from("check_ins")
      .select("id")
      .eq("member_id", member_id)
      .gte("check_in_time", today)
      .is("check_out_time", null)
      .single();

    if (existingCheckIn) {
      return NextResponse.json(
        { error: "Member is already checked in" },
        { status: 400 }
      );
    }

    const { data, error } = await getSupabase()
      .from("check_ins")
      .insert({
        member_id,
        check_in_time: new Date().toISOString(),
      } as any)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  }

  if (action === "checkout") {
    const today = new Date().toISOString().split("T")[0];
    const { data: checkIn } = await getSupabase()
      .from("check_ins")
      .select("id")
      .eq("member_id", member_id)
      .gte("check_in_time", today)
      .is("check_out_time", null)
      .order("check_in_time", { ascending: false })
      .limit(1)
      .single();

    if (!checkIn) {
      return NextResponse.json(
        { error: "No active check-in found" },
        { status: 400 }
      );
    }

    const checkInId = (checkIn as Record<string, unknown>).id;
    const { data, error } = await getSupabase()
      .from("check_ins")
      .update({ check_out_time: new Date().toISOString() })
      .eq("id", checkInId as string)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  return NextResponse.json(
    { error: "Invalid action. Use 'checkin' or 'checkout'" },
    { status: 400 }
  );
}
