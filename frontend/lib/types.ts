export interface Church {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  primaryColor?: string;
  serviceTimes?: Array<{
    day: string;
    time: string;
    name: string;
  }>;
  leader?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  subdomain: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  logo?: string;
  primaryColor?: string;
}

export interface Stats {
  memberCount: number;
  totalGiving: number;
  upcomingServices: number;
  integrationCount: number;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  scheduledAt: Date;
  duration?: number;
  serviceType?: string;
  expectedCount?: number;
}

export interface Attendance {
  id: string;
  count: number;
  notes?: string;
  serviceId: string;
  createdAt: Date;
}

export interface Giving {
  id: string;
  amount: number;
  currency?: string;
  type?: string;
  method?: string;
  status?: string;
  transactionId?: string;
  donorName?: string;
  anonymous?: boolean;
  notes?: string;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  goal: number;
  raised?: number;
  startDate: Date;
  endDate?: Date;
  isActive?: boolean;
}

export interface Integration {
  id: string;
  type: 'META' | 'CHURCHSUITE' | 'PLANNING_CENTER' | 'CANVA' | 'STRIPE';
  name: string;
  isActive?: boolean;
  lastSyncAt?: Date;
  config?: any;
}

export interface Job {
  id: string;
  type: 'REPORT_GENERATION' | 'AD_COPY' | 'ATTRIBUTION' | 'EMAIL';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  data?: any;
  result?: any;
  error?: string;
  attempts?: number;
  createdAt: Date;
  scheduledFor?: Date;
  startedAt?: Date;
  completedAt?: Date;
}
