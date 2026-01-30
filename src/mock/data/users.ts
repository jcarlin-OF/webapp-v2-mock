import type { User, Client, ExpertUser, Earnings } from '@/types'
import { experts } from './experts'

// Mock users with test credentials
// Passwords are stored in plain text for mock purposes only
// In a real app, passwords would be hashed

export interface MockUser {
  id: string
  email: string
  password: string
  name: string
  avatar?: string
  role: 'client' | 'expert' | 'admin'
  createdAt: string
  // Client-specific
  savedExperts?: string[]
  // Expert-specific
  expertId?: string
}

export const mockUsers: MockUser[] = [
  {
    id: 'user_001',
    email: 'client@test.com',
    password: 'password',
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    role: 'client',
    createdAt: '2024-01-15',
    savedExperts: ['exp_001', 'exp_003', 'exp_008'],
  },
  {
    id: 'user_002',
    email: 'jane@test.com',
    password: 'password',
    name: 'Jane Cooper',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    role: 'client',
    createdAt: '2024-02-20',
    savedExperts: [],
  },
  {
    id: 'user_exp_001',
    email: 'sarah@test.com',
    password: 'password',
    name: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'expert',
    createdAt: '2023-06-10',
    expertId: 'exp_001',
  },
  {
    id: 'user_exp_002',
    email: 'james@test.com',
    password: 'password',
    name: 'James Morrison',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'expert',
    createdAt: '2023-08-15',
    expertId: 'exp_002',
  },
]

// Helper functions
export function getUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find((user) => user.email === email)
}

export function getUserById(id: string): MockUser | undefined {
  return mockUsers.find((user) => user.id === id)
}

export function validateCredentials(
  email: string,
  password: string
): MockUser | null {
  const user = getUserByEmail(email)
  if (user && user.password === password) {
    return user
  }
  return null
}

// Get full client data
export function getClientData(userId: string): Client | null {
  const mockUser = getUserById(userId)
  if (!mockUser || mockUser.role !== 'client') return null

  return {
    id: mockUser.id,
    email: mockUser.email,
    name: mockUser.name,
    avatar: mockUser.avatar,
    role: 'client',
    createdAt: mockUser.createdAt,
    savedExperts: mockUser.savedExperts || [],
    bookings: [], // Would be populated from bookings data
  }
}

// Get full expert user data
export function getExpertUserData(userId: string): ExpertUser | null {
  const mockUser = getUserById(userId)
  if (!mockUser || mockUser.role !== 'expert' || !mockUser.expertId) return null

  const expert = experts.find((e) => e.id === mockUser.expertId)
  if (!expert) return null

  // Mock earnings data
  const earnings: Earnings = {
    total: 1250000, // $12,500
    pending: 125000, // $1,250
    available: 1125000, // $11,250
    lastPayout: {
      amount: 350000, // $3,500
      date: '2024-01-20',
    },
  }

  return {
    id: mockUser.id,
    email: mockUser.email,
    name: mockUser.name,
    avatar: mockUser.avatar,
    role: 'expert',
    createdAt: mockUser.createdAt,
    expert,
    earnings,
  }
}

// Toggle saved expert for a client
export function toggleSavedExpert(userId: string, expertId: string): boolean {
  const user = mockUsers.find((u) => u.id === userId && u.role === 'client')
  if (!user) return false

  if (!user.savedExperts) {
    user.savedExperts = []
  }

  const index = user.savedExperts.indexOf(expertId)
  if (index === -1) {
    user.savedExperts.push(expertId)
    return true // Added
  } else {
    user.savedExperts.splice(index, 1)
    return false // Removed
  }
}

// Check if expert is saved
export function isExpertSaved(userId: string, expertId: string): boolean {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user || !user.savedExperts) return false
  return user.savedExperts.includes(expertId)
}

// Create a new user (for signup)
export function createUser(data: {
  email: string
  password: string
  name: string
  role: 'client' | 'expert'
}): MockUser | null {
  // Check if email already exists
  if (getUserByEmail(data.email)) {
    return null
  }

  const newUser: MockUser = {
    id: `user_${Date.now()}`,
    email: data.email,
    password: data.password,
    name: data.name,
    role: data.role,
    createdAt: new Date().toISOString().split('T')[0],
    savedExperts: data.role === 'client' ? [] : undefined,
  }

  mockUsers.push(newUser)
  return newUser
}
