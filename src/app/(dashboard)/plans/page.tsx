"use client";

import { useState } from "react";
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

const demoPlans: MembershipPlan[] = [
  {
    id: "1",
    name: "Monthly",
    description:
      "Perfect for getting started. Full access to all gym facilities for 30 days.",
    duration_days: 30,
    price: 49.99,
    is_active: true,
    features: [
      "Full gym access",
      "Locker room access",
      "Basic fitness assessment",
      "2 group classes/week",
    ],
    created_at: "",
  },
  {
    id: "2",
    name: "Quarterly",
    description:
      "Our most popular plan. Save 20% with a 3-month commitment.",
    duration_days: 90,
    price: 119.99,
    is_active: true,
    features: [
      "Everything in Monthly",
      "Unlimited group classes",
      "Sauna & spa access",
      "Monthly body composition",
      "Nutrition consultation",
    ],
    created_at: "",
  },
  {
    id: "3",
    name: "Yearly",
    description:
      "Best value. Premium membership with exclusive benefits.",
    duration_days: 365,
    price: 399.99,
    is_active: true,
    features: [
      "Everything in Quarterly",
      "Personal trainer sessions",
      "VIP lounge access",
      "Priority booking",
      "Guest passes (2/month)",
      "Free parking",
    ],
    created_at: "",
  },
];

const planIcons = [Zap, Star, Crown];
const planColors = [
  "from-amber-500 to-orange-500",
  "from-purple-500 to-pink-500",
  "from-yellow-500 to-amber-600",
];

export default function PlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>(demoPlans);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<MembershipPlan | null>(
    null
  );
  const [assignMemberId, setAssignMemberId] = useState("");

  const handleAdd = (data: Partial<MembershipPlan>) => {
    const newPlan: MembershipPlan = {
      ...data,
      id: String(plans.length + 1),
      created_at: new Date().toISOString(),
    } as MembershipPlan;
    setPlans([...plans, newPlan]);
    setShowAddModal(false);
  };

  const handleEdit = (data: Partial<MembershipPlan>) => {
    if (!editingPlan) return;
    setPlans(
      plans.map((p) => (p.id === editingPlan.id ? { ...p, ...data } : p))
    );
    setEditingPlan(null);
  };

  const handleDelete = (id: string) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <CreditCard className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            Membership Plans
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Create and manage membership tiers for your gym.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
          <Plus className="h-5 w-5" />
          Add Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const Icon = planIcons[i % planIcons.length];
          const isPopular = i === 1;

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden ${
                isPopular ? "border-primary shadow-lg scale-[1.02]" : ""
              }`}
            >
              {isPopular && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">
                    Popular
                  </Badge>
                </div>
              )}

              {/* Gradient Header */}
              <div
                className={`bg-gradient-to-br ${planColors[i % planColors.length]} p-4 sm:p-6 text-white`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-white/80 text-sm mt-1">
                  {plan.duration_days} days
                </p>
              </div>

              <CardContent className="p-4 sm:p-6">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-muted-foreground">
                    /{plan.duration_days} days
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => setShowAssignModal(plan)}
                  >
                    <Users className="h-4 w-4" />
                    Assign
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPlan(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(plan.id)}
                    className="text-danger hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Plan"
        size="lg"
      >
        <PlanForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        title="Edit Plan"
        size="lg"
      >
        {editingPlan && (
          <PlanForm
            plan={editingPlan}
            onSubmit={handleEdit}
            onCancel={() => setEditingPlan(null)}
          />
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={!!showAssignModal}
        onClose={() => setShowAssignModal(null)}
        title={`Assign ${showAssignModal?.name} Plan`}
        size="sm"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="memberId">Member ID</Label>
            <Input
              id="memberId"
              placeholder="Enter member ID"
              value={assignMemberId}
              onChange={(e) => setAssignMemberId(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAssignModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert(`Plan assigned to member ${assignMemberId}!`);
                setShowAssignModal(null);
                setAssignMemberId("");
              }}
            >
              Assign Plan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PlanForm({
  plan,
  onSubmit,
  onCancel,
}: {
  plan?: MembershipPlan;
  onSubmit: (data: Partial<MembershipPlan>) => void;
  onCancel: () => void;
}) {
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
    onSubmit({
      ...formData,
      features: formData.features.split("\n").filter((f) => f.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Premium Monthly"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the plan benefits..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (days) *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration_days}
            onChange={(e) =>
              setFormData({ ...formData, duration_days: Number(e.target.value) })
            }
            min={1}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
            min={0}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={(e) =>
            setFormData({ ...formData, features: e.target.value })
          }
          placeholder="Full gym access&#10;Locker room&#10;Group classes"
          rows={4}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) =>
            setFormData({ ...formData, is_active: e.target.checked })
          }
          className="h-4 w-4 rounded border-border"
        />
        <Label htmlFor="is_active">Active Plan</Label>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="success">
          {plan ? "Update Plan" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}
