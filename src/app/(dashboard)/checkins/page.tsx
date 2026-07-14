"use client";

import { useState } from "react";
import {
  QrCode,
  LogIn,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/avatar";
import { StatsCard } from "@/components/stats-card";
import { formatTime } from "@/lib/utils";

interface TodayCheckIn {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: "checked-in" | "checked-out";
}

const demoCheckIns: TodayCheckIn[] = [
  {
    id: "1",
    memberId: "1",
    memberName: "Marcus Johnson",
    checkInTime: "2024-01-15T09:45:00",
    checkOutTime: null,
    status: "checked-in",
  },
  {
    id: "2",
    memberId: "2",
    memberName: "Sarah Williams",
    checkInTime: "2024-01-15T09:30:00",
    checkOutTime: null,
    status: "checked-in",
  },
  {
    id: "3",
    memberId: "3",
    memberName: "David Chen",
    checkInTime: "2024-01-15T09:15:00",
    checkOutTime: "2024-01-15T10:30:00",
    status: "checked-out",
  },
  {
    id: "4",
    memberId: "4",
    memberName: "Emma Rodriguez",
    checkInTime: "2024-01-15T08:50:00",
    checkOutTime: null,
    status: "checked-in",
  },
  {
    id: "5",
    memberId: "5",
    memberName: "James Wilson",
    checkInTime: "2024-01-15T08:30:00",
    checkOutTime: "2024-01-15T09:45:00",
    status: "checked-out",
  },
];

export default function CheckInsPage() {
  const [memberId, setMemberId] = useState("");
  const [checkIns, setCheckIns] = useState<TodayCheckIn[]>(demoCheckIns);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const todayCheckedIn = checkIns.filter((c) => c.status === "checked-in").length;
  const todayCheckedOut = checkIns.filter((c) => c.status === "checked-out").length;

  const handleCheckIn = () => {
    if (!memberId.trim()) {
      setMessage({ type: "error", text: "Please enter a member ID" });
      return;
    }

    const alreadyCheckedIn = checkIns.some(
      (c) => c.memberId === memberId && c.status === "checked-in"
    );

    if (alreadyCheckedIn) {
      setMessage({ type: "error", text: "Member is already checked in today" });
      return;
    }

    const newCheckIn: TodayCheckIn = {
      id: String(checkIns.length + 1),
      memberId: memberId,
      memberName: `Member ${memberId}`,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      status: "checked-in",
    };

    setCheckIns([newCheckIn, ...checkIns]);
    setMessage({ type: "success", text: `Member ${memberId} checked in successfully!` });
    setMemberId("");
  };

  const handleCheckOut = () => {
    if (!memberId.trim()) {
      setMessage({ type: "error", text: "Please enter a member ID" });
      return;
    }

    const checkedIn = checkIns.find(
      (c) => c.memberId === memberId && c.status === "checked-in"
    );

    if (!checkedIn) {
      setMessage({ type: "error", text: "No active check-in found for this member" });
      return;
    }

    setCheckIns(
      checkIns.map((c) =>
        c.id === checkedIn.id
          ? { ...c, checkOutTime: new Date().toISOString(), status: "checked-out" }
          : c
      )
    );
    setMessage({ type: "success", text: `Member ${memberId} checked out successfully!` });
    setMemberId("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
          <QrCode className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          Check-In / Check-Out
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Manage member check-ins and check-outs for today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <StatsCard
          title="Checked In Now"
          value={todayCheckedIn}
          description="Currently in gym"
          icon={LogIn}
        />
        <StatsCard
          title="Checked Out"
          value={todayCheckedOut}
          description="Left today"
          icon={LogOut}
        />
        <StatsCard
          title="Total Today"
          value={checkIns.length}
          description="All check-ins"
          icon={Clock}
        />
      </div>

      {/* Check-In/Out Form */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Check-In / Check-Out</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="memberId">Member ID</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="memberId"
                  placeholder="Enter member ID..."
                  value={memberId}
                  onChange={(e) => {
                    setMemberId(e.target.value);
                    setMessage(null);
                  }}
                  className="pl-10 text-base sm:text-lg h-12 sm:h-14"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCheckIn();
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCheckIn}
                variant="success"
                className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-green-600"
              >
                <LogIn className="h-5 w-5" />
                Check In
              </Button>
              <Button
                onClick={handleCheckOut}
                variant="destructive"
                className="flex-1 sm:flex-none bg-gradient-to-r from-red-500 to-rose-600"
              >
                <LogOut className="h-5 w-5" />
                Check Out
              </Button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 flex items-center gap-2 rounded-xl p-3 ${
                message.type === "success"
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today&apos;s Check-In Log</span>
            <Badge variant="secondary">{checkIns.length} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checkIns.map((checkin) => (
              <div
                key={checkin.id}
                className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Avatar alt={checkin.memberName} size="md" />
                  <div>
                    <p className="font-semibold">{checkin.memberName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Check-in: {formatTime(checkin.checkInTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {checkin.checkOutTime && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Check-out: {formatTime(checkin.checkOutTime)}
                    </p>
                  )}
                  <Badge
                    variant={
                      checkin.status === "checked-in" ? "success" : "secondary"
                    }
                    className="text-sm"
                  >
                    {checkin.status === "checked-in" ? (
                      <>
                        <LogIn className="h-3 w-3 mr-1" /> In Gym
                      </>
                    ) : (
                      <>
                        <LogOut className="h-3 w-3 mr-1" /> Left
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
