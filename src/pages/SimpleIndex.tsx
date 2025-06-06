import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const SimpleIndex = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Bechtle Cloud Report Generator
          </h1>
          <p className="text-gray-600">
            Automatisierte Verbrauchsberichte für Veeam Cloud Services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                onClick={() => setActiveTab('config')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚙️ Konfiguration
                <Badge variant="outline">Schritt 1</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Veeam Server konfigurieren und Verbindungen testen
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveTab('customers')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👥 Kunden
                <Badge variant="outline">Schritt 2</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Kundendaten verwalten und organisieren
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveTab('reports')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Reports
                <Badge variant="outline">Schritt 3</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Monatliche Verbrauchsberichte generieren
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">1</Badge>
                <span>Gehe zu <strong>/configuration</strong> und füge deine Veeam Server hinzu</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">2</Badge>
                <span>Verwalte deine Kunden im Kunden-Bereich</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">3</Badge>
                <span>Generiere automatisierte monatliche Reports</span>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <a href="/configuration">Jetzt konfigurieren</a>
              </Button>
              <Button variant="outline" onClick={() => alert('Vollständige App wird geladen...')}>
                Vollständige App
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Status: ✅ Running | Port: 8080/8081 | Build: erfolgreich</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleIndex;