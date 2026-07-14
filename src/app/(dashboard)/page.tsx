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
} from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/avatar";
import { formatCurrency } from "@/lib/utils";

const demoStats = {
  totalMembers: 247,
  activeMembers: 218,
  todayCheckIns: 42,
  monthlyRevenue: 12450,
  checkInsTrend: "+12%",
  revenueTrend: "+8%",
  membersTrend: "+5%",
};

const recentCheckIns = [
  { id: "1", name: "Marcus Johnson", time: "09:45 AM", status: "checked-in" },
  { id: "2", name: "Sarah Williams", time: "09:30 AM", status: "checked-in" },
  { id: "3", name: "David Chen", time: "09:15 AM", status: "checked-out" },
  { id: "4", name: "Emma Rodriguez", time: "08:50 AM", status: "checked-in" },
  { id: "5", name: "James Wilson", time: "08:30 AM", status: "checked-out" },
];

const upcomingExpirations = [
  { name: "Alex Thompson", plan: "Monthly", expires: "Tomorrow" },
  { name: "Lisa Anderson", plan: "Quarterly", expires: "In 3 days" },
  { name: "Michael Brown", plan: "Monthly", expires: "In 5 days" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 bg-luxury min-h-full">
      {/* Header */}
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
        <StatsCard
          title="Total Members"
          value={demoStats.totalMembers}
          description={`${demoStats.activeMembers} active`}
          icon={Users}
          trend="up"
          trendValue={demoStats.membersTrend}
          index={0}
        />
        <StatsCard
          title="Today's Check-Ins"
          value={demoStats.todayCheckIns}
          description="Members checked in today"
          icon={QrCode}
          trend="up"
          trendValue={demoStats.checkInsTrend}
          index={1}
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(demoStats.monthlyRevenue)}
          description="Current month"
          icon={TrendingUp}
          trend="up"
          trendValue={demoStats.revenueTrend}
          index={2}
        />
        <StatsCard
          title="Active Plans"
          value={3}
          description="Membership tiers"
          icon={CreditCard}
          index={3}
        />
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
            <div className="space-y-3">
              {recentCheckIns.map((checkin, index) => (
                <div
                  key={checkin.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 p-3 hover:bg-muted/50 transition-all duration-300 hover:shadow-md hover:border-amber-500/20 animate-fade-in-up group"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar alt={checkin.name} size="md" />
                    <div>
                      <p className="font-semibold text-sm group-hover:text-amber-600 transition-colors">{checkin.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {checkin.time}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      checkin.status === "checked-in" ? "success" : "secondary"
                    }
                  >
                    {checkin.status === "checked-in" ? "In" : "Out"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Expirations */}
        <Card className="animate-fade-in-up animate-delay-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30">
                <Calendar className="h-4 w-4" />
              </div>
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingExpirations.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border/50 p-3 hover:bg-muted/50 transition-all duration-300 hover:shadow-md hover:border-orange-500/20 animate-fade-in-up group"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <p className="font-semibold text-sm group-hover:text-orange-600 transition-colors">{item.name}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <Badge variant="outline">{item.plan}</Badge>
                    <span className="text-xs text-orange-500 font-semibold px-2 py-0.5 rounded-full bg-orange-500/10">
                      {item.expires}
                    </span>
                  </div>
                </div>
              ))}
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
              { href: "/members", icon: UserPlus, label: "Add Member", sub: "Register new", color: "amber", delay: 700 },
              { href: "/checkins", icon: QrCode, label: "Check-In", sub: "Scan member", color: "emerald", delay: 800 },
              { href: "/plans", icon: CreditCard, label: "View Plans", sub: "Manage tiers", color: "orange", delay: 900 },
              { href: "/payments", icon: TrendingUp, label: "Payments", sub: "View revenue", color: "purple", delay: 1000 },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-xl border border-border/50 p-4 hover:bg-gradient-to-br hover:from-amber-500/5 hover:to-transparent hover:border-amber-500/30 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/10 hover-lift group animate-fade-in-up"
                style={{ animationDelay: `${action.delay}ms` }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 group-hover:from-amber-500 group-hover:to-amber-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300">
                  <action.icon className="h-5 w-5 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="font-semibold text-sm group-hover:text-amber-600 transition-colors">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}