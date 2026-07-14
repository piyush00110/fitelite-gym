export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  join_date: string;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  price: number;
  is_active: boolean;
  features: string[];
  created_at: string;
}

export interface MemberMembership {
  id: string;
  member_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  member?: Member;
  plan?: MembershipPlan;
}

export interface CheckIn {
  id: string;
  member_id: string;
  check_in_time: string;
  check_out_time: string | null;
  created_at: string;
  member?: Member;
}

export interface Payment {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes: string;
  created_at: string;
  member?: Member;
}

export interface Database {
  public: {
    Tables: {
      members: {
        Row: Member;
        Insert: Omit<Member, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Member, "id" | "created_at" | "updated_at">>;
      };
      membership_plans: {
        Row: MembershipPlan;
        Insert: Omit<MembershipPlan, "id" | "created_at">;
        Update: Partial<Omit<MembershipPlan, "id" | "created_at">>;
      };
      member_memberships: {
        Row: MemberMembership;
        Insert: Omit<MemberMembership, "id" | "created_at">;
        Update: Partial<Omit<MemberMembership, "id" | "created_at">>;
      };
      check_ins: {
        Row: CheckIn;
        Insert: Omit<CheckIn, "id" | "created_at">;
        Update: Partial<Omit<CheckIn, "id" | "created_at">>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, "id" | "created_at">;
        Update: Partial<Omit<Payment, "id" | "created_at">>;
      };
    };
  };
}
