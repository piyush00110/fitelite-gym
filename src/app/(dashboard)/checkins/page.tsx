"use client";

import { useState, useEffect, useCallback } from "react";
import {
  QrCode,
  LogIn,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/avatar";
import { StatsCard } from "@/components/stats-card";
import { formatTime } from "@/lib/utils";
import type { Member } from "@/types/database";

interface TodayCheckIn {
  id: string;
  member_id: string;
  member?: { first_name: string; last_name: string } | null;
  check_in_time: string;
  check_out_time: string | null;
}

export default function CheckInsPage() {
  const [memberId, setMemberId] = useState("");
  const [checkIns, setCheckIns] = useState<TodayCheckIn[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const getMemberName = (c: TodayCheckIn) => {
    if (c.member) return `${c.member.first_name} ${c.member.last_name}`;
    return `Member #${c.member_id?.slice(0, 8) || "???"}`;
  };

  const fetchCheckIns = useCallback(async () => {
    try {
      const res = await fetch("/api/checkins");
      if (res.ok) {
        const data = await res.json();
        setCheckIns(data);
      }
    } catch (err) {
      console.error("Failed to fetch check-ins:", err);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetchCheckIns(),
      fetch("/api/members").then((r) => r.json()).then((data) => setMembers(data)).catch(console.error),
    ]).finally(() => setLoading(false));
  }, [fetchCheckIns]);

  const todayCheckedIn = checkIns.filter((c) => !c.check_out_time).length;
  const todayCheckedOut = checkIns.filter((c) => c.check_out_time).length;

  const handleCheckIn = async () => {
    if (!memberId.trim()) {
      setMessage({ type: "error", text: "Please enter a member ID" });
      return;
    }
    setProcessing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId, action: "checkin" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Member checked in successfully!" });
        setMemberId("");
        fetchCheckIns();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to check in" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    if (!memberId.trim()) {
      setMessage({ type: "error", text: "Please enter a member ID" });
      return;
    }
    setProcessing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId, action: "checkout" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Member checked out successfully!" });
        setMemberId("");
        fetchCheckIns();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to check out" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 bg-luxury min-h-full">
      {/* Header */}
      <div className="animate-fade-in-down">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
            <QrCode className="h-5 w-5" />
          </div>
          Check-In / Check-Out
          <Sparkles className="h-5 w-5 text-amber-500 animate-float" />
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base sm:ml-[52px]">
          Manage member check-ins and check-outs for today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <StatsCard title="Checked In Now" value={todayCheckedIn} description="Currently in gym" icon={LogIn} index={0} />
        <StatsCard title="Checked Out" value={todayCheckedOut} description="Left today" icon={LogOut} index={1} />
        <StatsCard title="Total Today" value={checkIns.length} description="All check-ins" icon={Clock} index={2} />
      </div>

      {/* Check-In/Out Form */}
      <Card className="animate-fade-in-up animate-delay-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-md shadow-emerald-500/30">
              <LogIn className="h-4 w-4" />
            </div>
            Quick Check-In / Check-Out
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="memberId">Select Member</Label>
              <Select
                value={memberId}
                onChange={(e) => { setMemberId(e.target.value); setMessage(null); }}
                disabled={processing}
                className="text-base sm:text-lg h-12 sm:h-14 bg-muted/50 border-border/50 focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300"
              >
                <option value="">Select a member...</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                ))}
              </Select>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCheckIn} variant="success" className="flex-1 sm:flex-none" disabled={processing}>
                {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                Check In
              </Button>
              <Button onClick={handleCheckOut} variant="destructive" className="flex-1 sm:flex-none" disabled={processing}>
                {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
                Check Out
              </Button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`mt-4 flex items-center gap-2 rounded-xl p-3 animate-pop-in ${message.type === "success" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"}`}>
              {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Log */}
      <Card className="animate-fade-in-up animate-delay-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30">
                <Clock className="h-4 w-4" />
              </div>
              Today&apos;s Check-In Log
            </span>
            <Badge variant="secondary">{checkIns.length} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : checkIns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">No check-ins today yet.</div>
          ) : (
            <div className="space-y-3">
              {checkIns.map((checkin, index) => (
                <div
                  key={checkin.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 p-4 hover:bg-muted/30 transition-all duration-300 hover:shadow-md hover:border-amber-500/20 animate-fade-in-up group"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <Avatar alt={getMemberName(checkin)} size="md" />
                    <div>
                      <p className="font-semibold group-hover:text-amber-600 transition-colors">{getMemberName(checkin)}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Check-in: {formatTime(checkin.check_in_time)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {checkin.check_out_time && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Out: {formatTime(checkin.check_out_time)}
                      </p>
                    )}
                    <Badge variant={!checkin.check_out_time ? "success" : "secondary"} className="text-sm">
                      {!checkin.check_out_time ? (
                        <><LogIn className="h-3 w-3 mr-1" /> In Gym</>
                      ) : (
                        <><LogOut className="h-3 w-3 mr-1" /> Left</>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}