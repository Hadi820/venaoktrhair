import { useState, useEffect } from 'react';
import { 
  clientsService, projectsService, teamMembersService, transactionsService,
  leadsService, cardsService, financialPocketsService, assetsService,
  contractsService, promoCodesService, sopsService, clientFeedbackService,
  teamProjectPaymentsService, socialMediaPostsService, notificationsService,
  packagesService, addOnsService, profileService, batchOperations
} from '../services/supabaseService';
import { 
  Client, Project, TeamMember, Transaction, Lead, Card, FinancialPocket,
  Asset, Contract, PromoCode, SOP, ClientFeedback, TeamProjectPayment,
  SocialMediaPost, Notification, Package, AddOn, Profile
} from '../types';

export const useSupabaseData = () => {
  // State for all entities
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [financialPockets, setFinancialPockets] = useState<FinancialPocket[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [sops, setSops] = useState<SOP[]>([]);
  const [clientFeedback, setClientFeedback] = useState<ClientFeedback[]>([]);
  const [teamProjectPayments, setTeamProjectPayments] = useState<TeamProjectPayment[]>([]);
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await batchOperations.syncAllData();
      
      setProfile(data.profile);
      setClients(data.clients);
      setProjects(data.projects);
      setTeamMembers(data.teamMembers);
      setTransactions(data.transactions);
      setLeads(data.leads);
      setCards(data.cards);
      setFinancialPockets(data.financialPockets);
      setAssets(data.assets);
      setContracts(data.contracts);
      setPromoCodes(data.promoCodes);
      setSops(data.sops);
      setClientFeedback(data.clientFeedback);
      setTeamProjectPayments(data.teamProjectPayments);
      setSocialMediaPosts(data.socialMediaPosts);
      setNotifications(data.notifications);
      setPackages(data.packages);
      setAddOns(data.addOns);

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations for each entity
  const clientOperations = {
    create: async (client: Omit<Client, 'id'>) => {
      try {
        const newClient = await clientsService.create(client);
        setClients(prev => [newClient, ...prev]);
        return newClient;
      } catch (err) {
        console.error('Error creating client:', err);
        throw err;
      }
    },
    update: async (id: string, updates: Partial<Client>) => {
      try {
        const updatedClient = await clientsService.update(id, updates);
        setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
        return updatedClient;
      } catch (err) {
        console.error('Error updating client:', err);
        throw err;
      }
    },
    delete: async (id: string) => {
      try {
        await clientsService.delete(id);
        setClients(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error('Error deleting client:', err);
        throw err;
      }
    }
  };

  const projectOperations = {
    create: async (project: Omit<Project, 'id'>) => {
      try {
        const newProject = await projectsService.create(project);
        setProjects(prev => [newProject, ...prev]);
        return newProject;
      } catch (err) {
        console.error('Error creating project:', err);
        throw err;
      }
    },
    update: async (id: string, updates: Partial<Project>) => {
      try {
        const updatedProject = await projectsService.update(id, updates);
        setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
        return updatedProject;
      } catch (err) {
        console.error('Error updating project:', err);
        throw err;
      }
    },
    delete: async (id: string) => {
      try {
        await projectsService.delete(id);
        setProjects(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        console.error('Error deleting project:', err);
        throw err;
      }
    }
  };

  const teamMemberOperations = {
    create: async (member: Omit<TeamMember, 'id'>) => {
      try {
        const newMember = await teamMembersService.create(member);
        setTeamMembers(prev => [newMember, ...prev]);
        return newMember;
      } catch (err) {
        console.error('Error creating team member:', err);
        throw err;
      }
    },
    update: async (id: string, updates: Partial<TeamMember>) => {
      try {
        const updatedMember = await teamMembersService.update(id, updates);
        setTeamMembers(prev => prev.map(m => m.id === id ? updatedMember : m));
        return updatedMember;
      } catch (err) {
        console.error('Error updating team member:', err);
        throw err;
      }
    },
    delete: async (id: string) => {
      try {
        await teamMembersService.delete(id);
        setTeamMembers(prev => prev.filter(m => m.id !== id));
      } catch (err) {
        console.error('Error deleting team member:', err);
        throw err;
      }
    }
  };

  const transactionOperations = {
    create: async (transaction: Omit<Transaction, 'id'>) => {
      try {
        const newTransaction = await transactionsService.create(transaction);
        setTransactions(prev => [newTransaction, ...prev]);
        return newTransaction;
      } catch (err) {
        console.error('Error creating transaction:', err);
        throw err;
      }
    },
    update: async (id: string, updates: Partial<Transaction>) => {
      try {
        const updatedTransaction = await transactionsService.update(id, updates);
        setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
        return updatedTransaction;
      } catch (err) {
        console.error('Error updating transaction:', err);
        throw err;
      }
    },
    delete: async (id: string) => {
      try {
        await transactionsService.delete(id);
        setTransactions(prev => prev.filter(t => t.id !== id));
      } catch (err) {
        console.error('Error deleting transaction:', err);
        throw err;
      }
    }
  };

  const leadOperations = {
    create: async (lead: Omit<Lead, 'id'>) => {
      try {
        const newLead = await leadsService.create(lead);
        setLeads(prev => [newLead, ...prev]);
        return newLead;
      } catch (err) {
        console.error('Error creating lead:', err);
        throw err;
      }
    },
    update: async (id: string, updates: Partial<Lead>) => {
      try {
        const updatedLead = await leadsService.update(id, updates);
        setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
        return updatedLead;
      } catch (err) {
        console.error('Error updating lead:', err);
        throw err;
      }
    },
    delete: async (id: string) => {
      try {
        await leadsService.delete(id);
        setLeads(prev => prev.filter(l => l.id !== id));
      } catch (err) {
        console.error('Error deleting lead:', err);
        throw err;
      }
    }
  };

  const cardOperations = {
    create: async (card: Omit<Card, 'id'>) => {
      try {
        const newCard = await cardsService.create(card);
        setCards(prev => [newCard, ...prev]);
        return newCard;
      } catch (err) {
        console.error('Error creating card:', err);
        throw err;
      }
    },
    update: async (id: string, updates: Partial<Card>) => {
      try {
        const updatedCard = await cardsService.update(id, updates);
        setCards(prev => prev.map(c => c.id === id ? updatedCard : c));
        return updatedCard;
      } catch (err) {
        console.error('Error updating card:', err);
        throw err;
      }
    },
    delete: async (id: string) => {
      try {
        await cardsService.delete(id);
        setCards(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error('Error deleting card:', err);
        throw err;
      }
    }
  };

  const profileOperations = {
    update: async (updates: Partial<Profile>) => {
      try {
        const updatedProfile = await profileService.update(updates);
        setProfile(updatedProfile);
        return updatedProfile;
      } catch (err) {
        console.error('Error updating profile:', err);
        throw err;
      }
    }
  };

  // Return all data and operations
  return {
    // Data
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
    addOns,

    // State
    loading,
    error,

    // Operations
    clientOperations,
    projectOperations,
    teamMemberOperations,
    transactionOperations,
    leadOperations,
    cardOperations,
    profileOperations,

    // Utility
    refreshData: loadAllData,

    // Setters (for backward compatibility)
    setClients,
    setProjects,
    setTeamMembers,
    setTransactions,
    setLeads,
    setCards,
    setFinancialPockets,
    setAssets,
    setContracts,
    setPromoCodes,
    setSops,
    setClientFeedback,
    setTeamProjectPayments,
    setSocialMediaPosts,
    setNotifications,
    setPackages,
    setAddOns,
    setProfile
  };
};