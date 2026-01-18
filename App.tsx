
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Customer, AgentAction, CustomerStatus } from './types';
import { INITIAL_CUSTOMERS } from './constants';
import { analyzeCustomerBehavior, decideNextAction } from './services/geminiService';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import AgentActivity from './components/AgentActivity';

const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'portfolio'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const lowerQuery = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.company.toLowerCase().includes(lowerQuery) ||
      c.email.toLowerCase().includes(lowerQuery)
    );
  }, [customers, searchQuery]);

  const runAgentCycle = useCallback(async (customer: Customer) => {
    setIsProcessing(true);
    try {
      // 1. Analysis Step
      const analysis = await analyzeCustomerBehavior(customer);
      
      // 2. Decision Step
      const decision = await decideNextAction(customer, analysis);

      // 3. Update State
      const newAction: AgentAction = {
        id: Math.random().toString(36).substr(2, 9),
        customerId: customer.id,
        timestamp: new Date().toISOString(),
        thoughtProcess: decision.thoughtProcess || 'Analyzing patterns...',
        actionType: decision.actionType as any,
        content: decision.content || 'Action executed.',
        status: 'SUCCESS'
      };

      setActions(prev => [newAction, ...prev]);

      // 4. Update Customer in Local List
      setCustomers(prev => prev.map(c => 
        c.id === customer.id 
          ? { ...c, status: analysis.prediction as CustomerStatus, healthScore: analysis.healthScore } 
          : c
      ));

      if (selectedCustomer?.id === customer.id) {
        setSelectedCustomer(prev => prev ? ({ ...prev, status: analysis.prediction as CustomerStatus, healthScore: analysis.healthScore }) : null);
      }

    } catch (error) {
      console.error("Agent cycle failed:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedCustomer]);

  const simulateNewEvent = (customerId: string) => {
    const types: any[] = ['LOGIN', 'FEATURE_USE', 'SUPPORT_TICKET', 'FEEDBACK'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newEvent = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          type: randomType,
          metadata: { note: 'Simulated activity' }
        };
        const updated = { ...c, events: [...c.events, newEvent] };
        // Trigger agent to react to this new event
        runAgentCycle(updated);
        return updated;
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">CustomerMind</h1>
              <p className="text-xs text-slate-500 font-medium">Autonomous Lifecycle Manager</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Intelligence
            </button>
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'portfolio' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Operations
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {isProcessing && (
              <div className="flex items-center gap-2 text-indigo-600">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-widest">Agent Thinking...</span>
              </div>
            )}
            <div className="hidden sm:block px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-bold tracking-tighter uppercase">
              v2.5 Core Active
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
        
        {/* Left Column: Primary View */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'dashboard' ? (
            <section className="animate-in fade-in duration-500">
              <div className="mb-6 flex items-end justify-between px-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Overview</h2>
                  <p className="text-slate-500 text-sm">Aggregated health and risk metrics across the portfolio.</p>
                </div>
              </div>
              <Dashboard customers={customers} />
            </section>
          ) : (
            <section className="animate-in slide-in-from-left duration-500">
               <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between px-2 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Customer Portfolio</h2>
                  <p className="text-slate-500 text-sm">Search and manage individual customer relationships.</p>
                </div>
                <div className="relative w-full md:w-72">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, email or company..."
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <CustomerList 
                  customers={filteredCustomers} 
                  selectedId={selectedCustomer?.id}
                  onSelect={setSelectedCustomer}
                />
              </div>
            </section>
          )}

          {/* Detailed Customer View (Conditional) */}
          {selectedCustomer && (
            <div className="bg-white rounded-3xl p-8 border border-indigo-100 shadow-xl shadow-indigo-100/20 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedCustomer.name}</h3>
                    <p className="text-slate-500 font-medium">{selectedCustomer.company} • Joined {new Date(selectedCustomer.joinedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Health Score</div>
                  <div className={`text-4xl font-black ${selectedCustomer.healthScore > 70 ? 'text-emerald-500' : selectedCustomer.healthScore > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {selectedCustomer.healthScore}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="text-xs font-bold text-slate-400 uppercase mb-3">Recent Activity</div>
                   <div className="space-y-3">
                      {selectedCustomer.events.slice(-3).reverse().map(e => (
                        <div key={e.id} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          <div className="text-sm text-slate-600">
                            <span className="font-bold">{e.type}</span>
                            <div className="text-[10px] opacity-50">{new Date(e.timestamp).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                   <div className="text-xs font-bold text-slate-400 uppercase mb-3">Simulation</div>
                   <button 
                    onClick={() => simulateNewEvent(selectedCustomer.id)}
                    disabled={isProcessing}
                    className="w-full bg-white hover:bg-slate-900 hover:text-white text-slate-900 border border-slate-200 py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    Generate Random Activity
                  </button>
                  <p className="text-[10px] text-slate-400 mt-3 text-center">Triggers the Agentic AI to re-evaluate lifecycle state.</p>
                </div>

                <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col justify-center">
                   <div className="text-xs font-bold text-indigo-400 uppercase mb-3">Agent Directive</div>
                   <div className="text-sm font-medium text-indigo-900 italic">
                     "CustomerMind is currently monitoring for engagement drift. No immediate high-risk signals detected."
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Agent Console */}
        <div className="lg:col-span-4 h-[calc(100vh-12rem)] sticky top-32">
          <AgentActivity actions={actions} />
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-6 text-center">
        <p className="text-sm text-slate-400 font-medium">CustomerMind • Enterprise Lifecycle Autopilot • &copy; 2024</p>
      </footer>
    </div>
  );
};

export default App;
