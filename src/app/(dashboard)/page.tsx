"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  QrCode,
  TrendingUp,
  Clock,
  UserPlus,
  Activity,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/avatar";
import { PageTransition } from "@/components/page-transition";
import { FloatingParticles } from "@/components/particles";
import { formatCurrency } from "@/lib/utils";

interface Stats {
  totalMembers: number;
  activeMembers: number;
  todayCheckIns: number;
  monthlyRevenue: number;
  activePlans: number;
}

interface CheckIn {
  id: string;
  member?: { first_name: string; last_name: string } | null;
  check_in_time: string;
  check_out_time: string | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/checkins").then((r) => r.json()),
    ])
      .then(([statsData, checkinsData]) => {
        setStats(statsData);
        setRecentCheckIns(checkinsData.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getMemberName = (c: CheckIn) => {
    if (c.member) return `${c.member.first_name} ${c.member.last_name}`;
    return "Unknown Member";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-luxury min-h-full relative">
      <FloatingParticles />
      <PageTransition>
      <div className="animate-fade-in-down">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
          Welcome back, <span className="gradient-text-gold">Admin</span>
          <Sparkles className="h-6 w-6 text-amber-500 animate-float" />
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening at your gym today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Members" value={stats?.totalMembers || 0} description={`${stats?.activeMembers || 0} active`} icon={Users} trend="up" trendValue="+5%" index={0} />
        <StatsCard title="Today's Check-Ins" value={stats?.todayCheckIns || 0} description="Members checked in today" icon={QrCode} trend="up" trendValue="+12%" index={1} />
        <StatsCard title="Monthly Revenue" value={formatCurrency(stats?.monthlyRevenue || 0)} description="Current month" icon={TrendingUp} trend="up" trendValue="+8%" index={2} />
        <StatsCard title="Active Plans" value={stats?.activePlans || 0} description="Membership tiers" icon={CreditCard} index={3} />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Check-Ins */}
        <Card className="lg:col-span-2 animate-fade-in-up animate-delay-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30">
                <Activity className="h-4 w-4" />
              </div>
              Recent Check-Ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCheckIns.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No check-ins yet today.</p>
            ) : (
              <div className="space-y-3">
                {recentCheckIns.map((checkin, index) => (
                  <div key={checkin.id} className="flex items-center justify-between rounded-xl border border-border/50 p-3 hover:bg-muted/50 transition-all duration-300 hover:shadow-md hover:border-amber-500/20 animate-fade-in-up group" style={{ animationDelay: `${300 + index * 100}ms` }}>
                    <div className="flex items-center gap-3">
                      <Avatar alt={getMemberName(checkin)} size="md" />
                      <div>
                        <p className="font-semibold text-sm group-hover:text-amber-600 transition-colors">{getMemberName(checkin)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(checkin.check_in_time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={!checkin.check_out_time ? "success" : "secondary"}>
                      {!checkin.check_out_time ? "In" : "Out"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="animate-fade-in-up animate-delay-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30">
                <Calendar className="h-4 w-4" />
              </div>
              Gym Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 p-4 hover:bg-muted/30 transition-all duration-300 hover:shadow-md hover:border-amber-500/20 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Members</span>
                  <span className="font-bold text-amber-600">{stats?.activeMembers || 0}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-1000" style={{ width: `${stats?.totalMembers ? (stats.activeMembers / stats.totalMembers) * 100 : 0}%` }} />
                </div>
              </div>
              <div className="rounded-xl border border-border/50 p-4 hover:bg-muted/30 transition-all duration-300 hover:shadow-md hover:border-emerald-500/20 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Today&apos;s Attendance</span>
                  <span className="font-bold text-emerald-600">{stats?.todayCheckIns || 0}</span>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 p-4 hover:bg-muted/30 transition-all duration-300 hover:shadow-md hover:border-purple-500/20 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue This Month</span>
                  <span className="font-bold text-purple-600">{formatCurrency(stats?.monthlyRevenue || 0)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-fade-in-up animate-delay-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30">
              <UserPlus className="h-4 w-4" />
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/members", icon: UserPlus, label: "Add Member", sub: "Register new", delay: 700 },
              { href: "/checkins", icon: QrCode, label: "Check-In", sub: "Scan member", delay: 800 },
              { href: "/plans", icon: CreditCard, label: "View Plans", sub: "Manage tiers", delay: 900 },
              { href: "/payments", icon: TrendingUp, label: "Payments", sub: "View revenue", delay: 1000 },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="flex items-center gap-3 rounded-xl border border-border/50 p-4 hover:bg-gradient-to-br hover:from-amber-500/5 hover:to-transparent hover:border-amber-500/30 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/10 hover-lift group animate-fade-in-up" style={{ animationDelay: `${action.delay}ms` }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 group-hover:from-amber-500 group-hover:to-amber-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300">
                  <action.icon className="h-5 w-5 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold text-sm group-hover:text-amber-600 transition-colors">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      </PageTransition>
    </div>
  );
}