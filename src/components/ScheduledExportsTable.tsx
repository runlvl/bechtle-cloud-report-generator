
import React, { useState } from 'react';
import { Edit, Trash2, Clock, FileText, FileSpreadsheet } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface ScheduledExport {
  id: string;
  format: 'pdf' | 'xlsx';
  frequency: 'monthly' | 'weekly' | 'daily';
  dayOfMonth?: string;
  time: string;
  emailNotification: boolean;
  createdAt: string;
  nextExecution: string;
}

interface ScheduledExportsTableProps {
  onEditExport: (exportId: string) => void;
}

const ScheduledExportsTable: React.FC<ScheduledExportsTableProps> = ({
  onEditExport
}) => {
  // Sample data - in a real app this would come from a backend
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([
    {
      id: '1',
      format: 'pdf',
      frequency: 'monthly',
      dayOfMonth: '5',
      time: '09:00',
      emailNotification: true,
      createdAt: '2024-01-15',
      nextExecution: '2024-02-05'
    },
    {
      id: '2',
      format: 'xlsx',
      frequency: 'weekly',
      time: '14:00',
      emailNotification: false,
      createdAt: '2024-01-20',
      nextExecution: '2024-01-27'
    }
  ]);

  const handleDeleteExport = (exportId: string) => {
    setScheduledExports(prev => prev.filter(exp => exp.id !== exportId));
    toast({
      title: "Export gelöscht",
      description: "Der geplante Export wurde erfolgreich gelöscht.",
    });
  };

  const getFrequencyDisplay = (export_: ScheduledExport) => {
    switch (export_.frequency) {
      case 'monthly':
        return `Monatlich am ${export_.dayOfMonth}.`;
      case 'weekly':
        return 'Wöchentlich';
      case 'daily':
        return 'Täglich';
      default:
        return export_.frequency;
    }
  };

  const getFormatIcon = (format: 'pdf' | 'xlsx') => {
    return format === 'pdf' 
      ? <FileText className="h-4 w-4 text-red-500" />
      : <FileSpreadsheet className="h-4 w-4 text-green-500" />;
  };

  if (scheduledExports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Geplante Exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Keine geplanten Exports vorhanden.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Geplante Exports ({scheduledExports.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Format</TableHead>
              <TableHead>Häufigkeit</TableHead>
              <TableHead>Uhrzeit</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Nächste Ausführung</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledExports.map((export_) => (
              <TableRow key={export_.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getFormatIcon(export_.format)}
                    <span className="font-medium">{export_.format.toUpperCase()}</span>
                  </div>
                </TableCell>
                <TableCell>{getFrequencyDisplay(export_)}</TableCell>
                <TableCell>{export_.time}</TableCell>
                <TableCell>
                  <Badge variant={export_.emailNotification ? "default" : "secondary"}>
                    {export_.emailNotification ? "Ja" : "Nein"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(export_.nextExecution).toLocaleDateString('de-DE')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditExport(export_.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Export löschen?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Möchten Sie diesen geplanten Export wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteExport(export_.id)}>
                            Löschen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ScheduledExportsTable;
