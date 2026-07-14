"use client";

import { useState } from "react";
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

const demoMembers: Member[] = [
  { id: "1", first_name: "Marcus", last_name: "Johnson", email: "marcus.j@email.com", phone: "+1 (555) 123-4567", date_of_birth: "1990-05-15", join_date: "2024-01-15", is_active: true, avatar_url: null, created_at: "", updated_at: "" },
  { id: "2", first_name: "Sarah", last_name: "Williams", email: "sarah.w@email.com", phone: "+1 (555) 234-5678", date_of_birth: "1988-08-22", join_date: "2024-02-20", is_active: true, avatar_url: null, created_at: "", updated_at: "" },
  { id: "3", first_name: "David", last_name: "Chen", email: "david.c@email.com", phone: "+1 (555) 345-6789", date_of_birth: "1995-03-10", join_date: "2024-03-05", is_active: true, avatar_url: null, created_at: "", updated_at: "" },
  { id: "4", first_name: "Emma", last_name: "Rodriguez", email: "emma.r@email.com", phone: "+1 (555) 456-7890", date_of_birth: "1992-11-28", join_date: "2024-04-12", is_active: false, avatar_url: null, created_at: "", updated_at: "" },
  { id: "5", first_name: "James", last_name: "Wilson", email: "james.w@email.com", phone: "+1 (555) 567-8901", date_of_birth: "1987-07-04", join_date: "2024-05-01", is_active: true, avatar_url: null, created_at: "", updated_at: "" },
  { id: "6", first_name: "Olivia", last_name: "Martinez", email: "olivia.m@email.com", phone: "+1 (555) 678-9012", date_of_birth: "1993-09-18", join_date: "2024-06-15", is_active: true, avatar_url: null, created_at: "", updated_at: "" },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(demoMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredMembers = members.filter(
    (m) =>
      m.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery)
  );

  const handleAdd = (data: Omit<Member, "id" | "created_at" | "updated_at">) => {
    const newMember: Member = { ...data, id: String(Date.now()), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setMembers([newMember, ...members]);
    setShowAddModal(false);
  };

  const handleEdit = (data: Omit<Member, "id" | "created_at" | "updated_at">) => {
    if (!editingMember) return;
    setMembers(members.map((m) => m.id === editingMember.id ? { ...m, ...data, updated_at: new Date().toISOString() } : m));
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    setShowDeleteConfirm(null);
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

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="hidden sm:flex">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="hidden sm:flex">
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base sm:text-xl">
            <span>All Members ({filteredMembers.length})</span>
            <Badge variant="secondary">
              {members.filter((m) => m.is_active).length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
