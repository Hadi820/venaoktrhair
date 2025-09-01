# Vena Pictures Dashboard - Supabase Integration

This is the Vena Pictures Dashboard with full Supabase integration for persistent data storage and CRUD operations.

## Features

### Integrated Modules with CRUD Operations:
- ✅ **Dashboard** - Overview and statistics
- ✅ **Prospek** - Lead management
- ✅ **Booking** - Booking management
- ✅ **Klien** - Client management
- ✅ **Proyek** - Project management
- ✅ **Freelancer** - Team member management
- ✅ **Keuangan** - Financial management
- ✅ **Kalender** - Calendar view
- ✅ **Perencana Sosmed** - Social media planning
- ✅ **Paket** - Package management
- ✅ **Aset** - Asset management
- ✅ **Kontrak** - Contract management
- ✅ **Kode Promo** - Promo code management
- ✅ **SOP** - Standard Operating Procedures
- ✅ **Laporan Klien** - Client reports
- ✅ **Pengaturan** - Settings

## Setup Instructions

### 1. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   **Note**: Ensure these variables are correctly set. The application will not function correctly without them.

### 2. Supabase Setup

1. **Database Schema**: The application is designed to work with a pre-defined Supabase schema. You can find the table structure in `supabase-schema.sql`.
2. **Import Mock Data (Optional)**: If you want to populate your database with sample data, you can use the `supabase-mock-data.sql` file.

### 3. Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Database Schema

The application relies on a Supabase database with tables such as:

- `users` - User accounts and permissions
- `profiles` - Vendor profile and settings
- `clients` - Client information
- `projects` - Project details and status
- `team_members` - Freelancer/team member data
- `transactions` - Financial transactions
- `packages` - Service packages
- `leads` - Prospect leads
- `contracts` - Legal contracts
- ...and more.

Refer to `supabase-schema.sql` for the complete schema.

## API Structure

All CRUD operations are handled through a service-oriented architecture:

- `lib/supabase.ts` - Initializes the Supabase client.
- `services/supabaseService.ts` - Contains all the functions that interact with the Supabase API for each entity (e.g., clients, projects).
- `hooks/useSupabaseData.ts` - A React hook that fetches data using `supabaseService` and manages the application's state.

## Development

This application uses **Supabase** as its sole data source. It does not use `localStorage` for data storage. All CRUD operations (Create, Read, Update, Delete) are performed directly against the Supabase database.

If you are facing issues with data not being saved, please ensure that your Supabase URL and Anon Key are correctly configured in your `.env` file.

## Support

For issues or questions:
1. Check the browser's developer console for any Supabase-related error messages.
2. Double-check your Supabase configuration and credentials in the `.env` file.
3. Ensure your Supabase database schema is correctly set up.