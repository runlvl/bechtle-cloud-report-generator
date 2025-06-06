
import React, { useState, useEffect } from 'react';
import ReportHeader from './ReportHeader';
import ServiceCategoryCard from './ServiceCategoryCard';
import UsageChart from './UsageChart';
import ScheduledExportsTable from './ScheduledExportsTable';
import ScheduleExportDialog from './ScheduleExportDialog';
import LoadingSpinner from './LoadingSpinner';
import { toast } from '@/hooks/use-toast';
import { getActiveConfigs } from '../services/configService';
import { fetchAllVeeamData } from '../services/veeamApiService';
import { transformVeeamDataToReportFormat, generateReportSummary } from '../services/dataTransformService';
import { ServiceCategory } from '../types/reporting';

const ReportingDashboard: React.FC = () => {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editingExportId, setEditingExportId] = useState<string | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const loadVeeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const activeConfigs = getActiveConfigs();
      
      if (activeConfigs.length === 0) {
        setCategories([]);
        setError('Keine aktiven Veeam-Konfigurationen gefunden. Bitte konfigurieren Sie zunächst Ihre Veeam-Server.');
        return;
      }
      
      console.log('Loading data from', activeConfigs.length, 'active configurations...');
      
      const veeamResults = await fetchAllVeeamData(activeConfigs);
      const transformedCategories = transformVeeamDataToReportFormat(veeamResults);
      
      setCategories(transformedCategories);
      setLastUpdated(new Date().toLocaleString('de-DE'));
      
      const summary = generateReportSummary(transformedCategories);
      console.log('Report summary:', summary);
      
      if (transformedCategories.length === 0) {
        setError('Keine Daten von den konfigurierten Veeam-Servern erhalten. Überprüfen Sie die Verbindungseinstellungen.');
      } else {
        toast({
          title: "Daten aktualisiert",
          description: `${summary.totalItems} Services von ${summary.totalServices} Kategorien geladen.`,
        });
      }
      
    } catch (error) {
      console.error('Error loading Veeam data:', error);
      setError('Fehler beim Laden der Veeam-Daten: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
      toast({
        title: "Fehler beim Laden der Daten",
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVeeamData();
  }, []);

  const handleRefreshData = () => {
    loadVeeamData();
  };

  const handleExportPDF = () => {
    console.log('Exporting as PDF...');
    toast({
      title: "PDF-Export gestartet",
      description: "Der PDF-Export wird vorbereitet...",
    });
    // TODO: Implement actual PDF export logic
  };

  const handleExportXLSX = () => {
    console.log('Exporting as XLSX...');
    toast({
      title: "XLSX-Export gestartet",
      description: "Der Excel-Export wird vorbereitet...",
    });
    // TODO: Implement actual XLSX export logic
  };

  const handleScheduleExport = () => {
    setEditingExportId(null);
    setScheduleDialogOpen(true);
  };

  const handleEditExport = (exportId: string) => {
    setEditingExportId(exportId);
    setScheduleDialogOpen(true);
  };

  const currentDate = new Date();
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const storageCategories = categories.filter(cat => cat.type === 'storage');
  const tapeCategories = categories.filter(cat => cat.type === 'tape');
  const licensingCategories = categories.filter(cat => cat.type === 'licensing');

  if (loading) {
    return <LoadingSpinner message="Lade Veeam-Daten..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <ReportHeader
          month={monthNames[currentDate.getMonth()]}
          year={currentDate.getFullYear()}
          capturedDate={lastUpdated || 'Nie'}
          onExportPDF={handleExportPDF}
          onExportXLSX={handleExportXLSX}
          onScheduleExport={handleScheduleExport}
          onRefreshData={handleRefreshData}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Fehler beim Laden der Daten</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Exports Overview */}
        <div className="mb-8">
          <ScheduledExportsTable onEditExport={handleEditExport} />
        </div>

        {categories.length > 0 && <UsageChart categories={categories} />}

        {/* Storage Services */}
        {storageCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Storage Verbrauch</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {storageCategories.map((category, index) => (
                <ServiceCategoryCard key={index} category={category} />
              ))}
            </div>
          </div>
        )}

        {/* TAPE Services */}
        {tapeCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">TAPE Verbrauch</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tapeCategories.map((category, index) => (
                <ServiceCategoryCard key={index} category={category} />
              ))}
            </div>
          </div>
        )}

        {/* Licensing */}
        {licensingCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Licensing</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {licensingCategories.map((category, index) => (
                <ServiceCategoryCard key={index} category={category} />
              ))}
            </div>
          </div>
        )}

        {categories.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Daten verfügbar</h3>
              <p className="text-gray-600 mb-4">
                Konfigurieren Sie zunächst Ihre Veeam-Server, um Nutzungsdaten anzuzeigen.
              </p>
              <a
                href="/configuration"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Zur Konfiguration
              </a>
            </div>
          </div>
        )}

        <ScheduleExportDialog
          open={scheduleDialogOpen}
          onClose={() => setScheduleDialogOpen(false)}
        />
      </div>
    </div>
  );
};

export default ReportingDashboard;
