
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import VeeamConfigForm from '../components/VeeamConfigForm';
import VeeamConfigList from '../components/VeeamConfigList';
import { VeeamConfig } from '../types/veeam-api';
import { getVeeamConfigs, saveVeeamConfig, deleteVeeamConfig } from '../services/configService';
import { toast } from '@/hooks/use-toast';

const Configuration: React.FC = () => {
  const [configs, setConfigs] = useState<VeeamConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<VeeamConfig | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = () => {
    const savedConfigs = getVeeamConfigs();
    setConfigs(savedConfigs);
  };

  const handleSaveConfig = (config: VeeamConfig) => {
    try {
      saveVeeamConfig(config);
      loadConfigs();
      setShowForm(false);
      setEditingConfig(null);
      toast({
        title: "Konfiguration gespeichert",
        description: `${config.name} wurde erfolgreich gespeichert.`,
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Konfiguration konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const handleEditConfig = (config: VeeamConfig) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleDeleteConfig = (configId: string) => {
    try {
      deleteVeeamConfig(configId);
      loadConfigs();
      toast({
        title: "Konfiguration gelöscht",
        description: "Die Konfiguration wurde erfolgreich entfernt.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Konfiguration konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const handleNewConfig = () => {
    setEditingConfig(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zum Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Veeam API Konfiguration</h1>
          </div>
          <p className="text-gray-600">
            Konfigurieren Sie Ihre Veeam-Server für die automatische Datenabfrage.
          </p>
        </div>

        {showForm ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingConfig ? 'Konfiguration bearbeiten' : 'Neue Konfiguration hinzufügen'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VeeamConfigForm
                config={editingConfig}
                onSave={handleSaveConfig}
                onCancel={() => {
                  setShowForm(false);
                  setEditingConfig(null);
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="mb-6">
            <Button onClick={handleNewConfig} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Neue Konfiguration hinzufügen
            </Button>
          </div>
        )}

        <VeeamConfigList
          configs={configs}
          onEdit={handleEditConfig}
          onDelete={handleDeleteConfig}
        />
      </div>
    </div>
  );
};

export default Configuration;
