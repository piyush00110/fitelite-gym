"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  Star,
  Zap,
  Crown,
  Users,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/modal";
import { formatCurrency } from "@/lib/utils";
import type { MembershipPlan } from "@/types/database";

const planIcons = [Zap, Star, Crown];
const planGradients = [
  "from-amber-500 to-orange-500",
  "from-purple-500 to-pink-500",
  "from-yellow-500 to-amber-600",
];

export default function PlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<MembershipPlan | null>(null);
  const [assignMemberId, setAssignMemberId] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch("/api/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    }
  }, []);

  useEffect(() => {
    fetchPlans().finally(() => setLoading(false));
  }, [fetchPlans]);

  const handleAdd = async (data: Partial<MembershipPlan>) => {
    try {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchPlans();
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Failed to add plan:", err);
    }
  };

  const handleEdit = async (data: Partial<MembershipPlan>) => {
    if (!editingPlan) return;
    try {
      const res = await fetch(`/api/plans/${editingPlan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchPlans();
        setEditingPlan(null);
      }
    } catch (err) {
      console.error("Failed to edit plan:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPlans((prev) => prev.filter((p) => p.id !== id));
        setShowDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Failed to delete plan:", err);
    }
  };

  const handleAssign = async () => {
    if (!showAssignModal || !assignMemberId.trim()) return;
    try {
      const startDate = new Date().toISOString().split("T")[0];
      const endDate = new Date(Date.now() + showAssignModal.duration_days * 86400000).toISOString().split("T")[0];
      const res = await fetch("/api/plans/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: assignMemberId,
          plan_id: showAssignModal.id,
          start_date: startDate,
          end_date: endDate,
        }),
      });
      if (res.ok) {
        alert(`Plan assigned successfully!`);
        setShowAssignModal(null);
        setAssignMemberId("");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to assign plan");
      }
    } catch {
      alert("Network error");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 bg-luxury min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-down">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
              <CreditCard className="h-5 w-5" />
            </div>
            Membership Plans
            <Sparkles className="h-5 w-5 text-amber-500 animate-float" />
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base ml-[52px]">
            Create and manage membership tiers for your gym.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto animate-fade-in-right">
          <Plus className="h-5 w-5" />
          Add Plan
        </Button>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : plans.length === 0 ? (
        <Card className="animate-fade-in">
          <CardContent className="p-12 text-center text-muted-foreground">No plans yet. Create your first plan!</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = planIcons[i % planIcons.length];
            const gradient = planGradients[i % planGradients.length];
            const isPopular = i === 1;

            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden animate-fade-in-up hover-lift group ${isPopular ? "border-amber-500/50 luxury-shadow-glow" : ""}`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {isPopular && (
                  <div className="absolute top-4 right-4 z-10 animate-pop-in animate-delay-300">
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
                      <Sparkles className="h-3 w-3 mr-1" /> Popular
                    </Badge>
                  </div>
                )}

                <div className={`bg-gradient-to-br ${gradient} p-4 sm:p-6 text-white relative overflow-hidden`}>
                  <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10" />
                  <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mb-4 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{plan.duration_days} days</p>
                </div>

                <CardContent className="p-4 sm:p-6 relative">
                  <div className="mb-6">
                    <span className="text-4xl font-bold gradient-text-gold">{formatCurrency(plan.price)}</span>
                    <span className="text-muted-foreground text-sm">/{plan.duration_days} days</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  <div className="space-y-3 mb-6">
                    {(plan.features || []).map((feature, fi) => (
                      <div key={fi} className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" variant={isPopular ? "default" : "outline"} onClick={() => setShowAssignModal(plan)}>
                      <Users className="h-4 w-4" /> Assign
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditingPlan(plan)} className="hover:scale-110 active:scale-95 transition-transform hover:bg-amber-500/10 hover:text-amber-600">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(plan.id)} className="text-destructive hover:text-destructive hover:scale-110 active:scale-95 transition-all hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Plan" size="lg">
        <PlanForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingPlan} onClose={() => setEditingPlan(null)} title="Edit Plan" size="lg">
        {editingPlan && <PlanForm plan={editingPlan} onSubmit={handleEdit} onCancel={() => setEditingPlan(null)} />}
      </Modal>

      {/* Assign Modal */}
      <Modal isOpen={!!showAssignModal} onClose={() => { setShowAssignModal(null); setAssignMemberId(""); }} title={`Assign ${showAssignModal?.name} Plan`} size="sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignMemberId">Member ID</Label>
            <Input id="assignMemberId" placeholder="Enter member ID" value={assignMemberId} onChange={(e) => setAssignMemberId(e.target.value)} className="bg-muted/50 border-border/50 focus:bg-card focus:border-amber-500/50 transition-all duration-300" />
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button variant="outline" onClick={() => { setShowAssignModal(null); setAssignMemberId(""); }}>Cancel</Button>
            <Button onClick={handleAssign}>Assign Plan</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Delete Plan" size="sm">
        <div className="space-y-4">
          <p className="text-muted-foreground">Are you sure you want to delete this plan? This action cannot be undone.</p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PlanForm({ plan, onSubmit, onCancel }: { plan?: MembershipPlan; onSubmit: (data: Partial<MembershipPlan>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    description: plan?.description || "",
    duration_days: plan?.duration_days || 30,
    price: plan?.price || 0,
    is_active: plan?.is_active ?? true,
    features: plan?.features?.join("\n") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, features: formData.features.split("\n").filter((f) => f.trim()) });
  };

  const inputClass = "bg-muted/50 border-border/50 backdrop-blur-sm focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name *</Label>
        <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Premium Monthly" required className={inputClass} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the plan benefits..." className={inputClass} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (days) *</Label>
          <Input id="duration" type="number" value={formData.duration_days} onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })} min={1} required className={inputClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} min={0} required className={inputClass} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea id="features" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="Full gym access&#10;Locker room&#10;Group classes" rows={4} className={inputClass} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="h-4 w-4 rounded border-border accent-amber-500" />
        <Label htmlFor="is_active">Active Plan</Label>
      </div>
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-border/50">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="success">{plan ? "Update Plan" : "Create Plan"}</Button>
      </div>
    </form>
  );
}