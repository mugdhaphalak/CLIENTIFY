import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Watchouts({ watchouts = [] }) {
  if (!watchouts || watchouts.length === 0) return null;

  const getSeverityStyles = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'high': 
        return 'border-t-red-500 bg-red-500/10 text-red-400';
      case 'medium': 
        return 'border-t-amber-500 bg-amber-500/10 text-amber-400';
      case 'low': 
        // Restored green styling for low severity
        return 'border-t-emerald-500 bg-emerald-500/10 text-emerald-400';
      default: 
        return 'border-t-slate-500 bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="bg-[#111b2d] border border-white/10 rounded-3xl p-8 shadow-xl w-full">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
        <ShieldAlert className="w-6 h-6 text-red-400" />
        <h2 className="text-2xl font-bold text-white tracking-tight uppercase italic">Strategic Watchouts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {watchouts.map((risk, index) => (
          <div 
            key={index} 
            className={`border border-white/5 border-t-4 rounded-2xl p-6 transition-all hover:scale-[1.02] ${getSeverityStyles(risk.severity)}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-extrabold text-white text-lg leading-tight pr-4 uppercase tracking-tight">
                {risk.title || 'Risk Factor'}
              </h3>
              <span className="text-[10px] font-black tracking-widest uppercase px-2 py-1 bg-white/10 rounded-md">
                {risk.severity || 'Unknown'}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {risk.description || 'No detailed analysis provided.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}