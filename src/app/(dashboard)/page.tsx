import {
  Users,
  CreditCard,
  QrCode,
  TrendingUp,
  Clock,
  UserPlus,
  Activity,
  Calendar,
} from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/avatar";
import { formatCurrency } from "@/lib/utils";

// Demo data for luxury preview
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome back, <span className="gradient-text">Admin</span>
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
        />
        <StatsCard
          title="Today's Check-Ins"
          value={demoStats.todayCheckIns}
          description="Members checked in today"
          icon={QrCode}
          trend="up"
          trendValue={demoStats.checkInsTrend}
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(demoStats.monthlyRevenue)}
          description="Current month"
          icon={TrendingUp}
          trend="up"
          trendValue={demoStats.revenueTrend}
        />
        <StatsCard
          title="Active Plans"
          value={3}
          description="Membership tiers"
          icon={CreditCard}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Check-Ins */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Check-Ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCheckIns.map((checkin) => (
                <div
                  key={checkin.id}
                  className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar alt={checkin.name} size="md" />
                    <div>
                      <p className="font-semibold text-sm">{checkin.name}</p>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-warning" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExpirations.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border p-3 hover:bg-muted/50 transition-colors"
                >
                  <p className="font-semibold text-sm">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="outline">{item.plan}</Badge>
                    <span className="text-xs text-warning font-medium">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/members"
              className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-primary/5 hover:border-primary/30 transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Add Member</p>
                <p className="text-xs text-muted-foreground">Register new</p>
              </div>
            </a>
            <a
              href="/checkins"
              className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-success/5 hover:border-success/30 transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                <QrCode className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-semibold text-sm">Check-In</p>
                <p className="text-xs text-muted-foreground">Scan member</p>
              </div>
            </a>
            <a
              href="/plans"
              className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-warning/5 hover:border-warning/30 transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 group-hover:bg-warning/20 transition-colors">
                <CreditCard className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-sm">View Plans</p>
                <p className="text-xs text-muted-foreground">Manage tiers</p>
              </div>
            </a>
            <a
              href="/payments"
              className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-info/5 hover:border-info/30 transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Payments</p>
                <p className="text-xs text-muted-foreground">View revenue</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
