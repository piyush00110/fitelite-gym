"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { Member } from "@/types/database";

interface PaymentFormProps {
  onSubmit: (data: {
    member_id: string;
    amount: number;
    payment_method: string;
    notes: string;
  }) => void;
  onCancel: () => void;
}

export function PaymentForm({ onSubmit, onCancel }: PaymentFormProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [formData, setFormData] = useState({
    member_id: "",
    amount: "",
    payment_method: "Cash",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch(console.error)
      .finally(() => setLoadingMembers(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.member_id || !formData.amount) return;
    onSubmit({
      member_id: formData.member_id,
      amount: Number(formData.amount),
      payment_method: formData.payment_method,
      notes: formData.notes,
    });
  };

  const inputClass = "bg-muted/50 border-border/50 backdrop-blur-sm focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <Label htmlFor="member">Member *</Label>
        <Select
          value={formData.member_id}
          onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
          disabled={loadingMembers}
          className={inputClass}
        >
          <option value="">{loadingMembers ? "Loading members..." : "Select a member"}</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($) *</Label>
          <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" min={0} required className={inputClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="method">Payment Method</Label>
          <Select value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} className={inputClass}>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Mobile Pay">Mobile Pay</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Monthly membership, Quarterly renewal, etc." rows={3} className={inputClass} />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-border/50">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="success">Record Payment</Button>
      </div>
    </form>
  );
}