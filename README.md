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

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 2. Supabase Setup

1. **Enable Supabase Integration**: Click the Supabase button on the top right of the platform
2. **Database Schema**: The app will automatically create all necessary tables
3. **Import Mock Data**: Use the built-in data migration tool to populate with sample data

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

The application creates the following tables in Supabase:

- `users` - User accounts and permissions
- `profile` - Vendor profile and settings
- `clients` - Client information
- `projects` - Project details and status
- `team_members` - Freelancer/team member data
- `transactions` - Financial transactions
- `packages` - Service packages
- `add_ons` - Additional services
- `leads` - Prospect leads
- `assets` - Company assets
- `contracts` - Legal contracts
- `notifications` - System notifications
- `social_media_posts` - Social media content planning
- `promo_codes` - Discount codes
- `sops` - Standard Operating Procedures
- And more...

## Data Migration

The app supports both localStorage (for development) and Supabase (for production):

- **Development Mode**: Uses localStorage for quick testing
- **Production Mode**: Uses Supabase for persistent, scalable storage
- **Migration Tool**: Built-in tool to migrate data from localStorage to Supabase

## API Structure

All CRUD operations are handled through:

- `lib/supabase.ts` - Supabase client configuration
- `lib/database.ts` - Database schema and initialization
- `lib/api.ts` - API functions for all entities
- `hooks/useSupabase.ts` - React hooks for data management

## Key Features

### Real-time Updates
- Automatic data synchronization across sessions
- Real-time notifications and updates

### Data Isolation
- Session-based table naming for multi-tenant support
- Secure data separation between different instances

### CRUD Operations
- Create, Read, Update, Delete for all modules
- Batch operations and data validation
- Error handling and rollback support

### Authentication & Authorization
- User role-based access control
- Permission management for different modules
- Secure API endpoints

## Usage

1. **First Time Setup**: Navigate to `#/supabase-setup` to initialize the database
2. **Data Import**: Use the migration tool to import mock data
3. **Switch Modes**: Toggle between localStorage and Supabase in settings
4. **CRUD Operations**: All modules support full CRUD operations automatically

## Development

The application uses a hybrid approach:
- Falls back to localStorage when Supabase is not available
- Seamlessly switches between data sources
- Maintains the same API interface for both storage methods

## Support

For issues or questions:
1. Check the browser console for detailed error messages
2. Verify Supabase configuration and credentials
3. Ensure database schema is properly created
4. Test with mock data first before using production data