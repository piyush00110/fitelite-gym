-- Gym Management System - Supabase Migration
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) DEFAULT '',
  phone VARCHAR(20) DEFAULT '',
  date_of_birth DATE,
  join_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membership Plans table
CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT '',
  duration_days INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Member Memberships table
CREATE TABLE IF NOT EXISTS member_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES membership_plans(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check-ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ DEFAULT NOW(),
  check_out_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  payment_method VARCHAR(50) DEFAULT 'Cash',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_name ON members(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
CREATE INDEX IF NOT EXISTS idx_members_active ON members(is_active);

CREATE INDEX IF NOT EXISTS idx_member_memberships_member ON member_memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_member_memberships_plan ON member_memberships(plan_id);
CREATE INDEX IF NOT EXISTS idx_member_memberships_active ON member_memberships(is_active, end_date);

CREATE INDEX IF NOT EXISTS idx_check_ins_member ON check_ins(member_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_time ON check_ins(check_in_time);

CREATE INDEX IF NOT EXISTS idx_payments_member ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

-- Seed data: Membership Plans
INSERT INTO membership_plans (name, description, duration_days, price, features) VALUES
  ('Monthly', 'Perfect for getting started. Full access to all gym facilities for 30 days.', 30, 49.99, ARRAY['Full gym access', 'Locker room access', 'Basic fitness assessment', '2 group classes/week']),
  ('Quarterly', 'Our most popular plan. Save 20% with a 3-month commitment.', 90, 119.99, ARRAY['Everything in Monthly', 'Unlimited group classes', 'Sauna & spa access', 'Monthly body composition', 'Nutrition consultation']),
  ('Yearly', 'Best value. Premium membership with exclusive benefits.', 365, 399.99, ARRAY['Everything in Quarterly', 'Personal trainer sessions', 'VIP lounge access', 'Priority booking', 'Guest passes (2/month)', 'Free parking'])
ON CONFLICT DO NOTHING;

-- Seed data: Demo Members
INSERT INTO members (first_name, last_name, email, phone, date_of_birth, join_date, is_active) VALUES
  ('Marcus', 'Johnson', 'marcus.j@email.com', '+1 (555) 123-4567', '1990-05-15', '2024-01-15', true),
  ('Sarah', 'Williams', 'sarah.w@email.com', '+1 (555) 234-5678', '1988-08-22', '2024-02-20', true),
  ('David', 'Chen', 'david.c@email.com', '+1 (555) 345-6789', '1995-03-10', '2024-03-05', true),
  ('Emma', 'Rodriguez', 'emma.r@email.com', '+1 (555) 456-7890', '1992-11-28', '2024-04-12', false),
  ('James', 'Wilson', 'james.w@email.com', '+1 (555) 567-8901', '1987-07-04', '2024-05-01', true),
  ('Olivia', 'Martinez', 'olivia.m@email.com', '+1 (555) 678-9012', '1993-09-18', '2024-06-15', true),
  ('Alex', 'Thompson', 'alex.t@email.com', '+1 (555) 789-0123', '1991-02-14', '2024-07-01', true),
  ('Lisa', 'Anderson', 'lisa.a@email.com', '+1 (555) 890-1234', '1989-06-30', '2024-08-10', true),
  ('Michael', 'Brown', 'michael.b@email.com', '+1 (555) 901-2345', '1994-12-05', '2024-09-15', true),
  ('Jennifer', 'Davis', 'jennifer.d@email.com', '+1 (555) 012-3456', '1986-04-20', '2024-10-01', true)
ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) - Enable for production
-- ALTER TABLE members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE member_memberships ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies (uncomment for production with auth)
-- CREATE POLICY "Allow authenticated read" ON members FOR SELECT USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated insert" ON members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated update" ON members FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Allow authenticated delete" ON members FOR DELETE USING (auth.role() = 'authenticated');
