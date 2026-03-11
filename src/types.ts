export interface User {
  id: number;
  email: string;
  name: string;
  role: 'lawyer' | 'client';
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Case {
  id: number;
  client_id: number;
  client_name?: string;
  title: string;
  case_number: string;
  court: string;
  status: string;
  description: string;
  created_at: string;
}

export interface Hearing {
  id: number;
  case_id: number;
  case_title?: string;
  hearing_date: string;
  location: string;
  notes: string;
}

export interface DashboardStats {
  activeCases: number;
  upcomingHearings: number;
  totalClients: number;
  pendingPayments: number;
}
