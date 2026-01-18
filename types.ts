
export enum CustomerStatus {
  ONBOARDING = 'ONBOARDING',
  ACTIVE = 'ACTIVE',
  CHURN_RISK = 'CHURN_RISK',
  UPSELL_READY = 'UPSELL_READY',
  CHURNED = 'CHURNED'
}

export interface EngagementEvent {
  id: string;
  timestamp: string;
  type: 'LOGIN' | 'FEATURE_USE' | 'SUPPORT_TICKET' | 'PAYMENT' | 'FEEDBACK';
  metadata: Record<string, any>;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  joinedDate: string;
  status: CustomerStatus;
  healthScore: number; // 0-100
  events: EngagementEvent[];
  lifetimeValue: number;
}

export interface AgentAction {
  id: string;
  customerId: string;
  timestamp: string;
  thoughtProcess: string;
  actionType: 'SEND_EMAIL' | 'OFFER_DISCOUNT' | 'SCHEDULE_CALL' | 'SEND_TUTORIAL' | 'NOTIFY_SALES';
  content: string;
  status: 'PENDING' | 'EXECUTED' | 'SUCCESS' | 'FAILED';
}

export interface AnalyticsSummary {
  totalCustomers: number;
  avgHealthScore: number;
  churnRate: number;
  upsellPipe: number;
}

export enum ModelType {
  PRO = 'gemini-3-pro-preview',
  FLASH = 'gemini-3-flash-preview'
}
