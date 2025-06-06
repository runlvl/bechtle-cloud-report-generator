
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceCategory } from '../types/reporting';
import { HardDrive, Archive, Key } from 'lucide-react';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
}

const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ category }) => {
  const getIcon = () => {
    switch (category.type) {
      case 'storage':
        return <HardDrive className="h-5 w-5" />;
      case 'tape':
        return <Archive className="h-5 w-5" />;
      case 'licensing':
        return <Key className="h-5 w-5" />;
      default:
        return <HardDrive className="h-5 w-5" />;
    }
  };

  const getTypeColor = () => {
    switch (category.type) {
      case 'storage':
        return 'bg-blue-100 text-blue-800';
      case 'tape':
        return 'bg-purple-100 text-purple-800';
      case 'licensing':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatUsage = (usage: number, unit: string) => {
    if (usage === 0) return '0';
    return `${usage.toLocaleString('de-DE')} ${unit}`;
  };

  const totalUsage = category.customers
    .filter(customer => customer.status !== 'removed')
    .reduce((sum, customer) => {
      // Convert GB to TB for total calculation
      if (customer.unit === 'GB') {
        return sum + (customer.usage / 1024);
      }
      return sum + customer.usage;
    }, 0);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getIcon()}
            <CardTitle className="text-lg">{category.name}</CardTitle>
          </div>
          <Badge className={getTypeColor()}>
            {category.type.toUpperCase()}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Gesamt: {totalUsage.toFixed(2)} TB
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {category.customers.map((customer, index) => (
            <div 
              key={index} 
              className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
                customer.status === 'removed' 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{customer.customerName}</div>
                {customer.note && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {customer.note}
                  </div>
                )}
              </div>
              <div className={`text-sm font-mono ${
                customer.status === 'removed' ? 'text-red-600' : 'text-foreground'
              }`}>
                {customer.status === 'removed' ? 'Entfernt' : formatUsage(customer.usage, customer.unit)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCategoryCard;
