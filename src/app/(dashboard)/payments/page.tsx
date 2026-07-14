"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Receipt,
  Search,
  Plus,
  TrendingUp,
  DollarSign,
  CreditCard,
  Banknote,
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/stats-card";
import { Modal } from "@/components/modal";
import { PaymentForm } from "@/components/payment-form";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Payment {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes: string;
  member?: { first_name: string; last_name: string } | null;
}

const methodIcons: Record<string, React.ElementType> = {
  Cash: Banknote,
  "Credit Card": CreditCard,
  "Bank Transfer": DollarSign,
  "Mobile Pay": CreditCard,
};

const methodGradients: Record<string, string> = {
  Cash: "from-emerald-500 to-green-500",
  "Credit Card": "from-blue-500 to-cyan-500",
  "Bank Transfer": "from-purple-500 to-pink-500",
  "Mobile Pay": "from-orange-500 to-amber-500",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    }
  }, []);

  useEffect(() => {
    fetchPayments().finally(() => setLoading(false));
  }, [fetchPayments]);

  const getMemberName = (p: Payment) => {
    if (p.member) return `${p.member.first_name} ${p.member.last_name}`;
    return "Unknown Member";
  };

  const filteredPayments = payments.filter(
    (p) =>
      getMemberName(p).toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.payment_method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const averagePayment = payments.length > 0 ? totalRevenue / payments.length : 0;

  const handleAddPayment = async (data: {
    member_id: string;
    amount: number;
    payment_method: string;
    notes: string;
  }) => {
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchPayments();
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Failed to add payment:", err);
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPayments((prev) => prev.filter((p) => p.id !== id));
        setShowDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Failed to delete payment:", err);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 bg-luxury min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-down">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
              <Receipt className="h-5 w-5" />
            </div>
            Payments
            <Sparkles className="h-5 w-5 text-amber-500 animate-float" />
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base ml-[52px]">
            Track all payment transactions and revenue.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto animate-fade-in-right">
          <Plus className="h-5 w-5" />
          Add Payment
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
          index={0}
        />
        <StatsCard
          title="Average Payment"
          value={formatCurrency(averagePayment)}
          description="Per transaction"
          icon={DollarSign}
          index={1}
        />
        <StatsCard
          title="Total Transactions"
          value={payments.length}
          description="All payments"
          icon={Receipt}
          index={2}
        />
      </div>

      {/* Search */}
      <Card className="animate-fade-in-up animate-delay-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-amber-500" />
              <Input
                placeholder="Search by member, method, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50 backdrop-blur-sm focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card className="animate-fade-in-up animate-delay-300">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Payments</span>
            <Badge variant="secondary">{filteredPayments.length} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">
              {searchQuery ? "No payments match your search." : "No payments recorded yet."}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayments.map((payment, index) => {
                const MethodIcon = methodIcons[payment.payment_method] || CreditCard;
                const gradient = methodGradients[payment.payment_method] || "from-gray-500 to-gray-600";

                return (
                  <div
                    key={payment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/50 p-3 sm:p-4 hover:bg-muted/30 transition-all duration-300 hover:shadow-md hover:border-amber-500/20 gap-3 animate-fade-in-up group"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                        <MethodIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base group-hover:text-amber-600 transition-colors">{getMemberName(payment)}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {payment.notes || "No notes"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 sm:flex-shrink-0 pl-12 sm:pl-0">
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {formatDate(payment.payment_date)}
                        </p>
                        <Badge variant="outline" className="text-xs">{payment.payment_method}</Badge>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-emerald-600 min-w-[80px] sm:min-w-[100px] text-right">
                        +{formatCurrency(payment.amount)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowDeleteConfirm(payment.id)}
                        className="text-destructive hover:text-destructive h-8 w-8 hover:scale-110 active:scale-95 transition-all hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Payment Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Record Payment" size="lg">
        <PaymentForm onSubmit={handleAddPayment} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Delete Payment" size="sm">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete this payment record? This action cannot be undone.
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => showDeleteConfirm && handleDeletePayment(showDeleteConfirm)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}