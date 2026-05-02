import React from 'react';
import { BarChart3, Globe } from 'lucide-react';

export default function MarketOverview({ overview, market }) {
  // Helper function to render either a string or a structured object beautifully
  const renderContent = (data) => {
    if (!data) return <p className="text-slate-500 italic">No data available.</p>;
    
    // If the backend sent a simple string, render a paragraph
    if (typeof data === 'string') {
      return <p className="text-sm text-slate-300 leading-relaxed">{data}</p>;
    }

    // If the backend sent an object, render a high-end grid
    if (typeof data === 'object') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="bg-white/5 border border-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
              <div className="text-[10px] text-[#00D4FF] uppercase font-bold tracking-wider mb-1">
                {/* Replaces underscores with spaces for clean labels */}
                {key.replace(/_/g, ' ')} 
              </div>
              <div className="text-sm text-white font-medium">
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Globe className="w-6 h-6 text-[#00D4FF]" />
        <h2 className="text-xl font-semibold text-white">Market & Overview</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">Company Overview</h3>
          <div className="bg-[#0A1428]/50 p-4 rounded-xl border border-white/5 shadow-inner">
            {renderContent(overview)}
          </div>
        </div>
        
        <div>
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
            <BarChart3 className="w-4 h-4 text-[#00D4FF]" /> Market Position
          </h3>
          <div className="bg-[#0A1428]/50 p-4 rounded-xl border border-white/5 shadow-inner">
            {renderContent(market)}
          </div>
        </div>
      </div>
    </div>
  );
}