// Custom hooks for Supabase integration
import { useState, useEffect, useCallback } from 'react'
import {
  clientsAPI, projectsAPI, teamMembersAPI, transactionsAPI,
  packagesAPI, addOnsAPI, teamProjectPaymentsAPI, teamPaymentRecordsAPI,
  pocketsAPI, profileAPI, leadsAPI, rewardLedgerEntriesAPI,
  cardsAPI, assetsAPI, contractsAPI, clientFeedbackAPI,
  notificationsAPI, socialMediaPostsAPI, promoCodesAPI,
  sopsAPI, usersAPI, dashboardAPI, dataAPI
} from '../lib/api'
import { MOCK_DATA, MOCK_USERS } from '../constants'
import type {
  Client, Project, TeamMember, Transaction, Package, AddOn,
  TeamProjectPayment, TeamPaymentRecord, FinancialPocket, Profile,
  Lead, RewardLedgerEntry, Card, Asset, Contract, ClientFeedback,
  Notification, SocialMediaPost, PromoCode, SOP, User
} from '../types'

// Generic hook for CRUD operations
export function useSupabaseData<T>(api: any, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.getAll()
      setData(result)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [api])

  const createItem = useCallback(async (item: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newItem = await api.create(item)
      setData(prev => [newItem, ...prev])
      return newItem
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [api])

  const updateItem = useCallback(async (id: string, updates: Partial<T>) => {
    try {
      const updatedItem = await api.update(id, updates)
      setData(prev => prev.map(item => (item as any).id === id ? updatedItem : item))
      return updatedItem
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [api])

  const deleteItem = useCallback(async (id: string) => {
    try {
      await api.delete(id)
      setData(prev => prev.filter(item => (item as any).id !== id))
      return true
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [api])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    setData,
    loading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem
  }
}

// Specific hooks for each entity
export const useClients = (initialData: Client[] = []) => 
  useSupabaseData<Client>(clientsAPI, initialData)

export const useProjects = (initialData: Project[] = []) => 
  useSupabaseData<Project>(projectsAPI, initialData)

export const useTeamMembers = (initialData: TeamMember[] = []) => 
  useSupabaseData<TeamMember>(teamMembersAPI, initialData)

export const useTransactions = (initialData: Transaction[] = []) => 
  useSupabaseData<Transaction>(transactionsAPI, initialData)

export const usePackages = (initialData: Package[] = []) => 
  useSupabaseData<Package>(packagesAPI, initialData)

export const useAddOns = (initialData: AddOn[] = []) => 
  useSupabaseData<AddOn>(addOnsAPI, initialData)

export const useTeamProjectPayments = (initialData: TeamProjectPayment[] = []) => 
  useSupabaseData<TeamProjectPayment>(teamProjectPaymentsAPI, initialData)

export const useTeamPaymentRecords = (initialData: TeamPaymentRecord[] = []) => 
  useSupabaseData<TeamPaymentRecord>(teamPaymentRecordsAPI, initialData)

export const usePockets = (initialData: FinancialPocket[] = []) => 
  useSupabaseData<FinancialPocket>(pocketsAPI, initialData)

export const useLeads = (initialData: Lead[] = []) => 
  useSupabaseData<Lead>(leadsAPI, initialData)

export const useRewardLedgerEntries = (initialData: RewardLedgerEntry[] = []) => 
  useSupabaseData<RewardLedgerEntry>(rewardLedgerEntriesAPI, initialData)

export const useCards = (initialData: Card[] = []) => 
  useSupabaseData<Card>(cardsAPI, initialData)

export const useAssets = (initialData: Asset[] = []) => 
  useSupabaseData<Asset>(assetsAPI, initialData)

export const useContracts = (initialData: Contract[] = []) => 
  useSupabaseData<Contract>(contractsAPI, initialData)

export const useClientFeedback = (initialData: ClientFeedback[] = []) => 
  useSupabaseData<ClientFeedback>(clientFeedbackAPI, initialData)

export const useNotifications = (initialData: Notification[] = []) => 
  useSupabaseData<Notification>(notificationsAPI, initialData)

export const useSocialMediaPosts = (initialData: SocialMediaPost[] = []) => 
  useSupabaseData<SocialMediaPost>(socialMediaPostsAPI, initialData)

export const usePromoCodes = (initialData: PromoCode[] = []) => 
  useSupabaseData<PromoCode>(promoCodesAPI, initialData)

export const useSOPs = (initialData: SOP[] = []) => 
  useSupabaseData<SOP>(sopsAPI, initialData)

export const useUsers = (initialData: User[] = []) => 
  useSupabaseData<User>(usersAPI, initialData)

// Profile hook (single item)
export function useProfile(initialProfile: Profile | null = null) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const profiles = await profileAPI.getAll()
      setProfile(profiles[0] || null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    try {
      if (profile?.id) {
        const updatedProfile = await profileAPI.update(profile.id, updates)
        setProfile(updatedProfile)
        return updatedProfile
      } else {
        const newProfile = await profileAPI.create(updates as Omit<Profile, 'id' | 'created_at' | 'updated_at'>)
        setProfile(newProfile)
        return newProfile
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [profile])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    setProfile,
    loading,
    error,
    fetchProfile,
    updateProfile
  }
}

// Dashboard stats hook
export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingLeads: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await dashboardAPI.getStats()
      setStats(result)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

// Data migration hook
export function useDataMigration() {
  const [migrating, setMigrating] = useState(false)
  const [migrationError, setMigrationError] = useState<string | null>(null)

  const importMockData = useCallback(async () => {
    setMigrating(true)
    setMigrationError(null)
    try {
      console.log('Starting data migration from localStorage to Supabase...')
      
      // Get mock data from constants
      const mockData = {
        users: MOCK_USERS,
        profile: MOCK_DATA.profile,
        clients: MOCK_DATA.clients,
        projects: MOCK_DATA.projects,
        teamMembers: MOCK_DATA.teamMembers,
        transactions: MOCK_DATA.transactions,
        teamProjectPayments: MOCK_DATA.teamProjectPayments,
        teamPaymentRecords: MOCK_DATA.teamPaymentRecords,
        pockets: MOCK_DATA.pockets,
        leads: MOCK_DATA.leads,
        rewardLedgerEntries: MOCK_DATA.rewardLedgerEntries,
        cards: MOCK_DATA.cards,
        assets: MOCK_DATA.assets,
        contracts: MOCK_DATA.contracts,
        clientFeedback: MOCK_DATA.clientFeedback,
        notifications: MOCK_DATA.notifications,
        socialMediaPosts: MOCK_DATA.socialMediaPosts,
        promoCodes: MOCK_DATA.promoCodes,
        sops: MOCK_DATA.sops,
        packages: MOCK_DATA.packages,
        addOns: MOCK_DATA.addOns
      }

      const results = await dataAPI.importMockData(mockData)
      console.log('Data migration completed:', results)
      return results
    } catch (err: any) {
      setMigrationError(err.message)
      console.error('Error during data migration:', err)
      throw err
    } finally {
      setMigrating(false)
    }
  }, [])

  const exportData = useCallback(async () => {
    try {
      const data = await dataAPI.exportAllData()
      return data
    } catch (err: any) {
      setMigrationError(err.message)
      throw err
    }
  }, [])

  return {
    migrating,
    migrationError,
    importMockData,
    exportData
  }
}