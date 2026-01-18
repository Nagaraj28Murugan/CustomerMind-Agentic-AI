
import React from 'react';
import { AgentAction } from '../types';

interface AgentActivityProps {
  actions: AgentAction[];
}

const AgentActivity: React.FC<AgentActivityProps> = ({ actions }) => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-xl border border-slate-800 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-mono text-sm uppercase tracking-widest text-emerald-500">Autonomous Agent Log</h3>
        </div>
        <span className="text-[10px] opacity-50 font-mono">Real-time Decision Engine</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {actions.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic text-sm font-mono">
            Waiting for behavioral triggers...
          </div>
        ) : (
          actions.map((action) => (
            <div key={action.id} className="border-l-2 border-emerald-500/30 pl-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400">[{action.actionType}]</span>
                <span className="text-[10px] opacity-40 font-mono">{new Date(action.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <p className="text-[11px] text-slate-400 font-mono mb-2 uppercase opacity-60">Thought Process:</p>
                <p className="text-sm leading-relaxed text-slate-300 italic">"{action.thoughtProcess}"</p>
              </div>
              <div className="text-xs text-slate-400 bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                <span className="font-bold mr-2">ACTION:</span>
                {action.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgentActivity;
