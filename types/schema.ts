/**
 * Schema types generated from GraphQL schema
 * 
 * Note: EvidenceSubscriptionTier has been moved to Utils__enums__EvidenceSubscriptionTier
 * Do NOT import EvidenceSubscriptionTier directly - use Utils__enums__EvidenceSubscriptionTier instead
 */

// Evidence Subscription Tier enum - proper export path
export enum Utils__enums__EvidenceSubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

// Re-export for backwards compatibility (deprecated)
// @deprecated Use Utils__enums__EvidenceSubscriptionTier instead
// export type EvidenceSubscriptionTier = Utils__enums__EvidenceSubscriptionTier;

// Other schema types
export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: Utils__enums__EvidenceSubscriptionTier;
}

export interface Evidence {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tier: Utils__enums__EvidenceSubscriptionTier;
}

export interface Query {
  user: User;
  evidence: Evidence[];
}

export interface Mutation {
  updateUser: User;
  createEvidence: Evidence;
}
