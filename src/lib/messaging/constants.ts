// Messaging configuration constants

export const MESSAGING_CONFIG = {
  // Free tier message limits
  FREE_MESSAGES_PER_EXPERT: 3,

  // Message content limits
  MESSAGE_MAX_LENGTH: 2000,
  MESSAGE_MIN_LENGTH: 1,

  // Preview length for paywall
  PREVIEW_LENGTH: 100,

  // Pagination
  MESSAGES_PAGE_SIZE: 50,
  CONVERSATIONS_PAGE_SIZE: 20,

  // Polling interval for real-time updates (ms)
  POLLING_INTERVAL: 5000,

  // Local storage key
  STORAGE_KEY: 'onFrontiers_messaging',
} as const

// Subscription tier configurations
export const SUBSCRIPTION_TIERS = {
  free: {
    price: 0,
    messagesPerExpert: MESSAGING_CONFIG.FREE_MESSAGES_PER_EXPERT,
    introRequestsPerMonth: 0,
    features: ['Browse experts', 'AI matching', 'Book calls'],
  },
  pro: {
    price: 4900, // $49/mo in cents
    messagesPerExpert: Infinity,
    introRequestsPerMonth: 5,
    features: [
      'Unlimited messages',
      'Response metrics',
      'Priority support',
      '5 intro requests/mo',
    ],
  },
  enterprise: {
    price: 29900, // $299/mo in cents
    messagesPerExpert: Infinity,
    introRequestsPerMonth: Infinity,
    features: [
      'Team seats',
      'Bulk outreach',
      'Dedicated manager',
      'Unlimited intro requests',
    ],
  },
} as const

export type SubscriptionTierKey = keyof typeof SUBSCRIPTION_TIERS
