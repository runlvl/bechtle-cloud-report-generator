
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ReportingDashboard from '../components/ReportingDashboard';
import { BechtleBillingDashboard } from '../components/BechtleBillingDashboard';
import { CustomerManagement } from '../components/CustomerManagement';
import { VeeamConfig } from '../types/veeam-api';
import { getStoredConfigs } from '../services/configService';

const Index = () => {
  const [veeamConfigs, setVeeamConfigs] = useState<VeeamConfig[]>([]);

  useEffect(() => {
    const configs = getStoredConfigs();
    setVeeamConfigs(configs);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs defaultValue="bechtle" className="w-full">
        <div className="border-b bg-white">
          <div className="container mx-auto">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="bechtle">Bechtle Billing</TabsTrigger>
              <TabsTrigger value="customers">Kunden</TabsTrigger>
              <TabsTrigger value="dashboard">Standard Dashboard</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="bechtle">
          <BechtleBillingDashboard veeamConfigs={veeamConfigs} />
        </TabsContent>
        
        <TabsContent value="customers">
          <CustomerManagement />
        </TabsContent>
        
        <TabsContent value="dashboard">
          <ReportingDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
