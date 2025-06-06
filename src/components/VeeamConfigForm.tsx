
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VeeamConfig, VeeamOffice365Config } from '../types/veeam-api';
import { testVeeamConnection } from '../services/veeamApiService';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface VeeamConfigFormProps {
  config?: VeeamConfig | null;
  onSave: (config: VeeamConfig) => void;
  onCancel: () => void;
}

const VeeamConfigForm: React.FC<VeeamConfigFormProps> = ({ config, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'cloudconnect' as 'cloudconnect' | 'vbr' | 'office365',
    url: '',
    username: '',
    password: '',
    port: 9419,
    enabled: true,
    organizationName: ''
  });
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (config) {
      setFormData({
        id: config.id,
        name: config.name,
        type: config.type,
        url: config.url,
        username: config.username,
        password: config.password,
        port: config.port || 9419,
        enabled: config.enabled,
        organizationName: config.type === 'office365' ? (config as VeeamOffice365Config).organizationName || '' : ''
      });
    } else {
      setFormData(prev => ({ ...prev, id: `veeam-${Date.now()}` }));
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const configToSave: VeeamConfig = {
      id: formData.id,
      name: formData.name,
      type: formData.type,
      url: formData.url,
      username: formData.username,
      password: formData.password,
      port: formData.port,
      enabled: formData.enabled,
      ...(formData.type === 'office365' && { organizationName: formData.organizationName })
    } as VeeamConfig;

    onSave(configToSave);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setConnectionStatus('idle');
    
    try {
      const result = await testVeeamConnection({
        type: formData.type,
        url: formData.url,
        username: formData.username,
        password: formData.password,
        port: formData.port
      });
      
      if (result.success) {
        setConnectionStatus('success');
        toast({
          title: "Verbindung erfolgreich",
          description: "Die Verbindung zum Veeam-Server konnte hergestellt werden.",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Verbindungsfehler",
          description: result.error || "Die Verbindung konnte nicht hergestellt werden.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Verbindungsfehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const getDefaultPort = (type: string) => {
    switch (type) {
      case 'cloudconnect': return 6180;
      case 'vbr': return 9419;
      case 'office365': return 443;
      default: return 9419;
    }
  };

  const handleTypeChange = (type: 'cloudconnect' | 'vbr' | 'office365') => {
    setFormData(prev => ({
      ...prev,
      type,
      port: getDefaultPort(type)
    }));
    setConnectionStatus('idle');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`cursor-pointer transition-colors ${formData.type === 'cloudconnect' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardHeader className="pb-3" onClick={() => handleTypeChange('cloudconnect')}>
            <CardTitle className="text-sm flex items-center justify-between">
              Veeam Cloud Connect
              {formData.type === 'cloudconnect' && <Badge>Ausgewählt</Badge>}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className={`cursor-pointer transition-colors ${formData.type === 'vbr' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardHeader className="pb-3" onClick={() => handleTypeChange('vbr')}>
            <CardTitle className="text-sm flex items-center justify-between">
              Veeam Backup & Replication
              {formData.type === 'vbr' && <Badge>Ausgewählt</Badge>}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className={`cursor-pointer transition-colors ${formData.type === 'office365' ? 'ring-2 ring-blue-500' : ''}`}>
          <CardHeader className="pb-3" onClick={() => handleTypeChange('office365')}>
            <CardTitle className="text-sm flex items-center justify-between">
              Veeam for Office 365
              {formData.type === 'office365' && <Badge>Ausgewählt</Badge>}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="z.B. Produktions-Server"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Server URL</label>
          <Input
            type="text"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://veeam-server.company.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Benutzername</label>
          <Input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            placeholder="admin"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Passwort</label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Port</label>
          <Input
            type="number"
            value={formData.port}
            onChange={(e) => setFormData(prev => ({ ...prev, port: parseInt(e.target.value) || getDefaultPort(formData.type) }))}
            placeholder={getDefaultPort(formData.type).toString()}
          />
        </div>
      </div>

      {formData.type === 'office365' && (
        <div>
          <label className="block text-sm font-medium mb-2">Organisation (optional)</label>
          <Input
            type="text"
            value={formData.organizationName}
            onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
            placeholder="company.onmicrosoft.com"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleTestConnection}
          disabled={testing || !formData.url || !formData.username || !formData.password}
        >
          {testing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {connectionStatus === 'success' && <CheckCircle className="h-4 w-4 mr-2 text-green-600" />}
          {connectionStatus === 'error' && <XCircle className="h-4 w-4 mr-2 text-red-600" />}
          Verbindung testen
        </Button>
        
        {connectionStatus === 'success' && (
          <span className="text-sm text-green-600">Verbindung erfolgreich</span>
        )}
        {connectionStatus === 'error' && (
          <span className="text-sm text-red-600">Verbindung fehlgeschlagen</span>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button type="submit">
          {config ? 'Aktualisieren' : 'Speichern'}
        </Button>
      </div>
    </form>
  );
};

export default VeeamConfigForm;
