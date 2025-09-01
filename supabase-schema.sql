-- Supabase Database Schema for Vena Dashboard
-- This file contains all table definitions and initial setup

BEGIN;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    website TEXT,
    address TEXT,
    bank_account TEXT,
    authorized_signer TEXT,
    id_number TEXT,
    bio TEXT,
    income_categories JSONB DEFAULT '[]',
    expense_categories JSONB DEFAULT '[]',
    project_types JSONB DEFAULT '[]',
    event_types JSONB DEFAULT '[]',
    asset_categories JSONB DEFAULT '[]',
    sop_categories JSONB DEFAULT '[]',
    package_categories JSONB DEFAULT '[]',
    project_status_config JSONB DEFAULT '[]',
    notification_settings JSONB DEFAULT '{"newProject": true, "paymentConfirmation": true, "deadlineReminder": true}',
    security_settings JSONB DEFAULT '{"twoFactorEnabled": false}',
    briefing_template TEXT,
    terms_and_conditions TEXT,
    contract_template TEXT,
    logo_base64 TEXT,
    brand_color TEXT DEFAULT '#3b82f6',
    public_page_config JSONB DEFAULT '{"template": "modern", "title": "", "introduction": "", "galleryImages": []}',
    package_share_template TEXT,
    booking_form_template TEXT,
    chat_templates JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    instagram TEXT,
    status TEXT NOT NULL DEFAULT 'Aktif',
    client_type TEXT NOT NULL DEFAULT 'Langsung',
    last_contact TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    portal_access_id TEXT UNIQUE DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    category TEXT NOT NULL,
    physical_items JSONB DEFAULT '[]',
    digital_items JSONB DEFAULT '[]',
    processing_time TEXT,
    default_printing_cost DECIMAL(15,2),
    default_transport_cost DECIMAL(15,2),
    photographers TEXT,
    videographers TEXT,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add-ons table
CREATE TABLE IF NOT EXISTS add_ons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    standard_fee DECIMAL(15,2) NOT NULL DEFAULT 0,
    no_rek TEXT,
    reward_balance DECIMAL(15,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 5.0,
    performance_notes JSONB DEFAULT '[]',
    portal_access_id TEXT UNIQUE DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    project_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    project_type TEXT NOT NULL,
    package_name TEXT NOT NULL,
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
    add_ons JSONB DEFAULT '[]',
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    deadline_date TIMESTAMP WITH TIME ZONE,
    location TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Baru',
    active_sub_statuses JSONB DEFAULT '[]',
    total_cost DECIMAL(15,2) NOT NULL,
    amount_paid DECIMAL(15,2) DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'Belum Bayar',
    team JSONB DEFAULT '[]',
    notes TEXT,
    accommodation TEXT,
    drive_link TEXT,
    client_drive_link TEXT,
    final_drive_link TEXT,
    start_time TEXT,
    end_time TEXT,
    image TEXT,
    revisions JSONB DEFAULT '[]',
    promo_code_id UUID,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    shipping_details TEXT,
    dp_proof_url TEXT,
    printing_details JSONB DEFAULT '[]',
    printing_cost DECIMAL(15,2) DEFAULT 0,
    transport_cost DECIMAL(15,2) DEFAULT 0,
    is_editing_confirmed_by_client BOOLEAN DEFAULT FALSE,
    is_printing_confirmed_by_client BOOLEAN DEFAULT FALSE,
    is_delivery_confirmed_by_client BOOLEAN DEFAULT FALSE,
    confirmed_sub_statuses JSONB DEFAULT '[]',
    client_sub_status_notes JSONB DEFAULT '{}',
    sub_status_confirmation_sent_at JSONB DEFAULT '{}',
    completed_digital_items JSONB DEFAULT '[]',
    invoice_signature TEXT,
    custom_sub_statuses JSONB DEFAULT '[]',
    booking_status TEXT,
    rejection_reason TEXT,
    chat_history JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    contact_channel TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Sedang Diskusi',
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    whatsapp TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    card_holder_name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    card_type TEXT NOT NULL,
    last_four_digits TEXT NOT NULL,
    expiry_date TEXT,
    balance DECIMAL(15,2) DEFAULT 0,
    color_gradient TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Pockets table
CREATE TABLE IF NOT EXISTS financial_pockets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    type TEXT NOT NULL,
    amount DECIMAL(15,2) DEFAULT 0,
    goal_amount DECIMAL(15,2),
    lock_end_date TIMESTAMP WITH TIME ZONE,
    members JSONB DEFAULT '[]',
    source_card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type TEXT NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    method TEXT NOT NULL,
    pocket_id UUID REFERENCES financial_pockets(id) ON DELETE SET NULL,
    card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
    printing_item_id TEXT,
    vendor_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    purchase_price DECIMAL(15,2) NOT NULL,
    serial_number TEXT,
    status TEXT NOT NULL DEFAULT 'Tersedia',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    contract_number TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    signing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    signing_location TEXT NOT NULL,
    client_name1 TEXT NOT NULL,
    client_address1 TEXT NOT NULL,
    client_phone1 TEXT NOT NULL,
    client_name2 TEXT,
    client_address2 TEXT,
    client_phone2 TEXT,
    shooting_duration TEXT NOT NULL,
    guaranteed_photos TEXT NOT NULL,
    album_details TEXT NOT NULL,
    digital_files_format TEXT NOT NULL,
    other_items TEXT NOT NULL,
    personnel_count TEXT NOT NULL,
    delivery_timeframe TEXT NOT NULL,
    dp_date TIMESTAMP WITH TIME ZONE NOT NULL,
    final_payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    cancellation_policy TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    vendor_signature TEXT,
    client_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo Codes table
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL,
    discount_value DECIMAL(15,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    max_usage INTEGER,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SOPs table
CREATE TABLE IF NOT EXISTS sops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client Feedback table
CREATE TABLE IF NOT EXISTS client_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    satisfaction TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Project Payments table
CREATE TABLE IF NOT EXISTS team_project_payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    team_member_name TEXT NOT NULL,
    team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'Unpaid',
    fee DECIMAL(15,2) NOT NULL,
    reward DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Posts table
CREATE TABLE IF NOT EXISTS social_media_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    post_type TEXT NOT NULL,
    platform TEXT NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    caption TEXT NOT NULL,
    media_url TEXT,
    status TEXT NOT NULL DEFAULT 'Draf',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    icon TEXT NOT NULL,
    link JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_pockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_project_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users to access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own clients" ON clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own packages" ON packages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own add_ons" ON add_ons FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own team_members" ON team_members FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own leads" ON leads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cards" ON cards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own financial_pockets" ON financial_pockets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own assets" ON assets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own contracts" ON contracts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own promo_codes" ON promo_codes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sops" ON sops FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own client_feedback" ON client_feedback FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own team_project_payments" ON team_project_payments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own social_media_posts" ON social_media_posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

COMMIT;