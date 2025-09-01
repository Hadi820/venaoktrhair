// API functions for CRUD operations
import { supabase, TABLES, handleSupabaseError, getSessionId } from './supabase'
import type {
  Client, Project, TeamMember, Transaction, Package, AddOn,
  TeamProjectPayment, TeamPaymentRecord, FinancialPocket, Profile,
  Lead, RewardLedgerEntry, Card, Asset, Contract, ClientFeedback,
  Notification, SocialMediaPost, PromoCode, SOP, User
} from '../types'

const sessionId = getSessionId()

// Generic CRUD operations
class BaseAPI<T> {
  constructor(private tableName: string) {}

  // Resolve table name: if sessionId is set and non-empty, append it with underscore,
  // otherwise use the plain table name. This keeps backwards-compatibility while
  // ensuring default installs (tables without suffix) are targeted.
  private resolvedTableName() {
    return sessionId ? `${this.tableName}_${sessionId}` : this.tableName
  }

  async getAll(): Promise<T[]> {
    try {
      const table = this.resolvedTableName()
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      handleSupabaseError(error)
      return []
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const table = this.resolvedTableName()
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
      return null
    }
  }

  async create(item: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    try {
      const table = this.resolvedTableName()
      const { data, error } = await supabase
        .from(table)
        .insert([item])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    try {
      const table = this.resolvedTableName()
      const { data, error } = await supabase
        .from(table)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const table = this.resolvedTableName()
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      handleSupabaseError(error)
      return false
    }
  }
}

// API instances for each entity
export const clientsAPI = new BaseAPI<Client>(TABLES.CLIENTS)
export const projectsAPI = new BaseAPI<Project>(TABLES.PROJECTS)
export const teamMembersAPI = new BaseAPI<TeamMember>(TABLES.TEAM_MEMBERS)
export const transactionsAPI = new BaseAPI<Transaction>(TABLES.TRANSACTIONS)
export const packagesAPI = new BaseAPI<Package>(TABLES.PACKAGES)
export const addOnsAPI = new BaseAPI<AddOn>(TABLES.ADD_ONS)
export const teamProjectPaymentsAPI = new BaseAPI<TeamProjectPayment>(TABLES.TEAM_PROJECT_PAYMENTS)
export const teamPaymentRecordsAPI = new BaseAPI<TeamPaymentRecord>(TABLES.TEAM_PAYMENT_RECORDS)
export const pocketsAPI = new BaseAPI<FinancialPocket>(TABLES.POCKETS)
export const profileAPI = new BaseAPI<Profile>(TABLES.PROFILE)
export const leadsAPI = new BaseAPI<Lead>(TABLES.LEADS)
export const rewardLedgerEntriesAPI = new BaseAPI<RewardLedgerEntry>(TABLES.REWARD_LEDGER_ENTRIES)
export const cardsAPI = new BaseAPI<Card>(TABLES.CARDS)
export const assetsAPI = new BaseAPI<Asset>(TABLES.ASSETS)
export const contractsAPI = new BaseAPI<Contract>(TABLES.CONTRACTS)
export const clientFeedbackAPI = new BaseAPI<ClientFeedback>(TABLES.CLIENT_FEEDBACK)
export const notificationsAPI = new BaseAPI<Notification>(TABLES.NOTIFICATIONS)
export const socialMediaPostsAPI = new BaseAPI<SocialMediaPost>(TABLES.SOCIAL_MEDIA_POSTS)
export const promoCodesAPI = new BaseAPI<PromoCode>(TABLES.PROMO_CODES)
export const sopsAPI = new BaseAPI<SOP>(TABLES.SOPS)
export const usersAPI = new BaseAPI<User>(TABLES.USERS)

// Specialized API functions
export const dashboardAPI = {
  async getStats() {
    try {
      const [clients, projects, transactions, leads] = await Promise.all([
        clientsAPI.getAll(),
        projectsAPI.getAll(),
        transactionsAPI.getAll(),
        leadsAPI.getAll()
      ])

      return {
        totalClients: clients.length,
        activeProjects: projects.filter(p => p.status !== 'Selesai').length,
        totalRevenue: transactions
          .filter(t => t.type === 'Pemasukan')
          .reduce((sum, t) => sum + t.amount, 0),
        pendingLeads: leads.filter(l => l.status === 'Sedang Diskusi').length
      }
    } catch (error) {
      handleSupabaseError(error)
      return {
        totalClients: 0,
        activeProjects: 0,
        totalRevenue: 0,
        pendingLeads: 0
      }
    }
  }
}

// Data import/export functions
export const dataAPI = {
  async importMockData(mockData: any) {
    try {
      console.log('Starting mock data import...')
      
      // Import in order to respect foreign key constraints
      const importOrder = [
        { api: usersAPI, data: mockData.users || [], name: 'users' },
        { api: profileAPI, data: [mockData.profile], name: 'profile' },
        { api: clientsAPI, data: mockData.clients || [], name: 'clients' },
        { api: packagesAPI, data: mockData.packages || [], name: 'packages' },
        { api: addOnsAPI, data: mockData.addOns || [], name: 'addOns' },
        { api: teamMembersAPI, data: mockData.teamMembers || [], name: 'teamMembers' },
        { api: projectsAPI, data: mockData.projects || [], name: 'projects' },
        { api: transactionsAPI, data: mockData.transactions || [], name: 'transactions' },
        { api: pocketsAPI, data: mockData.pockets || [], name: 'pockets' },
        { api: cardsAPI, data: mockData.cards || [], name: 'cards' },
        { api: leadsAPI, data: mockData.leads || [], name: 'leads' },
        { api: assetsAPI, data: mockData.assets || [], name: 'assets' },
        { api: contractsAPI, data: mockData.contracts || [], name: 'contracts' },
        { api: clientFeedbackAPI, data: mockData.clientFeedback || [], name: 'clientFeedback' },
        { api: notificationsAPI, data: mockData.notifications || [], name: 'notifications' },
        { api: socialMediaPostsAPI, data: mockData.socialMediaPosts || [], name: 'socialMediaPosts' },
        { api: promoCodesAPI, data: mockData.promoCodes || [], name: 'promoCodes' },
        { api: sopsAPI, data: mockData.sops || [], name: 'sops' },
        { api: teamProjectPaymentsAPI, data: mockData.teamProjectPayments || [], name: 'teamProjectPayments' },
        { api: teamPaymentRecordsAPI, data: mockData.teamPaymentRecords || [], name: 'teamPaymentRecords' },
        { api: rewardLedgerEntriesAPI, data: mockData.rewardLedgerEntries || [], name: 'rewardLedgerEntries' }
      ]

      const results = []
      for (const { api, data, name } of importOrder) {
        if (data && data.length > 0) {
          console.log(`Importing ${name}...`)
          for (const item of data) {
            try {
              const created = await api.create(item)
              results.push({ type: name, success: true, id: created.id })
            } catch (error) {
              console.error(`Error importing ${name}:`, error)
              results.push({ type: name, success: false, error: error.message })
            }
          }
        }
      }

      console.log('Mock data import completed:', results)
      return results
    } catch (error) {
      console.error('Error during mock data import:', error)
      throw error
    }
  },

  async exportAllData() {
    try {
      const [
        users, profile, clients, packages, addOns, teamMembers,
        projects, transactions, pockets, cards, leads, assets,
        contracts, clientFeedback, notifications, socialMediaPosts,
        promoCodes, sops, teamProjectPayments, teamPaymentRecords,
        rewardLedgerEntries
      ] = await Promise.all([
        usersAPI.getAll(),
        profileAPI.getAll(),
        clientsAPI.getAll(),
        packagesAPI.getAll(),
        addOnsAPI.getAll(),
        teamMembersAPI.getAll(),
        projectsAPI.getAll(),
        transactionsAPI.getAll(),
        pocketsAPI.getAll(),
        cardsAPI.getAll(),
        leadsAPI.getAll(),
        assetsAPI.getAll(),
        contractsAPI.getAll(),
        clientFeedbackAPI.getAll(),
        notificationsAPI.getAll(),
        socialMediaPostsAPI.getAll(),
        promoCodesAPI.getAll(),
        sopsAPI.getAll(),
        teamProjectPaymentsAPI.getAll(),
        teamPaymentRecordsAPI.getAll(),
        rewardLedgerEntriesAPI.getAll()
      ])

      return {
        users,
        profile: profile[0] || null,
        clients,
        packages,
        addOns,
        teamMembers,
        projects,
        transactions,
        pockets,
        cards,
        leads,
        assets,
        contracts,
        clientFeedback,
        notifications,
        socialMediaPosts,
        promoCodes,
        sops,
        teamProjectPayments,
        teamPaymentRecords,
        rewardLedgerEntries,
        exportedAt: new Date().toISOString()
      }
    } catch (error) {
      handleSupabaseError(error)
      throw error
    }
  }
}