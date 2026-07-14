"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
  Mail,
  Phone,
  Calendar,
  ArrowUpDown,
  Loader2,
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

  const filteredMembers = searchQuery ? members : members;

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            Members
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage your gym members and their information.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
          <Plus className="h-5 w-5" />
          Add Member
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {(loading || searching) && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base sm:text-xl">
            <span>All Members ({filteredMembers.length})</span>
            <Badge variant="secondary">
              {activeCount} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? "No members match your search." : "No members yet. Add your first member!"}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border p-3 sm:p-4 hover:bg-muted/50 transition-all gap-3"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar alt={`${member.first_name} ${member.last_name}`} size="md" />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm sm:text-base">
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
                    <Button variant="ghost" size="icon" onClick={() => setEditingMember(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(member.id)} className="text-danger hover:text-danger">
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