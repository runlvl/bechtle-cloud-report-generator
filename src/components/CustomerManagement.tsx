import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Plus, Edit, Trash2, UserCheck, UserX, Mail } from 'lucide-react';
import { BechtleCustomer } from '../types/bechtle-billing';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<BechtleCustomer[]>([]);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<BechtleCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    const stored = localStorage.getItem('bechtle-customers');
    if (stored) {
      const parsedCustomers = JSON.parse(stored).map((customer: BechtleCustomer & { removedDate?: string }) => ({
        ...customer,
        removedDate: customer.removedDate ? new Date(customer.removedDate) : undefined
      }));
      setCustomers(parsedCustomers);
    }
  };

  const saveCustomers = (updatedCustomers: BechtleCustomer[]) => {
    localStorage.setItem('bechtle-customers', JSON.stringify(updatedCustomers));
    setCustomers(updatedCustomers);
  };

  const handleAddCustomer = (customerData: Partial<BechtleCustomer>) => {
    const newCustomer: BechtleCustomer = {
      id: `customer_${Date.now()}`,
      name: customerData.name || '',
      email: customerData.email,
      contactPerson: customerData.contactPerson,
      status: 'active',
      notes: customerData.notes
    };

    const updatedCustomers = [...customers, newCustomer];
    saveCustomers(updatedCustomers);
    setIsAddingCustomer(false);
  };

  const handleEditCustomer = (customerData: Partial<BechtleCustomer>) => {
    if (!editingCustomer) return;

    const updatedCustomer: BechtleCustomer = {
      ...editingCustomer,
      ...customerData
    };

    const updatedCustomers = customers.map(c => 
      c.id === editingCustomer.id ? updatedCustomer : c
    );
    saveCustomers(updatedCustomers);
    setEditingCustomer(null);
  };

  const handleToggleCustomerStatus = (customerId: string) => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          status: customer.status === 'active' ? 'removed' : 'active',
          removedDate: customer.status === 'active' ? new Date() : undefined
        };
      }
      return customer;
    });
    saveCustomers(updatedCustomers);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('Sind Sie sicher, dass Sie diesen Kunden löschen möchten?')) {
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      saveCustomers(updatedCustomers);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const removedCustomers = customers.filter(c => c.status === 'removed').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Kunden-Verwaltung</h1>
          <p className="text-gray-600 mt-2">Verwalten Sie Ihre Bechtle Cloud Service Kunden</p>
        </div>
        <CustomerDialog
          open={isAddingCustomer}
          onOpenChange={setIsAddingCustomer}
          onSave={handleAddCustomer}
          trigger={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Neuer Kunde
            </Button>
          }
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{customers.length}</div>
              <div className="text-sm text-gray-600 mt-1">Gesamt Kunden</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{activeCustomers}</div>
              <div className="text-sm text-gray-600 mt-1">Aktive Kunden</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{removedCustomers}</div>
              <div className="text-sm text-gray-600 mt-1">Entfernte Kunden</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Kunden suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Kunden-Liste</CardTitle>
          <CardDescription>
            Übersicht aller registrierten Kunden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{customer.name}</h3>
                    <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
                      {customer.status === 'active' ? 'Aktiv' : 'Entfernt'}
                    </Badge>
                  </div>
                  <div className="mt-1 space-y-1">
                    {customer.email && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </p>
                    )}
                    {customer.contactPerson && (
                      <p className="text-sm text-gray-600">
                        Ansprechpartner: {customer.contactPerson}
                      </p>
                    )}
                    {customer.removedDate && (
                      <p className="text-sm text-red-600">
                        Entfernt am: {customer.removedDate.toLocaleDateString('de-DE')}
                      </p>
                    )}
                    {customer.notes && (
                      <p className="text-sm text-gray-500 italic">{customer.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleCustomerStatus(customer.id)}
                  >
                    {customer.status === 'active' ? (
                      <UserX className="w-4 h-4" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                  </Button>
                  <CustomerDialog
                    open={editingCustomer?.id === customer.id}
                    onOpenChange={(open) => setEditingCustomer(open ? customer : null)}
                    onSave={handleEditCustomer}
                    customer={customer}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCustomer(customer.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredCustomers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Keine Kunden gefunden' : 'Noch keine Kunden vorhanden'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (customer: Partial<BechtleCustomer>) => void;
  customer?: BechtleCustomer;
  trigger: React.ReactNode;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  customer,
  trigger
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactPerson: '',
    notes: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || '',
        contactPerson: customer.contactPerson || '',
        notes: customer.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        contactPerson: '',
        notes: ''
      });
    }
  }, [customer, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    onSave({
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      contactPerson: formData.contactPerson.trim() || undefined,
      notes: formData.notes.trim() || undefined
    });
    
    setFormData({ name: '', email: '', contactPerson: '', notes: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {customer ? 'Kunde bearbeiten' : 'Neuer Kunde'}
            </DialogTitle>
            <DialogDescription>
              {customer ? 'Bearbeiten Sie die Kundendaten' : 'Fügen Sie einen neuen Kunden hinzu'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Kundenname"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="kunde@example.com"
              />
            </div>
            <div>
              <Label htmlFor="contactPerson">Ansprechpartner</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Max Mustermann"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notizen</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Zusätzliche Informationen..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">
              {customer ? 'Speichern' : 'Hinzufügen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};