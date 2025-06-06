
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ServiceCategory } from '../types/reporting';

interface UsageChartProps {
  categories: ServiceCategory[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

const UsageChart: React.FC<UsageChartProps> = ({ categories }) => {
  // Prepare data for charts
  const storageData = categories
    .filter(cat => cat.type === 'storage')
    .map(cat => ({
      name: cat.name.split(' ')[0], // Shortened name for chart
      value: cat.customers
        .filter(customer => customer.status !== 'removed')
        .reduce((sum, customer) => {
          // Convert GB to TB
          if (customer.unit === 'GB') {
            return sum + (customer.usage / 1024);
          }
          return sum + customer.usage;
        }, 0)
    }))
    .filter(item => item.value > 0);

  const tapeData = categories
    .filter(cat => cat.type === 'tape')
    .map(cat => ({
      name: cat.name.split(' ')[0], // Shortened name for chart
      value: cat.customers
        .filter(customer => customer.status !== 'removed')
        .reduce((sum, customer) => {
          // Convert GB to TB
          if (customer.unit === 'GB') {
            return sum + (customer.usage / 1024);
          }
          return sum + customer.usage;
        }, 0)
    }))
    .filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {storageData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Storage Verbrauch (TB)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={storageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} TB`, 'Verbrauch']} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {tapeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              TAPE Verbrauch (TB)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tapeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(2)}TB`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tapeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} TB`, 'Verbrauch']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsageChart;
