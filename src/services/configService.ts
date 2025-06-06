
import { VeeamConfig } from '../types/veeam-api';

const CONFIG_STORAGE_KEY = 'veeam-configs';

export const getVeeamConfigs = (): VeeamConfig[] => {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading configs:', error);
    return [];
  }
};

export const saveVeeamConfig = (config: VeeamConfig): void => {
  try {
    const configs = getVeeamConfigs();
    const existingIndex = configs.findIndex(c => c.id === config.id);
    
    if (existingIndex >= 0) {
      configs[existingIndex] = config;
    } else {
      configs.push(config);
    }
    
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configs));
  } catch (error) {
    console.error('Error saving config:', error);
    throw new Error('Konfiguration konnte nicht gespeichert werden');
  }
};

export const deleteVeeamConfig = (configId: string): void => {
  try {
    const configs = getVeeamConfigs();
    const filteredConfigs = configs.filter(c => c.id !== configId);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(filteredConfigs));
  } catch (error) {
    console.error('Error deleting config:', error);
    throw new Error('Konfiguration konnte nicht gelöscht werden');
  }
};

export const getVeeamConfigById = (configId: string): VeeamConfig | null => {
  const configs = getVeeamConfigs();
  return configs.find(c => c.id === configId) || null;
};

export const getActiveConfigs = (): VeeamConfig[] => {
  return getVeeamConfigs().filter(config => config.enabled);
};

export const getStoredConfigs = getVeeamConfigs;
