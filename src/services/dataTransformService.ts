
import { VeeamConfig } from '../types/veeam-api';
import { ServiceCategory, ServiceItem } from '../types/reporting';

export interface VeeamDataResult {
  config: VeeamConfig;
  result: {
    success: boolean;
    data?: unknown;
    error?: string;
  };
}

export const transformVeeamDataToReportFormat = (veeamResults: VeeamDataResult[]): ServiceCategory[] => {
  const categories: ServiceCategory[] = [];
  
  // Group results by type
  const cloudConnectResults = veeamResults.filter(r => r.config.type === 'cloudconnect' && r.result.success);
  const vbrResults = veeamResults.filter(r => r.config.type === 'vbr' && r.result.success);
  const office365Results = veeamResults.filter(r => r.config.type === 'office365' && r.result.success);
  
  // Transform Cloud Connect data
  if (cloudConnectResults.length > 0) {
    const cloudConnectItems: ServiceItem[] = [];
    
    cloudConnectResults.forEach(result => {
      const repositories = result.result.data?.repositories || [];
      (repositories as Array<{ customer: string; name: string; usage: number; unit: string }>).forEach((repo) => {
        cloudConnectItems.push({
          name: `${repo.customer} - ${repo.name}`,
          currentUsage: repo.usage,
          unit: repo.unit === 'GB' ? 'GB' : 'TB',
          trend: Math.random() > 0.5 ? 'up' : 'down', // TODO: Calculate real trend
          changePercent: Math.round((Math.random() * 20 - 10) * 100) / 100
        });
      });
    });
    
    if (cloudConnectItems.length > 0) {
      categories.push({
        name: 'Veeam Cloud Connect',
        type: 'storage',
        customers: [], // Required property
        totalUsage: cloudConnectItems.reduce((sum, item) => {
          const usage = item.unit === 'TB' ? item.currentUsage * 1024 : item.currentUsage;
          return sum + usage;
        }, 0),
        unit: 'GB',
        items: cloudConnectItems
      });
    }
  }
  
  // Transform VBR data
  if (vbrResults.length > 0) {
    const vbrItems: ServiceItem[] = [];
    
    vbrResults.forEach(result => {
      const backupJobs = result.result.data?.backupJobs || [];
      (backupJobs as Array<{ name: string; size: number; unit: string; status: string }>).forEach((job) => {
        vbrItems.push({
          name: `${result.config.name} - ${job.name}`,
          currentUsage: job.size,
          unit: job.unit === 'GB' ? 'GB' : 'TB',
          trend: job.status === 'Success' ? 'up' : 'down',
          changePercent: Math.round((Math.random() * 15 - 5) * 100) / 100
        });
      });
    });
    
    if (vbrItems.length > 0) {
      categories.push({
        name: 'Veeam Backup & Replication',
        type: 'storage',
        customers: [], // Required property
        totalUsage: vbrItems.reduce((sum, item) => {
          const usage = item.unit === 'TB' ? item.currentUsage * 1024 : item.currentUsage;
          return sum + usage;
        }, 0),
        unit: 'GB',
        items: vbrItems
      });
    }
  }
  
  // Transform Office 365 data
  if (office365Results.length > 0) {
    const office365Items: ServiceItem[] = [];
    
    office365Results.forEach(result => {
      const organizations = result.result.data?.organizations || [];
      (organizations as Array<{ name: string; mailboxes: number; size: number; unit: string }>).forEach((org) => {
        office365Items.push({
          name: `${org.name} (${org.mailboxes} Mailboxes)`,
          currentUsage: org.size,
          unit: org.unit === 'GB' ? 'GB' : 'TB',
          trend: Math.random() > 0.3 ? 'up' : 'down',
          changePercent: Math.round((Math.random() * 25 - 10) * 100) / 100
        });
      });
    });
    
    if (office365Items.length > 0) {
      categories.push({
        name: 'Veeam for Office 365',
        type: 'storage',
        customers: [], // Required property
        totalUsage: office365Items.reduce((sum, item) => {
          const usage = item.unit === 'TB' ? item.currentUsage * 1024 : item.currentUsage;
          return sum + usage;
        }, 0),
        unit: 'GB',
        items: office365Items
      });
    }
  }
  
  return categories;
};

export const generateReportSummary = (categories: ServiceCategory[]) => {
  const totalStorage = categories
    .filter(cat => cat.type === 'storage')
    .reduce((sum, cat) => sum + (cat.totalUsage || 0), 0);
    
  const totalItems = categories.reduce((sum, cat) => sum + (cat.items?.length || 0), 0);
  
  return {
    totalStorage: Math.round(totalStorage * 100) / 100,
    totalStorageUnit: 'GB',
    totalServices: categories.length,
    totalItems,
    lastUpdated: new Date().toISOString()
  };
};
