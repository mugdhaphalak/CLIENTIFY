import React from 'react';
import { Swords } from 'lucide-react';

export default function CompetitorMapping({ competitors = [] }) {
  if (!competitors || competitors.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Swords className="w-6 h-6 text-rose-400" />
        <h2 className="text-xl font-semibold text-white">Competitor Mapping</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {competitors.map((comp, idx) => (
          <div key={idx} className="bg-[#0A1428]/60 border border-white/5 rounded-xl p-4 hover:border-rose-500/30 transition-colors">
            {Object.entries(comp).map(([key, value], i) => (
              <div key={i} className="mb-2 last:mb-0">
                <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider block mb-0.5">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-sm text-slate-300 font-medium">
                  {typeof value === 'object' ? JSON.stringify(value) : value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}