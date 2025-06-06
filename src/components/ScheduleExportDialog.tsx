import React, { useState } from 'react';
import { Calendar, Clock, FileText, FileSpreadsheet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface ScheduleExportDialogProps {
  open: boolean;
  onClose: () => void;
}

const ScheduleExportDialog: React.FC<ScheduleExportDialogProps> = ({
  open,
  onClose
}) => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'xlsx'>('pdf');
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [dayOfMonth, setDayOfMonth] = useState('5');
  const [time, setTime] = useState('09:00');
  const [emailNotification, setEmailNotification] = useState(true);

  const handleSchedule = () => {
    console.log('Scheduling export:', {
      format: exportFormat,
      frequency,
      dayOfMonth: frequency === 'monthly' ? dayOfMonth : null,
      time,
      emailNotification
    });

    toast({
      title: "Export geplant",
      description: `${exportFormat.toUpperCase()}-Export wurde erfolgreich geplant.`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Export automatisieren
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Export-Format</Label>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-colors ${
                  exportFormat === 'pdf' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setExportFormat('pdf')}
              >
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <span className="font-medium">PDF</span>
                </CardContent>
              </Card>
              <Card 
                className={`cursor-pointer transition-colors ${
                  exportFormat === 'xlsx' ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setExportFormat('xlsx')}
              >
                <CardContent className="p-4 text-center">
                  <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <span className="font-medium">XLSX</span>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Häufigkeit</Label>
            <Select value={frequency} onValueChange={(value: 'monthly' | 'weekly' | 'daily') => setFrequency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monatlich</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
                <SelectItem value="daily">Täglich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequency === 'monthly' && (
            <div className="space-y-2">
              <Label>Tag des Monats</Label>
              <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}.
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Uhrzeit</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return (
                    <SelectItem key={hour} value={`${hour}:00`}>
                      {hour}:00
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="email-notification" 
              checked={emailNotification}
              onCheckedChange={(checked) => setEmailNotification(checked === true)}
            />
            <Label htmlFor="email-notification">
              E-Mail-Benachrichtigung nach Export senden
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSchedule}>
            <Calendar className="h-4 w-4 mr-2" />
            Export planen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleExportDialog;
