import { supabase } from '../lib/supabase';
import { 
  Client, Project, TeamMember, Transaction, Lead, Card, FinancialPocket,
  Asset, Contract, PromoCode, SOP, ClientFeedback, TeamProjectPayment,
  TeamPaymentRecord, RewardLedgerEntry,
  SocialMediaPost, Notification, Package, AddOn, Profile
} from '../types';

// Auth helper to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Generic CRUD operations
class SupabaseService<T> {
  constructor(private tableName: string) {}

  async getAll(): Promise<T[]> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<T | null> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(item: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ ...item, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from(this.tableName)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }
}

// Service instances for each entity
export const clientsService = new SupabaseService<Client>('clients');
export const projectsService = new SupabaseService<Project>('projects');
export const teamMembersService = new SupabaseService<TeamMember>('team_members');
export const transactionsService = new SupabaseService<Transaction>('transactions');
export const leadsService = new SupabaseService<Lead>('leads');
export const cardsService = new SupabaseService<Card>('cards');
export const financialPocketsService = new SupabaseService<FinancialPocket>('financial_pockets');
export const assetsService = new SupabaseService<Asset>('assets');
export const contractsService = new SupabaseService<Contract>('contracts');
export const promoCodesService = new SupabaseService<PromoCode>('promo_codes');
export const sopsService = new SupabaseService<SOP>('sops');
export const clientFeedbackService = new SupabaseService<ClientFeedback>('client_feedback');
export const teamProjectPaymentsService = new SupabaseService<TeamProjectPayment>('team_project_payments');
export const socialMediaPostsService = new SupabaseService<SocialMediaPost>('social_media_posts');
export const notificationsService = new SupabaseService<Notification>('notifications');
export const packagesService = new SupabaseService<Package>('packages');
export const addOnsService = new SupabaseService<AddOn>('add_ons');
export const teamPaymentRecordsService = new SupabaseService<TeamPaymentRecord>('team_payment_records');
export const rewardLedgerEntriesService = new SupabaseService<RewardLedgerEntry>('reward_ledger_entries');

// Profile service (special case - no user_id filter needed)
export const profileService = {
  async get(): Promise<Profile | null> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No profile found
      throw error;
    }
    return data;
  },

  async create(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ ...profile, id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(updates: Partial<Profile>): Promise<Profile> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Custom queries for complex operations
export const customQueries = {
  // Get projects with client details
  async getProjectsWithClients(): Promise<any[]> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        clients (
          id,
          name,
          email,
          phone,
          status
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get transactions with project details
  async getTransactionsWithProjects(): Promise<any[]> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        projects (
          id,
          project_name,
          client_name
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get team payments with project and member details
  async getTeamPaymentsWithDetails(): Promise<any[]> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('team_project_payments')
      .select(`
        *,
        projects (
          id,
          project_name,
          client_name
        ),
        team_members (
          id,
          name,
          role
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get contracts with client and project details
  async getContractsWithDetails(): Promise<any[]> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('contracts')
      .select(`
        *,
        clients (
          id,
          name,
          email,
          phone
        ),
        projects (
          id,
          project_name,
          project_type
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Dashboard statistics
  async getDashboardStats(): Promise<any> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get all data in parallel
    const [
      clientsData,
      projectsData,
      transactionsData,
      cardsData,
      teamMembersData
    ] = await Promise.all([
      supabase.from('clients').select('*').eq('user_id', user.id),
      supabase.from('projects').select('*').eq('user_id', user.id),
      supabase.from('transactions').select('*').eq('user_id', user.id),
      supabase.from('cards').select('*').eq('user_id', user.id),
      supabase.from('team_members').select('*').eq('user_id', user.id)
    ]);

    return {
      clients: clientsData.data || [],
      projects: projectsData.data || [],
      transactions: transactionsData.data || [],
      cards: cardsData.data || [],
      teamMembers: teamMembersData.data || []
    };
  }
};

// Data transformation helpers
export const transformers = {
  // Transform database row to Client type
  dbToClient(row: any): Client {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      whatsapp: row.whatsapp,
      since: row.since,
      instagram: row.instagram,
      status: row.status,
      clientType: row.client_type,
      lastContact: row.last_contact,
      portalAccessId: row.portal_access_id
    };
  },

  // Transform Client type to database row
  clientToDb(client: Partial<Client>): any {
    return {
      name: client.name,
      email: client.email,
      phone: client.phone,
      whatsapp: client.whatsapp,
      since: client.since,
      instagram: client.instagram,
      status: client.status,
      client_type: client.clientType,
      last_contact: client.lastContact,
      portal_access_id: client.portalAccessId
    };
  },

  // Transform database row to Project type
  dbToProject(row: any): Project {
    return {
      id: row.id,
      projectName: row.project_name,
      clientName: row.client_name,
      clientId: row.client_id,
      projectType: row.project_type,
      packageName: row.package_name,
      packageId: row.package_id,
      addOns: row.add_ons || [],
      date: row.date,
      deadlineDate: row.deadline_date,
      location: row.location,
      progress: row.progress,
      status: row.status,
      activeSubStatuses: row.active_sub_statuses || [],
      totalCost: parseFloat(row.total_cost || '0'),
      amountPaid: parseFloat(row.amount_paid || '0'),
      paymentStatus: row.payment_status,
      team: row.team || [],
      notes: row.notes,
      accommodation: row.accommodation,
      driveLink: row.drive_link,
      clientDriveLink: row.client_drive_link,
      finalDriveLink: row.final_drive_link,
      startTime: row.start_time,
      endTime: row.end_time,
      image: row.image,
      revisions: row.revisions || [],
      promoCodeId: row.promo_code_id,
      discountAmount: parseFloat(row.discount_amount || '0'),
      shippingDetails: row.shipping_details,
      dpProofUrl: row.dp_proof_url,
      printingDetails: row.printing_details || [],
      printingCost: parseFloat(row.printing_cost || '0'),
      transportCost: parseFloat(row.transport_cost || '0'),
      isEditingConfirmedByClient: row.is_editing_confirmed_by_client,
      isPrintingConfirmedByClient: row.is_printing_confirmed_by_client,
      isDeliveryConfirmedByClient: row.is_delivery_confirmed_by_client,
      confirmedSubStatuses: row.confirmed_sub_statuses || [],
      clientSubStatusNotes: row.client_sub_status_notes || {},
      subStatusConfirmationSentAt: row.sub_status_confirmation_sent_at || {},
      completedDigitalItems: row.completed_digital_items || [],
      invoiceSignature: row.invoice_signature,
      customSubStatuses: row.custom_sub_statuses || [],
      bookingStatus: row.booking_status,
      rejectionReason: row.rejection_reason,
      chatHistory: row.chat_history || []
    };
  },

  // Transform Project type to database row
  projectToDb(project: Partial<Project>): any {
    return {
      project_name: project.projectName,
      client_name: project.clientName,
      client_id: project.clientId,
      project_type: project.projectType,
      package_name: project.packageName,
      package_id: project.packageId,
      add_ons: project.addOns,
      date: project.date,
      deadline_date: project.deadlineDate,
      location: project.location,
      progress: project.progress,
      status: project.status,
      active_sub_statuses: project.activeSubStatuses,
      total_cost: project.totalCost,
      amount_paid: project.amountPaid,
      payment_status: project.paymentStatus,
      team: project.team,
      notes: project.notes,
      accommodation: project.accommodation,
      drive_link: project.driveLink,
      client_drive_link: project.clientDriveLink,
      final_drive_link: project.finalDriveLink,
      start_time: project.startTime,
      end_time: project.endTime,
      image: project.image,
      revisions: project.revisions,
      promo_code_id: project.promoCodeId,
      discount_amount: project.discountAmount,
      shipping_details: project.shippingDetails,
      dp_proof_url: project.dpProofUrl,
      printing_details: project.printingDetails,
      printing_cost: project.printingCost,
      transport_cost: project.transportCost,
      is_editing_confirmed_by_client: project.isEditingConfirmedByClient,
      is_printing_confirmed_by_client: project.isPrintingConfirmedByClient,
      is_delivery_confirmed_by_client: project.isDeliveryConfirmedByClient,
      confirmed_sub_statuses: project.confirmedSubStatuses,
      client_sub_status_notes: project.clientSubStatusNotes,
      sub_status_confirmation_sent_at: project.subStatusConfirmationSentAt,
      completed_digital_items: project.completedDigitalItems,
      invoice_signature: project.invoiceSignature,
      custom_sub_statuses: project.customSubStatuses,
      booking_status: project.bookingStatus,
      rejection_reason: project.rejectionReason,
      chat_history: project.chatHistory
    };
  }
};

// Batch operations
export const batchOperations = {
  async syncAllData(): Promise<any> {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get all data in parallel
    const [
      profile,
      clients,
      projects,
      teamMembers,
      transactions,
      leads,
      cards,
      financialPockets,
      assets,
      contracts,
      promoCodes,
      sops,
      clientFeedback,
      teamProjectPayments,
      socialMediaPosts,
      notifications,
      packages,
      addOns
    ] = await Promise.all([
      profileService.get(),
      clientsService.getAll(),
      projectsService.getAll(),
      teamMembersService.getAll(),
      transactionsService.getAll(),
      leadsService.getAll(),
      cardsService.getAll(),
      financialPocketsService.getAll(),
      assetsService.getAll(),
      contractsService.getAll(),
      promoCodesService.getAll(),
      sopsService.getAll(),
      clientFeedbackService.getAll(),
      teamProjectPaymentsService.getAll(),
      socialMediaPostsService.getAll(),
      notificationsService.getAll(),
      packagesService.getAll(),
      addOnsService.getAll()
    ]);

    return {
      profile,
      clients,
      projects,
      teamMembers,
      transactions,
      leads,
      cards,
      financialPockets,
      assets,
      contracts,
      promoCodes,
      sops,
      clientFeedback,
      teamProjectPayments,
      socialMediaPosts,
      notifications,
      packages,
      addOns
    };
  }
};