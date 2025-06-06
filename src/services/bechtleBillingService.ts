import { 
  BechtleMonthlyReport, 
  BechtleServiceCategory, 
  ServiceUsage, 
  BechtleCustomer,
  BECHTLE_SERVICE_CATEGORIES,
  DEFAULT_BECHTLE_TEMPLATE
} from '../types/bechtle-billing';
import { VeeamConfig } from '../types/veeam-api';
import { fetchAllVeeamData } from './veeamApiService';

export class BechtleBillingService {
  private static instance: BechtleBillingService;
  
  public static getInstance(): BechtleBillingService {
    if (!BechtleBillingService.instance) {
      BechtleBillingService.instance = new BechtleBillingService();
    }
    return BechtleBillingService.instance;
  }

  async generateMonthlyReport(
    configs: VeeamConfig[], 
    targetMonth: number, 
    targetYear: number
  ): Promise<BechtleMonthlyReport> {
    console.log(`Generating Bechtle monthly report for ${targetMonth}/${targetYear}`);
    
    const veeamData = await fetchAllVeeamData(configs);
    const reportId = `bechtle-${targetYear}-${String(targetMonth).padStart(2, '0')}`;
    
    const categories = this.transformVeeamDataToBechtle(veeamData);
    
    const report: BechtleMonthlyReport = {
      id: reportId,
      month: targetMonth,
      year: targetYear,
      capturedDate: new Date(),
      reportTitle: `${DEFAULT_BECHTLE_TEMPLATE.title} - ${this.getMonthName(targetMonth)} ${targetYear}`,
      categories,
      metadata: {
        totalCustomers: this.getTotalCustomers(categories),
        activeCustomers: this.getActiveCustomers(categories),
        removedCustomers: this.getRemovedCustomers(categories),
        generatedBy: 'Bechtle Cloud Report Generator'
      }
    };

    // Store report in localStorage for persistence
    this.saveReport(report);
    
    return report;
  }

  private transformVeeamDataToBechtle(veeamData: Array<{ config: VeeamConfig; result: VeeamAPIResponse }>): BechtleServiceCategory[] {
    const categories: BechtleServiceCategory[] = [];

    // Storage Categories
    categories.push({
      id: BECHTLE_SERVICE_CATEGORIES.STORAGE.BCLOUD_CONNECT.id,
      name: BECHTLE_SERVICE_CATEGORIES.STORAGE.BCLOUD_CONNECT.id,
      type: BECHTLE_SERVICE_CATEGORIES.STORAGE.BCLOUD_CONNECT.type,
      displayName: BECHTLE_SERVICE_CATEGORIES.STORAGE.BCLOUD_CONNECT.displayName,
      unit: BECHTLE_SERVICE_CATEGORIES.STORAGE.BCLOUD_CONNECT.unit,
      usages: this.extractCloudConnectUsage(veeamData)
    });

    categories.push({
      id: BECHTLE_SERVICE_CATEGORIES.STORAGE.VEEAM_O365_S3.id,
      name: BECHTLE_SERVICE_CATEGORIES.STORAGE.VEEAM_O365_S3.id,
      type: BECHTLE_SERVICE_CATEGORIES.STORAGE.VEEAM_O365_S3.type,
      displayName: BECHTLE_SERVICE_CATEGORIES.STORAGE.VEEAM_O365_S3.displayName,
      unit: BECHTLE_SERVICE_CATEGORIES.STORAGE.VEEAM_O365_S3.unit,
      usages: this.extractOffice365Usage(veeamData)
    });

    // Tape Categories  
    categories.push({
      id: BECHTLE_SERVICE_CATEGORIES.TAPE.VEEAM_BR_TAPE.id,
      name: BECHTLE_SERVICE_CATEGORIES.TAPE.VEEAM_BR_TAPE.id,
      type: BECHTLE_SERVICE_CATEGORIES.TAPE.VEEAM_BR_TAPE.type,
      displayName: BECHTLE_SERVICE_CATEGORIES.TAPE.VEEAM_BR_TAPE.displayName,
      unit: BECHTLE_SERVICE_CATEGORIES.TAPE.VEEAM_BR_TAPE.unit,
      usages: this.extractVBRTapeUsage(veeamData)
    });

    categories.push({
      id: BECHTLE_SERVICE_CATEGORIES.TAPE.CLOUD_CONNECT_TAPE.id,
      name: BECHTLE_SERVICE_CATEGORIES.TAPE.CLOUD_CONNECT_TAPE.id,
      type: BECHTLE_SERVICE_CATEGORIES.TAPE.CLOUD_CONNECT_TAPE.type,
      displayName: BECHTLE_SERVICE_CATEGORIES.TAPE.CLOUD_CONNECT_TAPE.displayName,
      unit: BECHTLE_SERVICE_CATEGORIES.TAPE.CLOUD_CONNECT_TAPE.unit,
      usages: this.extractCloudConnectTapeUsage(veeamData)
    });

    // Calculate total usage for each category
    categories.forEach(category => {
      category.totalUsage = category.usages.reduce((sum, usage) => sum + usage.usage, 0);
    });

    return categories;
  }

  private extractCloudConnectUsage(veeamData: Array<{ config: VeeamConfig; result: VeeamAPIResponse }>): ServiceUsage[] {
    const usages: ServiceUsage[] = [];
    
    veeamData.forEach(({ config, result }) => {
      if (config.type === 'cloudconnect' && result.success && result.data?.repositories) {
        (result.data.repositories as Array<{ customer: string; usage: number; unit: string }>).forEach((repo) => {
          usages.push({
            customerId: this.generateCustomerId(repo.customer),
            customerName: repo.customer,
            usage: this.convertToTB(repo.usage, repo.unit),
            unit: 'TB',
            status: 'active'
          });
        });
      }
    });

    return this.consolidateCustomerUsage(usages);
  }

  private extractOffice365Usage(veeamData: Array<{ config: VeeamConfig; result: VeeamAPIResponse }>): ServiceUsage[] {
    const usages: ServiceUsage[] = [];
    
    veeamData.forEach(({ config, result }) => {
      if (config.type === 'office365' && result.success && result.data?.organizations) {
        (result.data.organizations as Array<{ name: string; size: number }>).forEach((org) => {
          usages.push({
            customerId: this.generateCustomerId(org.name),
            customerName: org.name,
            usage: org.size,
            unit: 'GB',
            status: 'active'
          });
        });
      }
    });

    return this.consolidateCustomerUsage(usages);
  }

  private extractVBRTapeUsage(veeamData: Array<{ config: VeeamConfig; result: VeeamAPIResponse }>): ServiceUsage[] {
    const usages: ServiceUsage[] = [];
    
    veeamData.forEach(({ config, result }) => {
      if (config.type === 'vbr' && result.success && result.data?.backupJobs) {
        // Filter for tape jobs (this would need to be enhanced based on actual VBR API response)
        (result.data.backupJobs as Array<{ name: string; size: number; unit: string }>)
          .filter((job) => job.name.toLowerCase().includes('tape'))
          .forEach((job) => {
            usages.push({
              customerId: this.generateCustomerId(job.name),
              customerName: job.name,
              usage: this.convertToTB(job.size, job.unit),
              unit: 'TB',
              status: 'active'
            });
          });
      }
    });

    return this.consolidateCustomerUsage(usages);
  }

  private extractCloudConnectTapeUsage(veeamData: Array<{ config: VeeamConfig; result: VeeamAPIResponse }>): ServiceUsage[] {
    // This would extract tape usage from Cloud Connect servers
    // Implementation depends on specific API endpoints
    return [];
  }

  private consolidateCustomerUsage(usages: ServiceUsage[]): ServiceUsage[] {
    const consolidated = new Map<string, ServiceUsage>();
    
    usages.forEach(usage => {
      const existing = consolidated.get(usage.customerId);
      if (existing) {
        existing.usage += usage.usage;
      } else {
        consolidated.set(usage.customerId, { ...usage });
      }
    });

    return Array.from(consolidated.values()).sort((a, b) => 
      a.customerName.localeCompare(b.customerName)
    );
  }

  private convertToTB(value: number, unit: string): number {
    switch (unit.toUpperCase()) {
      case 'GB':
        return Math.round((value / 1024) * 100) / 100;
      case 'TB':
        return value;
      default:
        return value;
    }
  }

  private generateCustomerId(customerName: string): string {
    return customerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  private getTotalCustomers(categories: BechtleServiceCategory[]): number {
    const allCustomers = new Set<string>();
    categories.forEach(category => {
      category.usages.forEach(usage => allCustomers.add(usage.customerId));
    });
    return allCustomers.size;
  }

  private getActiveCustomers(categories: BechtleServiceCategory[]): number {
    const activeCustomers = new Set<string>();
    categories.forEach(category => {
      category.usages
        .filter(usage => usage.status === 'active')
        .forEach(usage => activeCustomers.add(usage.customerId));
    });
    return activeCustomers.size;
  }

  private getRemovedCustomers(categories: BechtleServiceCategory[]): number {
    const removedCustomers = new Set<string>();
    categories.forEach(category => {
      category.usages
        .filter(usage => usage.status === 'removed')
        .forEach(usage => removedCustomers.add(usage.customerId));
    });
    return removedCustomers.size;
  }

  private getMonthName(month: number): string {
    const months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return months[month - 1] || 'Unbekannt';
  }

  private saveReport(report: BechtleMonthlyReport): void {
    const reports = this.getStoredReports();
    reports[report.id] = report;
    localStorage.setItem('bechtle-reports', JSON.stringify(reports));
  }

  public getStoredReports(): Record<string, BechtleMonthlyReport> {
    const stored = localStorage.getItem('bechtle-reports');
    return stored ? JSON.parse(stored) : {};
  }

  public getReport(reportId: string): BechtleMonthlyReport | null {
    const reports = this.getStoredReports();
    return reports[reportId] || null;
  }

  public getAllReports(): BechtleMonthlyReport[] {
    const reports = this.getStoredReports();
    return Object.values(reports).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }

  public exportReportAsText(report: BechtleMonthlyReport): string {
    let output = `${report.reportTitle}\n`;
    output += `Hier die Daten für ${this.getMonthName(report.month)} (${DEFAULT_BECHTLE_TEMPLATE.capturedDateLabel} ${report.capturedDate.toLocaleDateString('de-DE')})\n\n`;

    // Storage categories
    const storageCategories = report.categories.filter(cat => cat.type === 'storage');
    if (storageCategories.length > 0) {
      output += `${DEFAULT_BECHTLE_TEMPLATE.categories.storage.title} ${DEFAULT_BECHTLE_TEMPLATE.categories.storage.subtitle}\n\n`;
      
      storageCategories.forEach(category => {
        output += `${category.displayName}\n`;
        category.usages.forEach(usage => {
          const statusNote = usage.status === 'removed' ? ' (entfernt)' : '';
          output += `${usage.customerName} ${usage.usage} ${usage.unit}${statusNote}\n`;
          if (usage.notes) {
            output += `${usage.notes}\n`;
          }
        });
        output += '\n';
      });
    }

    // Tape categories
    const tapeCategories = report.categories.filter(cat => cat.type === 'tape');
    if (tapeCategories.length > 0) {
      output += `${DEFAULT_BECHTLE_TEMPLATE.categories.tape.title} ${DEFAULT_BECHTLE_TEMPLATE.categories.tape.subtitle}\n\n`;
      
      tapeCategories.forEach(category => {
        output += `${category.displayName}\n`;
        category.usages.forEach(usage => {
          const statusNote = usage.status === 'removed' ? ' (entfernt)' : '';
          output += `${usage.customerName} ${usage.usage} ${usage.unit}${statusNote}\n`;
          if (usage.notes) {
            output += `${usage.notes}\n`;
          }
        });
        output += '\n';
      });
    }

    // Licensing categories
    const licensingCategories = report.categories.filter(cat => cat.type === 'licensing');
    if (licensingCategories.length > 0) {
      output += `${DEFAULT_BECHTLE_TEMPLATE.categories.licensing.title}\n\n`;
      
      licensingCategories.forEach(category => {
        output += `${category.displayName}\n`;
        category.usages.forEach(usage => {
          const statusNote = usage.status === 'removed' ? ' (entfernt)' : '';
          output += `${usage.customerName} ${usage.usage} ${usage.unit}${statusNote}\n`;
          if (usage.notes) {
            output += `${usage.notes}\n`;
          }
        });
        output += '\n';
      });
    }

    return output;
  }
}