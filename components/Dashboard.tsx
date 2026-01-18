
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Customer, CustomerStatus } from '../types';

interface DashboardProps {
  customers: Customer[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ customers }) => {
  const statusCounts = customers.reduce((acc: any, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  const healthData = customers.map(c => ({
    name: c.name,
    score: c.healthScore
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1">
        <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Customer Health Scores</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={healthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Customers" value={customers.length} />
          <StatCard 
            label="Avg. Health" 
            value={Math.round(customers.reduce((a, b) => a + b.healthScore, 0) / customers.length)} 
          />
          <StatCard 
            label="At Risk" 
            value={customers.filter(c => c.status === CustomerStatus.CHURN_RISK).length} 
            color="text-amber-600"
          />
          <StatCard 
            label="Lifetime Value" 
            value={`$${customers.reduce((a, b) => a + b.lifetimeValue, 0).toLocaleString()}`} 
            color="text-emerald-600"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color = "text-slate-900" }: { label: string, value: string | number, color?: string }) => (
  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
    <p className="text-sm text-slate-500 font-medium">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

export default Dashboard;
