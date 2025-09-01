-- Mock Data for Vena Dashboard
-- This file contains sample data for testing the application

BEGIN;

-- Insert mock profile data (assuming user ID exists)
-- Note: Replace 'your-user-id-here' with actual authenticated user ID
INSERT INTO profiles (
    id, full_name, email, phone, company_name, website, address, 
    bank_account, authorized_signer, bio
) VALUES (
    'your-user-id-here'::uuid,
    'Vena Pictures Studio',
    'admin@venapictures.com',
    '+6281234567890',
    'Vena Pictures',
    'https://venapictures.com',
    'Jl. Fotografi No. 123, Jakarta',
    'BCA 1234567890',
    'John Doe',
    'Studio fotografi profesional dengan pengalaman lebih dari 5 tahun'
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    company_name = EXCLUDED.company_name,
    website = EXCLUDED.website,
    address = EXCLUDED.address,
    bank_account = EXCLUDED.bank_account,
    authorized_signer = EXCLUDED.authorized_signer,
    bio = EXCLUDED.bio;

-- Insert mock clients
INSERT INTO clients (user_id, name, email, phone, whatsapp, status, client_type, last_contact) VALUES
('your-user-id-here'::uuid, 'Sarah Johnson', 'sarah@email.com', '+6281111111111', '+6281111111111', 'Aktif', 'Langsung', NOW()),
('your-user-id-here'::uuid, 'Michael Chen', 'michael@email.com', '+6281222222222', '+6281222222222', 'Aktif', 'Langsung', NOW()),
('your-user-id-here'::uuid, 'Lisa Anderson', 'lisa@email.com', '+6281333333333', '+6281333333333', 'Aktif', 'Vendor', NOW()),
('your-user-id-here'::uuid, 'David Wilson', 'david@email.com', '+6281444444444', '+6281444444444', 'Aktif', 'Langsung', NOW()),
('your-user-id-here'::uuid, 'Emma Davis', 'emma@email.com', '+6281555555555', '+6281555555555', 'Prospek', 'Langsung', NOW());

-- Insert mock packages
INSERT INTO packages (user_id, name, price, category, physical_items, digital_items, processing_time) VALUES
('your-user-id-here'::uuid, 'Wedding Premium', 15000000, 'Wedding', '[{"name": "Album 20x30", "price": 500000}, {"name": "Flashdisk Custom", "price": 200000}]', '["300+ Edited Photos", "Highlight Video", "Raw Files"]', '14 hari'),
('your-user-id-here'::uuid, 'Prewedding Outdoor', 8000000, 'Prewedding', '[{"name": "Album 15x20", "price": 300000}]', '["150+ Edited Photos", "Behind The Scene"]', '7 hari'),
('your-user-id-here'::uuid, 'Corporate Event', 5000000, 'Corporate', '[]', '["100+ Edited Photos", "Event Documentation"]', '5 hari'),
('your-user-id-here'::uuid, 'Birthday Party', 3000000, 'Birthday', '[{"name": "Printed Photos", "price": 150000}]', '["50+ Edited Photos", "Mini Video"]', '3 hari');

-- Insert mock team members
INSERT INTO team_members (user_id, name, role, email, phone, standard_fee, rating) VALUES
('your-user-id-here'::uuid, 'Alex Photographer', 'Fotografer', 'alex@venapictures.com', '+6281666666666', 1500000, 4.8),
('your-user-id-here'::uuid, 'Maya Videographer', 'Videografer', 'maya@venapictures.com', '+6281777777777', 2000000, 4.9),
('your-user-id-here'::uuid, 'Ryan Editor', 'Editor', 'ryan@venapictures.com', '+6281888888888', 800000, 4.7),
('your-user-id-here'::uuid, 'Sari Assistant', 'Asisten', 'sari@venapictures.com', '+6281999999999', 500000, 4.6);

-- Insert mock leads
INSERT INTO leads (user_id, name, contact_channel, location, status, notes, whatsapp) VALUES
('your-user-id-here'::uuid, 'Jessica Brown', 'WhatsApp', 'Jakarta', 'Sedang Diskusi', 'Tertarik paket wedding premium', '+6281123456789'),
('your-user-id-here'::uuid, 'Robert Taylor', 'Instagram', 'Bandung', 'Menunggu Follow Up', 'Ingin prewedding outdoor', '+6281234567890'),
('your-user-id-here'::uuid, 'Amanda White', 'Website', 'Surabaya', 'Dikonversi', 'Sudah booking birthday party', '+6281345678901'),
('your-user-id-here'::uuid, 'Kevin Martinez', 'Referensi', 'Yogyakarta', 'Ditolak', 'Budget tidak sesuai', '+6281456789012');

-- Insert mock cards
INSERT INTO cards (user_id, card_holder_name, bank_name, card_type, last_four_digits, balance, color_gradient) VALUES
('your-user-id-here'::uuid, 'Vena Pictures', 'BCA', 'Debit', '1234', 25000000, 'from-blue-500 to-blue-600'),
('your-user-id-here'::uuid, 'John Doe', 'Mandiri', 'Kredit', '5678', 15000000, 'from-green-500 to-green-600'),
('your-user-id-here'::uuid, 'Cash', 'Tunai', 'Tunai', '0000', 5000000, 'from-gray-500 to-gray-600');

-- Insert mock financial pockets
INSERT INTO financial_pockets (user_id, name, description, icon, type, amount) VALUES
('your-user-id-here'::uuid, 'Emergency Fund', 'Dana darurat untuk kebutuhan mendesak', 'piggy-bank', 'Nabung & Bayar', 10000000),
('your-user-id-here'::uuid, 'Equipment Fund', 'Dana untuk pembelian peralatan baru', 'lock', 'Terkunci', 20000000),
('your-user-id-here'::uuid, 'Team Rewards', 'Pool hadiah untuk tim freelancer', 'star', 'Tabungan Hadiah Freelancer', 5000000);

-- Get client and package IDs for projects
-- Insert mock projects
INSERT INTO projects (
    user_id, project_name, client_name, client_id, project_type, package_name, 
    package_id, date, location, total_cost, amount_paid, payment_status, status
) 
SELECT 
    'your-user-id-here'::uuid,
    'Wedding Sarah & Tom',
    'Sarah Johnson',
    c.id,
    'Wedding',
    'Wedding Premium',
    p.id,
    '2024-03-15'::timestamp,
    'Ballroom Hotel Grand',
    15000000,
    7500000,
    'DP Terbayar',
    'Dalam Proses'
FROM clients c, packages p 
WHERE c.name = 'Sarah Johnson' AND p.name = 'Wedding Premium' AND c.user_id = 'your-user-id-here'::uuid
LIMIT 1;

INSERT INTO projects (
    user_id, project_name, client_name, client_id, project_type, package_name, 
    package_id, date, location, total_cost, amount_paid, payment_status, status
) 
SELECT 
    'your-user-id-here'::uuid,
    'Prewedding Michael & Lisa',
    'Michael Chen',
    c.id,
    'Prewedding',
    'Prewedding Outdoor',
    p.id,
    '2024-02-20'::timestamp,
    'Pantai Anyer',
    8000000,
    8000000,
    'Lunas',
    'Selesai'
FROM clients c, packages p 
WHERE c.name = 'Michael Chen' AND p.name = 'Prewedding Outdoor' AND c.user_id = 'your-user-id-here'::uuid
LIMIT 1;

INSERT INTO projects (
    user_id, project_name, client_name, client_id, project_type, package_name, 
    package_id, date, location, total_cost, amount_paid, payment_status, status
) 
SELECT 
    'your-user-id-here'::uuid,
    'Corporate Event PT ABC',
    'Lisa Anderson',
    c.id,
    'Corporate',
    'Corporate Event',
    p.id,
    '2024-04-10'::timestamp,
    'Convention Center',
    5000000,
    2500000,
    'DP Terbayar',
    'Terjadwal'
FROM clients c, packages p 
WHERE c.name = 'Lisa Anderson' AND p.name = 'Corporate Event' AND c.user_id = 'your-user-id-here'::uuid
LIMIT 1;

-- Insert mock transactions
INSERT INTO transactions (user_id, date, description, amount, type, category, method) VALUES
('your-user-id-here'::uuid, '2024-01-15', 'Pembayaran DP Wedding Sarah', 7500000, 'Pemasukan', 'Project Payment', 'Transfer Bank'),
('your-user-id-here'::uuid, '2024-01-20', 'Pembelian Lensa Baru', 5000000, 'Pengeluaran', 'Equipment', 'Transfer Bank'),
('your-user-id-here'::uuid, '2024-02-01', 'Pelunasan Prewedding Michael', 4000000, 'Pemasukan', 'Project Payment', 'Transfer Bank'),
('your-user-id-here'::uuid, '2024-02-05', 'Biaya Transport Tim', 500000, 'Pengeluaran', 'Transportation', 'Tunai'),
('your-user-id-here'::uuid, '2024-02-10', 'Pembayaran DP Corporate Event', 2500000, 'Pemasukan', 'Project Payment', 'Transfer Bank');

-- Insert mock assets
INSERT INTO assets (user_id, name, category, purchase_date, purchase_price, status) VALUES
('your-user-id-here'::uuid, 'Canon EOS R5', 'Camera', '2023-06-01', 45000000, 'Tersedia'),
('your-user-id-here'::uuid, 'Sony A7 III', 'Camera', '2023-03-15', 25000000, 'Digunakan'),
('your-user-id-here'::uuid, 'Canon 24-70mm f/2.8', 'Lens', '2023-06-01', 15000000, 'Tersedia'),
('your-user-id-here'::uuid, 'Godox AD600Pro', 'Lighting', '2023-08-20', 8000000, 'Tersedia'),
('your-user-id-here'::uuid, 'DJI Ronin-S', 'Stabilizer', '2023-09-10', 12000000, 'Perbaikan');

-- Insert mock promo codes
INSERT INTO promo_codes (user_id, code, discount_type, discount_value, is_active, usage_count, max_usage) VALUES
('your-user-id-here'::uuid, 'WEDDING2024', 'percentage', 10, true, 3, 50),
('your-user-id-here'::uuid, 'NEWCLIENT', 'fixed', 500000, true, 12, 100),
('your-user-id-here'::uuid, 'EARLYBIRD', 'percentage', 15, true, 8, 30);

-- Insert mock SOPs
INSERT INTO sops (user_id, title, category, content) VALUES
('your-user-id-here'::uuid, 'Persiapan Shooting Wedding', 'Wedding', '# Persiapan Shooting Wedding

## Sebelum Hari H
1. Konfirmasi lokasi dan waktu dengan klien
2. Cek semua peralatan kamera dan lighting
3. Briefing dengan tim fotografer dan videografer
4. Persiapan backup equipment

## Hari H
1. Datang 30 menit sebelum acara
2. Setup peralatan
3. Koordinasi dengan wedding organizer
4. Mulai dokumentasi'),
('your-user-id-here'::uuid, 'Editing Workflow', 'Post-Production', '# Workflow Editing

## Tahap 1: Import dan Seleksi
1. Import semua file RAW
2. Seleksi foto terbaik
3. Kategorisasi berdasarkan momen

## Tahap 2: Editing
1. Color correction
2. Exposure adjustment
3. Detail enhancement
4. Final touch-up'),
('your-user-id-here'::uuid, 'Client Communication', 'General', '# Komunikasi dengan Klien

## Respon Time
- WhatsApp: Maksimal 2 jam
- Email: Maksimal 24 jam
- Telepon: Segera angkat atau callback

## Tone Komunikasi
- Profesional namun ramah
- Jelas dan informatif
- Proaktif memberikan update');

-- Insert mock client feedback
INSERT INTO client_feedback (user_id, client_name, satisfaction, rating, feedback, date) VALUES
('your-user-id-here'::uuid, 'Sarah Johnson', 'Sangat Puas', 5, 'Hasil foto wedding sangat memuaskan! Tim sangat profesional dan hasilnya melebihi ekspektasi.', '2024-01-20'),
('your-user-id-here'::uuid, 'Michael Chen', 'Puas', 4, 'Prewedding photos turned out great. Good communication throughout the process.', '2024-02-25'),
('your-user-id-here'::uuid, 'Lisa Anderson', 'Sangat Puas', 5, 'Dokumentasi corporate event sangat lengkap dan berkualitas tinggi.', '2024-01-15');

-- Insert mock team project payments
INSERT INTO team_project_payments (user_id, project_id, team_member_name, team_member_id, date, status, fee, reward)
SELECT 
    'your-user-id-here'::uuid,
    p.id,
    'Alex Photographer',
    t.id,
    '2024-01-16',
    'Paid',
    1500000,
    200000
FROM projects p, team_members t 
WHERE p.project_name = 'Wedding Sarah & Tom' AND t.name = 'Alex Photographer' AND p.user_id = 'your-user-id-here'::uuid
LIMIT 1;

INSERT INTO team_project_payments (user_id, project_id, team_member_name, team_member_id, date, status, fee, reward)
SELECT 
    'your-user-id-here'::uuid,
    p.id,
    'Maya Videographer',
    t.id,
    '2024-01-16',
    'Unpaid',
    2000000,
    300000
FROM projects p, team_members t 
WHERE p.project_name = 'Wedding Sarah & Tom' AND t.name = 'Maya Videographer' AND p.user_id = 'your-user-id-here'::uuid
LIMIT 1;

-- Insert mock contracts
INSERT INTO contracts (
    user_id, contract_number, client_id, project_id, signing_date, signing_location,
    client_name1, client_address1, client_phone1, shooting_duration, guaranteed_photos,
    album_details, digital_files_format, other_items, personnel_count, delivery_timeframe,
    dp_date, final_payment_date, cancellation_policy, jurisdiction
)
SELECT 
    'your-user-id-here'::uuid,
    'VP-2024-001',
    c.id,
    p.id,
    '2024-01-10',
    'Jakarta',
    'Sarah Johnson',
    'Jl. Sudirman No. 123, Jakarta',
    '+6281111111111',
    '8 jam (08:00 - 16:00)',
    'Minimum 300 foto edited',
    'Album premium 20x30 cm, 50 halaman',
    'JPEG high resolution + RAW files',
    'Flashdisk custom, cetak foto 4R (50 lembar)',
    '3 orang (1 fotografer, 1 videografer, 1 asisten)',
    '14 hari kerja setelah acara',
    '2024-01-15',
    '2024-03-20',
    'Pembatalan H-7 dikenakan biaya 50% dari total kontrak',
    'Jakarta Selatan'
FROM clients c, projects p 
WHERE c.name = 'Sarah Johnson' AND p.project_name = 'Wedding Sarah & Tom' AND c.user_id = 'your-user-id-here'::uuid
LIMIT 1;

-- Insert mock social media posts
INSERT INTO social_media_posts (user_id, project_id, client_name, post_type, platform, scheduled_date, caption, status)
SELECT 
    'your-user-id-here'::uuid,
    p.id,
    'Sarah Johnson',
    'Instagram Feed',
    'Instagram',
    '2024-03-20',
    'Beautiful wedding moments captured ✨ #VenaPictures #WeddingPhotography #Jakarta',
    'Terjadwal'
FROM projects p 
WHERE p.project_name = 'Wedding Sarah & Tom' AND p.user_id = 'your-user-id-here'::uuid
LIMIT 1;

-- Insert mock notifications
INSERT INTO notifications (user_id, title, message, icon) VALUES
('your-user-id-here'::uuid, 'Proyek Baru', 'Wedding Sarah & Tom telah ditambahkan ke sistem', 'lead'),
('your-user-id-here'::uuid, 'Pembayaran Diterima', 'DP sebesar Rp 7.500.000 telah diterima dari Sarah Johnson', 'payment'),
('your-user-id-here'::uuid, 'Deadline Mendekat', 'Proyek Corporate Event PT ABC deadline dalam 3 hari', 'deadline'),
('your-user-id-here'::uuid, 'Feedback Klien', 'Sarah Johnson memberikan rating 5 bintang', 'feedback');

COMMIT;