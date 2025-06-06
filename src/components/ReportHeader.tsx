
import React from 'react';
import { Building2, Calendar, Download, Clock, Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ReportHeaderProps {
  month: string;
  year: number;
  capturedDate: string;
  onExportPDF: () => void;
  onExportXLSX: () => void;
  onScheduleExport: () => void;
  onRefreshData?: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  month,
  year,
  capturedDate,
  onExportPDF,
  onExportXLSX,
  onScheduleExport,
  onRefreshData
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Veeam Cloud Usage Report
              </h1>
              <p className="text-gray-600">Bechtle AG - {month} {year}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Erfasst am: {capturedDate}</span>
          </div>

          <div className="flex gap-2">
            {onRefreshData && (
              <Button
                variant="outline"
                onClick={onRefreshData}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Aktualisieren
              </Button>
            )}

            <Link to="/configuration">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Konfiguration
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onExportPDF}>
                  PDF herunterladen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportXLSX}>
                  XLSX herunterladen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onScheduleExport}>
                  <Clock className="h-4 w-4 mr-2" />
                  Export planen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
