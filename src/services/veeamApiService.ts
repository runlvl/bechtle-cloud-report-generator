
import { VeeamAPIResponse, VeeamConfig } from '../types/veeam-api';

interface TestConnectionParams {
  type: 'cloudconnect' | 'vbr' | 'office365';
  url: string;
  username: string;
  password: string;
  port?: number;
}

// Base64 encode credentials for basic auth
const encodeCredentials = (username: string, password: string): string => {
  return btoa(`${username}:${password}`);
};

// Common headers for API requests
const getApiHeaders = (username: string, password: string) => {
  return {
    'Authorization': `Basic ${encodeCredentials(username, password)}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

export const testVeeamConnection = async (params: TestConnectionParams): Promise<VeeamAPIResponse> => {
  try {
    console.log('Testing connection to:', params.url);
    
    const baseUrl = `${params.url}:${params.port || getDefaultPort(params.type)}`;
    let testEndpoint = '';
    
    // Different test endpoints for each Veeam product
    switch (params.type) {
      case 'cloudconnect':
        testEndpoint = '/api/v1/serverInfo';
        break;
      case 'vbr':
        testEndpoint = '/api/v1/serverInfo';
        break;
      case 'office365':
        testEndpoint = '/api/v3/organizations';
        break;
    }
    
    const response = await fetch(`${baseUrl}${testEndpoint}`, {
      method: 'GET',
      headers: getApiHeaders(params.username, params.password),
      mode: 'cors'
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: { status: 'connected', version: data.productVersion || '12.0' }
      };
    } else {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verbindung zum Server konnte nicht hergestellt werden'
    };
  }
};

export const fetchVeeamCloudConnectData = async (config: VeeamConfig): Promise<VeeamAPIResponse> => {
  try {
    console.log('Fetching Cloud Connect data from:', config.url);
    
    const baseUrl = `${config.url}:${config.port || 6180}`;
    const headers = getApiHeaders(config.username, config.password);
    
    // Fetch tenant data
    const tenantsResponse = await fetch(`${baseUrl}/api/v1/tenants`, {
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!tenantsResponse.ok) {
      throw new Error(`Failed to fetch tenants: ${tenantsResponse.statusText}`);
    }
    
    const tenants = await tenantsResponse.json();
    
    // Fetch quota usage for each tenant
    const repositories = await Promise.all(
      tenants.data?.map(async (tenant: { instanceUid: string; name: string; tenantName: string }) => {
        try {
          const quotaResponse = await fetch(`${baseUrl}/api/v1/tenants/${tenant.instanceUid}/quotas`, {
            method: 'GET',
            headers,
            mode: 'cors'
          });
          
          if (quotaResponse.ok) {
            const quotaData = await quotaResponse.json();
            const usedSpace = quotaData.data?.[0]?.usedSpace || 0;
            
            return {
              name: tenant.name || 'Unknown Repository',
              usage: Math.round((usedSpace / (1024 * 1024 * 1024)) * 100) / 100, // Convert to GB
              unit: 'GB',
              customer: tenant.tenantName || 'Unknown Customer'
            };
          }
          return null;
        } catch (error) {
          console.warn(`Failed to fetch quota for tenant ${tenant.name}:`, error);
          return null;
        }
      }) || []
    );
    
    return {
      success: true,
      data: {
        repositories: repositories.filter(repo => repo !== null)
      }
    };
  } catch (error) {
    console.error('Cloud Connect API error:', error);
    return {
      success: false,
      error: 'Fehler beim Abrufen der Cloud Connect Daten: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler')
    };
  }
};

export const fetchVeeamVBRData = async (config: VeeamConfig): Promise<VeeamAPIResponse> => {
  try {
    console.log('Fetching VBR data from:', config.url);
    
    const baseUrl = `${config.url}:${config.port || 9419}`;
    const headers = getApiHeaders(config.username, config.password);
    
    // Fetch backup jobs
    const jobsResponse = await fetch(`${baseUrl}/api/v1/backupJobs`, {
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!jobsResponse.ok) {
      throw new Error(`Failed to fetch backup jobs: ${jobsResponse.statusText}`);
    }
    
    const jobs = await jobsResponse.json();
    
    // Fetch job sessions for size information
    const backupJobs = await Promise.all(
      jobs.data?.map(async (job: { id: string; name: string }) => {
        try {
          const sessionsResponse = await fetch(`${baseUrl}/api/v1/backupJobs/${job.id}/backupSessions`, {
            method: 'GET',
            headers,
            mode: 'cors'
          });
          
          if (sessionsResponse.ok) {
            const sessions = await sessionsResponse.json();
            const latestSession = sessions.data?.[0];
            const dataSize = latestSession?.dataSize || 0;
            
            return {
              name: job.name || 'Unknown Job',
              size: Math.round((dataSize / (1024 * 1024 * 1024)) * 100) / 100, // Convert to GB
              unit: 'GB',
              status: latestSession?.result || 'Unknown'
            };
          }
          return null;
        } catch (error) {
          console.warn(`Failed to fetch sessions for job ${job.name}:`, error);
          return null;
        }
      }) || []
    );
    
    return {
      success: true,
      data: {
        backupJobs: backupJobs.filter(job => job !== null)
      }
    };
  } catch (error) {
    console.error('VBR API error:', error);
    return {
      success: false,
      error: 'Fehler beim Abrufen der VBR Daten: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler')
    };
  }
};

export const fetchVeeamOffice365Data = async (config: VeeamConfig): Promise<VeeamAPIResponse> => {
  try {
    console.log('Fetching Office 365 data from:', config.url);
    
    const baseUrl = `${config.url}:${config.port || 443}`;
    const headers = getApiHeaders(config.username, config.password);
    
    // Fetch organizations
    const orgsResponse = await fetch(`${baseUrl}/api/v3/organizations`, {
      method: 'GET',
      headers,
      mode: 'cors'
    });
    
    if (!orgsResponse.ok) {
      throw new Error(`Failed to fetch organizations: ${orgsResponse.statusText}`);
    }
    
    const orgs = await orgsResponse.json();
    
    // Fetch backup data for each organization
    const organizations = await Promise.all(
      orgs.data?.map(async (org: { id: string; name: string }) => {
        try {
          const backupResponse = await fetch(`${baseUrl}/api/v3/organizations/${org.id}/backupData`, {
            method: 'GET',
            headers,
            mode: 'cors'
          });
          
          if (backupResponse.ok) {
            const backupData = await backupResponse.json();
            const totalSize = backupData.data?.totalSize || 0;
            const mailboxCount = backupData.data?.mailboxCount || 0;
            
            return {
              name: org.name || 'Unknown Organization',
              mailboxes: mailboxCount,
              size: Math.round((totalSize / (1024 * 1024 * 1024)) * 100) / 100, // Convert to GB
              unit: 'GB'
            };
          }
          return null;
        } catch (error) {
          console.warn(`Failed to fetch backup data for org ${org.name}:`, error);
          return null;
        }
      }) || []
    );
    
    return {
      success: true,
      data: {
        organizations: organizations.filter(org => org !== null)
      }
    };
  } catch (error) {
    console.error('Office 365 API error:', error);
    return {
      success: false,
      error: 'Fehler beim Abrufen der Office 365 Daten: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler')
    };
  }
};

export const fetchAllVeeamData = async (configs: VeeamConfig[]): Promise<Array<{ config: VeeamConfig; result: VeeamAPIResponse }>> => {
  console.log('Fetching data from all configured Veeam servers...');
  
  const activeConfigs = configs.filter(config => config.enabled);
  
  if (activeConfigs.length === 0) {
    console.warn('No active Veeam configurations found');
    return [];
  }
  
  const results = await Promise.allSettled(
    activeConfigs.map(async (config) => {
      switch (config.type) {
        case 'cloudconnect':
          return { config, result: await fetchVeeamCloudConnectData(config) };
        case 'vbr':
          return { config, result: await fetchVeeamVBRData(config) };
        case 'office365':
          return { config, result: await fetchVeeamOffice365Data(config) };
        default:
          return { config, result: { success: false, error: 'Unknown config type' } };
      }
    })
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Failed to fetch data for config ${index}:`, result.reason);
      return { 
        config: activeConfigs[index], 
        result: { success: false, error: result.reason?.message || 'Unknown error' } 
      };
    }
  });
};

const getDefaultPort = (type: string) => {
  switch (type) {
    case 'cloudconnect': return 6180;
    case 'vbr': return 9419;
    case 'office365': return 443;
    default: return 9419;
  }
};
