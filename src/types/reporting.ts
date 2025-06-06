
export interface CustomerUsage {
  customerName: string;
  usage: number;
  unit: 'TB' | 'GB';
  status?: 'active' | 'removed';
  note?: string;
}

export interface ServiceItem {
  name: string;
  currentUsage: number;
  unit: 'TB' | 'GB';
  trend: 'up' | 'down';
  changePercent: number;
}

export interface ServiceCategory {
  name: string;
  type: 'storage' | 'tape' | 'licensing';
  customers: CustomerUsage[];
  totalUsage?: number;
  unit?: string;
  items?: ServiceItem[];
}

export interface MonthlyReport {
  month: string;
  year: number;
  capturedDate: string;
  categories: ServiceCategory[];
}
