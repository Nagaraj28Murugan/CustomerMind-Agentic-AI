
import React from 'react';
import { Customer, CustomerStatus } from '../types';

interface CustomerListProps {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
  selectedId?: string;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, onSelect, selectedId }) => {
  const getStatusStyle = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.ACTIVE: return 'bg-emerald-100 text-emerald-700';
      case CustomerStatus.CHURN_RISK: return 'bg-amber-100 text-amber-700';
      case CustomerStatus.ONBOARDING: return 'bg-blue-100 text-blue-700';
      case CustomerStatus.UPSELL_READY: return 'bg-purple-100 text-purple-700';
      case CustomerStatus.CHURNED: return 'bg-slate-200 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-slate-900 font-semibold">No customers found</h3>
        <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-700">Customer Portfolio ({customers.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Health</th>
              <th className="px-6 py-3 text-right">LTV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr 
                key={c.id} 
                onClick={() => onSelect(c)}
                className={`cursor-pointer transition-colors hover:bg-slate-50 ${selectedId === c.id ? 'bg-indigo-50/50' : ''}`}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.company}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getStatusStyle(c.status)}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${c.healthScore > 70 ? 'bg-emerald-500' : c.healthScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${c.healthScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{c.healthScore}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  ${c.lifetimeValue.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
