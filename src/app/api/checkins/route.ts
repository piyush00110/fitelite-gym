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

  if (!member_id) {
    return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
  }

  // Verify member exists
  const { data: member, error: memberError } = await getSupabase()
    .from("members")
    .select("id")
    .eq("id", member_id)
    .single();

  if (memberError || !member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  if (action === "checkin") {
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
        { error: "Member is already checked in today" },
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
        { error: "No active check-in found for this member today" },
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