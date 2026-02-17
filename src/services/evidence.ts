/**
 * Evidence service with proper schema imports
 * 
 * Fixed: Changed EvidenceSubscriptionTier to Utils__enums__EvidenceSubscriptionTier
 */
import { Utils__enums__EvidenceSubscriptionTier, Evidence, User } from '../../types/schema';

export interface EvidenceServiceConfig {
  baseUrl: string;
  apiKey: string;
}

export class EvidenceService {
  private config: EvidenceServiceConfig;
  
  constructor(config: EvidenceServiceConfig) {
    this.config = config;
  }
  
  /**
   * Check if a user has access to a specific tier
   */
  hasAccess(user: User, requiredTier: Utils__enums__EvidenceSubscriptionTier): boolean {
    const tierOrder = [
      Utils__enums__EvidenceSubscriptionTier.FREE,
      Utils__enums__EvidenceSubscriptionTier.BASIC,
      Utils__enums__EvidenceSubscriptionTier.PROFESSIONAL,
      Utils__enums__EvidenceSubscriptionTier.ENTERPRISE,
    ];
    
    const userTierIndex = tierOrder.indexOf(user.subscriptionTier);
    const requiredTierIndex = tierOrder.indexOf(requiredTier);
    
    return userTierIndex >= requiredTierIndex;
  }
  
  /**
   * Filter evidence by subscription tier
   */
  filterByTier(evidence: Evidence[], tier: Utils__enums__EvidenceSubscriptionTier): Evidence[] {
    return evidence.filter(e => e.tier === tier);
  }
  
  /**
   * Get tier display name
   */
  getTierDisplayName(tier: Utils__enums__EvidenceSubscriptionTier): string {
    switch (tier) {
      case Utils__enums__EvidenceSubscriptionTier.FREE:
        return 'Free';
      case Utils__enums__EvidenceSubscriptionTier.BASIC:
        return 'Basic';
      case Utils__enums__EvidenceSubscriptionTier.PROFESSIONAL:
        return 'Professional';
      case Utils__enums__EvidenceSubscriptionTier.ENTERPRISE:
        return 'Enterprise';
      default:
        return 'Unknown';
    }
  }
}

export default EvidenceService;
