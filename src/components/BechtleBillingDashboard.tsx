import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar, Download, FileText, Mail, Settings, Users } from 'lucide-react';
import { BechtleBillingService } from '../services/bechtleBillingService';
import { PDFExportService } from '../services/pdfExportService';
import { BechtleMonthlyReport, BechtleServiceCategory } from '../types/bechtle-billing';
import { VeeamConfig } from '../types/veeam-api';

interface BechtleBillingDashboardProps {
  veeamConfigs: VeeamConfig[];
}

export const BechtleBillingDashboard: React.FC<BechtleBillingDashboardProps> = ({ veeamConfigs }) => {
  const [reports, setReports] = useState<BechtleMonthlyReport[]>([]);
  const [currentReport, setCurrentReport] = useState<BechtleMonthlyReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const billingService = BechtleBillingService.getInstance();
  const pdfService = PDFExportService.getInstance();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const storedReports = billingService.getAllReports();
    setReports(storedReports);
    if (storedReports.length > 0) {
      setCurrentReport(storedReports[0]);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const report = await billingService.generateMonthlyReport(veeamConfigs, selectedMonth, selectedYear);
      setCurrentReport(report);
      loadReports();
    } catch (error) {
      console.error('Fehler beim Generieren des Reports:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportText = () => {
    if (!currentReport) return;
    
    const textContent = billingService.exportReportAsText(currentReport);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bechtle-report-${currentReport.year}-${String(currentReport.month).padStart(2, '0')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!currentReport) return;
    await pdfService.exportReportToPDF(currentReport);
  };

  const handleExportExcel = () => {
    if (!currentReport) return;
    pdfService.exportReportAsExcel(currentReport);
  };

  const getMonthName = (month: number): string => {
    const months = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return months[month - 1] || 'Unbekannt';
  };

  const formatUsage = (usage: number, unit: string): string => {
    return `${usage.toLocaleString('de-DE', { maximumFractionDigits: 2 })} ${unit}`;
  };

  const renderServiceCategory = (category: BechtleServiceCategory) => (
    <div key={category.id} className="mb-6">
      <h4 className="font-semibold text-lg mb-3">{category.displayName}</h4>
      <div className="space-y-2">
        {category.usages.map((usage, index) => (
          <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <span className="font-medium">{usage.customerName}</span>
              {usage.status === 'removed' && (
                <Badge variant="destructive" className="text-xs">Entfernt</Badge>
              )}
            </div>
            <span className="font-mono">{formatUsage(usage.usage, usage.unit)}</span>
          </div>
        ))}
        {usage.notes && (
          <p className="text-sm text-gray-600 italic ml-3">{usage.notes}</p>
        )}
      </div>
      {category.totalUsage !== undefined && (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="flex justify-between font-semibold">
            <span>Gesamt:</span>
            <span>{formatUsage(category.totalUsage, category.unit)}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bechtle Cloud Services</h1>
          <p className="text-gray-600 mt-2">Monatliche Verbrauchsberichte und Abrechnungen</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            <FileText className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generiere...' : 'Neuer Report'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generation Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Report Generierung
            </CardTitle>
            <CardDescription>
              Erstellen Sie einen neuen monatlichen Verbrauchsbericht
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Monat</label>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {getMonthName(i + 1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Jahr</label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>{year}</option>
                    );
                  })}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Report Historie
            </CardTitle>
            <CardDescription>
              Zuvor generierte Berichte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    currentReport?.id === report.id 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentReport(report)}
                >
                  <div className="font-medium">
                    {getMonthName(report.month)} {report.year}
                  </div>
                  <div className="text-sm text-gray-600">
                    {report.capturedDate.toLocaleDateString('de-DE')}
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Noch keine Berichte vorhanden
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {currentReport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Statistiken
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {currentReport.metadata.totalCustomers}
                  </div>
                  <div className="text-sm text-gray-600">Gesamt Kunden</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentReport.metadata.activeCustomers}
                  </div>
                  <div className="text-sm text-gray-600">Aktive Kunden</div>
                </div>
              </div>
              {currentReport.metadata.removedCustomers > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {currentReport.metadata.removedCustomers}
                  </div>
                  <div className="text-sm text-gray-600">Entfernte Kunden</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Report Display */}
      {currentReport && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{currentReport.reportTitle}</CardTitle>
                <CardDescription>
                  Erfasst am {currentReport.capturedDate.toLocaleDateString('de-DE')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportText}>
                  <Download className="w-4 h-4 mr-2" />
                  Text
                </Button>
                <Button variant="outline" onClick={handleExportPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" onClick={handleExportExcel}>
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Storage Services */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">
                Speicher Verbrauch (je Kunde)
              </h3>
              {currentReport.categories
                .filter(cat => cat.type === 'storage')
                .map(renderServiceCategory)}
            </div>

            <Separator className="my-6" />

            {/* Tape Services */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-green-700">
                TAPE Verbrauch (je Kunde)
              </h3>
              {currentReport.categories
                .filter(cat => cat.type === 'tape')
                .map(renderServiceCategory)}
            </div>

            {/* Licensing */}
            {currentReport.categories.filter(cat => cat.type === 'licensing').length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-purple-700">
                    Lizenzierung
                  </h3>
                  {currentReport.categories
                    .filter(cat => cat.type === 'licensing')
                    .map(renderServiceCategory)}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};