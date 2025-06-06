
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VeeamConfig, VeeamOffice365Config } from '../types/veeam-api';
import { Edit, Trash2, Server, Shield, Cloud } from 'lucide-react';

interface VeeamConfigListProps {
  configs: VeeamConfig[];
  onEdit: (config: VeeamConfig) => void;
  onDelete: (configId: string) => void;
}

const VeeamConfigList: React.FC<VeeamConfigListProps> = ({ configs, onEdit, onDelete }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cloudconnect':
        return <Cloud className="h-4 w-4" />;
      case 'vbr':
        return <Server className="h-4 w-4" />;
      case 'office365':
        return <Shield className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'cloudconnect':
        return 'Cloud Connect';
      case 'vbr':
        return 'Backup & Replication';
      case 'office365':
        return 'Office 365';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cloudconnect':
        return 'bg-blue-100 text-blue-800';
      case 'vbr':
        return 'bg-green-100 text-green-800';
      case 'office365':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (configs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Server className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Konfigurationen vorhanden</h3>
          <p className="text-gray-600">
            Fügen Sie Ihre erste Veeam-Server-Konfiguration hinzu, um zu beginnen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Konfigurierte Server</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.map((config) => (
          <Card key={config.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(config.type)}
                  <CardTitle className="text-lg">{config.name}</CardTitle>
                </div>
                <Badge className={getTypeColor(config.type)}>
                  {getTypeName(config.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="font-medium">URL:</span> {config.url}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Port:</span> {config.port}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Benutzer:</span> {config.username}
                </div>
                {config.type === 'office365' && (config as VeeamOffice365Config).organizationName && (
                  <div className="text-sm">
                    <span className="font-medium">Organisation:</span> {(config as VeeamOffice365Config).organizationName}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={config.enabled ? "default" : "secondary"}>
                    {config.enabled ? "Aktiv" : "Inaktiv"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(config)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Bearbeiten
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(config.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VeeamConfigList;
