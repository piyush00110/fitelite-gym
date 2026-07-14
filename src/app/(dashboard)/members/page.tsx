"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/avatar";
import { Modal } from "@/components/modal";
import { MemberForm } from "@/components/member-form";
import { formatDate } from "@/lib/utils";
import type { Member } from "@/types/database";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const fetchMembers = useCallback(async (search?: string) => {
    try {
      const url = search ? `/api/members?search=${encodeURIComponent(search)}` : "/api/members";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  }, []);

  useEffect(() => {
    fetchMembers().finally(() => setLoading(false));
  }, [fetchMembers]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearching(false);
      fetchMembers();
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      fetchMembers(searchQuery).finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchMembers]);

  const activeCount = members.filter((m) => m.is_active).length;

  const handleAdd = async (data: Omit<Member, "id" | "created_at" | "updated_at">) => {
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const newMember = await res.json();
        setMembers((prev) => [newMember, ...prev]);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Failed to add member:", err);
    }
  };

  const handleEdit = async (data: Omit<Member, "id" | "created_at" | "updated_at">) => {
    if (!editingMember) return;
    try {
      const res = await fetch(`/api/members/${editingMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? updated : m)));
        setEditingMember(null);
      }
    } catch (err) {
      console.error("Failed to edit member:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        setShowDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Failed to delete member:", err);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 bg-luxury min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-down">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30">
              <Users className="h-5 w-5" />
            </div>
            Members
            <Sparkles className="h-5 w-5 text-amber-500 animate-float" />
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base sm:ml-[52px]">
            Manage your gym members and their information.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto animate-fade-in-right">
          <Plus className="h-5 w-5" />
          Add Member
        </Button>
      </div>

      {/* Search */}
      <Card className="animate-fade-in-up animate-delay-100">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-amber-500" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50 backdrop-blur-sm focus:bg-card focus:border-amber-500/50 focus:shadow-md focus:shadow-amber-500/10 transition-all duration-300"
              />
              {(loading || searching) && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500 animate-spin" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card className="animate-fade-in-up animate-delay-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base sm:text-xl">
            <span>All Members ({members.length})</span>
            <Badge variant="secondary">
              {activeCount} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">
              {searchQuery ? "No members match your search." : "No members yet. Add your first member!"}
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/50 p-3 sm:p-4 hover:bg-muted/30 transition-all duration-300 hover:shadow-md hover:border-amber-500/20 gap-3 animate-fade-in-up group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar alt={`${member.first_name} ${member.last_name}`} size="md" />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm sm:text-base group-hover:text-amber-600 transition-colors">
                          {member.first_name} {member.last_name}
                        </p>
                        <Badge variant={member.is_active ? "success" : "secondary"} className="text-xs">
                          {member.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          {member.phone}
                        </span>
                        <span className="hidden md:flex items-center gap-1">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          Joined {formatDate(member.join_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-shrink-0 pl-10 sm:pl-0">
                    <Button variant="ghost" size="icon" onClick={() => setEditingMember(member)} className="hover:scale-110 active:scale-95 transition-transform hover:bg-amber-500/10 hover:text-amber-600">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(member.id)} className="text-destructive hover:text-destructive hover:scale-110 active:scale-95 transition-all hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Member" size="lg">
        <MemberForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingMember} onClose={() => setEditingMember(null)} title="Edit Member" size="lg">
        {editingMember && (
          <MemberForm member={editingMember} onSubmit={handleEdit} onCancel={() => setEditingMember(null)} />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Delete Member" size="sm">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete this member? This action cannot be undone.
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}