
export interface VeeamServerConfig {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  port?: number;
  enabled: boolean;
}

export interface VeeamCloudConnectConfig extends VeeamServerConfig {
  type: 'cloudconnect';
}

export interface VeeamVBRConfig extends VeeamServerConfig {
  type: 'vbr';
}

export interface VeeamOffice365Config extends VeeamServerConfig {
  type: 'office365';
  organizationName?: string;
}

export type VeeamConfig = VeeamCloudConnectConfig | VeeamVBRConfig | VeeamOffice365Config;

export interface VeeamAPIResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}
