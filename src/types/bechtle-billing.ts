export interface BechtleCustomer {
  id: string;
  name: string;
  email?: string;
  contactPerson?: string;
  status: 'active' | 'removed';
  removedDate?: Date;
  notes?: string;
}

export interface ServiceUsage {
  customerId: string;
  customerName: string;
  usage: number;
  unit: 'TB' | 'GB' | 'licenses';
  status: 'active' | 'removed';
  notes?: string;
}

export interface BechtleServiceCategory {
  id: string;
  name: string;
  type: 'storage' | 'tape' | 'licensing';
  displayName: string;
  usages: ServiceUsage[];
  totalUsage?: number;
  unit: string;
}

export interface BechtleMonthlyReport {
  id: string;
  month: number;
  year: number;
  capturedDate: Date;
  reportTitle: string;
  categories: BechtleServiceCategory[];
  metadata: {
    totalCustomers: number;
    activeCustomers: number;
    removedCustomers: number;
    generatedBy: string;
  };
}

export const BECHTLE_SERVICE_CATEGORIES = {
  STORAGE: {
    BCLOUD_CONNECT: {
      id: 'bcloud_connect',
      displayName: 'Bcloud Cloud Connect (Backup Copy Jobs)',
      type: 'storage' as const,
      unit: 'TB'
    },
    VEEAM_O365_S3: {
      id: 'veeam_o365_s3',
      displayName: 'Veeam O365 (S3)',
      type: 'storage' as const,
      unit: 'GB'
    },
    AZURE_CLOUD_CONNECT: {
      id: 'azure_cloud_connect',
      displayName: 'Azure/Cloud Connect Disk (Copy)',
      type: 'storage' as const,
      unit: 'TB'
    }
  },
  TAPE: {
    VEEAM_BR_TAPE: {
      id: 'veeam_br_tape',
      displayName: 'Veeam B & R TAPE (Copy)',
      type: 'tape' as const,
      unit: 'TB'
    },
    CLOUD_CONNECT_TAPE: {
      id: 'cloud_connect_tape',
      displayName: 'Cloud Connect TAPE (Copy)',
      type: 'tape' as const,
      unit: 'TB'
    }
  },
  LICENSING: {
    O365_VBR_CLOUD: {
      id: 'o365_vbr_cloud',
      displayName: 'O365 VBR CLOUD CONNECT',
      type: 'licensing' as const,
      unit: 'licenses'
    }
  }
} as const;

export interface BechtleReportTemplate {
  title: string;
  subtitle: string;
  capturedDateLabel: string;
  categories: {
    storage: {
      title: string;
      subtitle: string;
    };
    tape: {
      title: string;
      subtitle: string;
    };
    licensing: {
      title: string;
    };
  };
}

export const DEFAULT_BECHTLE_TEMPLATE: BechtleReportTemplate = {
  title: 'Bechtle Cloud Services - Monatlicher Verbrauchsbericht',
  subtitle: 'Veeam Cloud Dienstleistungen',
  capturedDateLabel: 'erfasst am',
  categories: {
    storage: {
      title: 'Speicher Verbrauch',
      subtitle: '(je Kunde)'
    },
    tape: {
      title: 'TAPE Verbrauch',
      subtitle: '(je Kunde)'
    },
    licensing: {
      title: 'Lizenzierung'
    }
  }
};