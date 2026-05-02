import React from 'react';
import { Megaphone } from 'lucide-react';

export default function BrandActivity({ activity = [] }) {
  const hasData = Array.isArray(activity) && activity.length > 0;

  return (
    <div className="bg-[#111b2d] border border-white/10 rounded-2xl p-6 h-full shadow-xl">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Megaphone className="w-6 h-6 text-violet-400" />
        <h2 className="text-xl font-semibold text-white">Latest Activity</h2>
      </div>

      <div className="space-y-4">
        {hasData ? (
          activity.map((act, idx) => (
            <div key={idx} className="bg-black/20 border-l-2 border-violet-500 rounded-r-lg p-3">
              {Object.entries(act).map(([key, value], i) => (
                <div key={i} className="mb-1 last:mb-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold mr-2">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="text-sm text-slate-200">
                    {typeof value === 'object' ? JSON.stringify(value) : value}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          /* Professional Empty State */
          <div className="flex flex-col items-center justify-center py-12 opacity-40">
            <p className="text-slate-400 font-medium text-sm tracking-widest uppercase text-center px-4">
              No recent activity detected for this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}