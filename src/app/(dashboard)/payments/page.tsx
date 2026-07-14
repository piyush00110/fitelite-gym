"use client";

import { useState } from "react";
import {
  Receipt,
  Search,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  CreditCard,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Payment {
  id: string;
  memberName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  notes: string;
}

const demoPayments: Payment[] = [
  {
    id: "1",
    memberName: "Marcus Johnson",
    amount: 49.99,
    paymentDate: "2024-01-15T10:30:00",
    paymentMethod: "Cash",
    notes: "Monthly membership",
  },
  {
    id: "2",
    memberName: "Sarah Williams",
    amount: 119.99,
    paymentDate: "2024-01-14T14:20:00",
    paymentMethod: "Credit Card",
    notes: "Quarterly membership",
  },
  {
    id: "3",
    memberName: "David Chen",
    amount: 399.99,
    paymentDate: "2024-01-13T09:15:00",
    paymentMethod: "Bank Transfer",
    notes: "Yearly membership",
  },
  {
    id: "4",
    memberName: "Emma Rodriguez",
    amount: 49.99,
    paymentDate: "2024-01-12T16:45:00",
    paymentMethod: "Cash",
    notes: "Monthly membership renewal",
  },
  {
    id: "5",
    memberName: "James Wilson",
    amount: 119.99,
    paymentDate: "2024-01-11T11:00:00",
    paymentMethod: "Credit Card",
    notes: "Quarterly membership",
  },
  {
    id: "6",
    memberName: "Olivia Martinez",
    amount: 49.99,
    paymentDate: "2024-01-10T13:30:00",
    paymentMethod: "Mobile Pay",
    notes: "Monthly membership",
  },
];

const methodIcons: Record<string, React.ElementType> = {
  Cash: Banknote,
  "Credit Card": CreditCard,
  "Bank Transfer": DollarSign,
  "Mobile Pay": CreditCard,
};

const methodColors: Record<string, string> = {
  Cash: "bg-emerald-500/10 text-emerald-600",
  "Credit Card": "bg-blue-500/10 text-blue-600",
  "Bank Transfer": "bg-purple-500/10 text-purple-600",
  "Mobile Pay": "bg-orange-500/10 text-orange-600",
};

export default function PaymentsPage() {
  const [payments] = useState<Payment[]>(demoPayments);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = payments.filter(
    (p) =>
      p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const averagePayment = totalRevenue / payments.length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <Receipt className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            Payments
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Track all payment transactions and revenue.
          </p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="h-5 w-5" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          description="All time"
          icon={TrendingUp}
          trend="up"
          trendValue="+12%"
        />
        <StatsCard
          title="Average Payment"
          value={formatCurrency(averagePayment)}
          description="Per transaction"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Transactions"
          value={payments.length}
          description="All payments"
          icon={Receipt}
        />
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by member, method, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Payments</span>
            <Badge variant="secondary">{filteredPayments.length} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPayments.map((payment) => {
              const MethodIcon = methodIcons[payment.paymentMethod] || CreditCard;
              const colorClass =
                methodColors[payment.paymentMethod] ||
                "bg-gray-500/10 text-gray-600";

              return (
                <div
                  key={payment.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border p-3 sm:p-4 hover:bg-muted/50 transition-all gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClass}`}
                    >
                      <MethodIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">{payment.memberName}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.notes}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 sm:flex-shrink-0 pl-15 sm:pl-0">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payment.paymentDate)}
                      </p>
                      <Badge variant="outline">{payment.paymentMethod}</Badge>
                    </div>
                    <p className="text-lg font-bold text-success min-w-[100px] text-right">
                      +{formatCurrency(payment.amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
