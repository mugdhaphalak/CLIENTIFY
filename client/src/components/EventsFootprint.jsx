import React from 'react';
import { Tent } from 'lucide-react';

export default function EventsFootprint({ events = [] }) {
  const hasData = Array.isArray(events) && events.length > 0;

  return (
    <div className="bg-[#111b2d] border border-white/10 rounded-2xl p-6 h-full shadow-xl">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Tent className="w-6 h-6 text-fuchsia-400" />
        <h2 className="text-xl font-semibold text-white">Events Footprint</h2>
      </div>

      <div className="space-y-4">
        {hasData ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {events.map((evt, idx) => (
              <div key={idx} className="bg-[#0A1428]/40 border border-white/5 rounded-lg p-3">
                {Object.entries(evt).map(([key, value], i) => (
                  <div key={i} className="mb-1 last:mb-0">
                    <span className="text-[10px] text-fuchsia-400 uppercase font-bold tracking-wider block">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm text-slate-300">
                      {typeof value === 'object' ? JSON.stringify(value) : value}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* Professional Empty State */
          <div className="flex flex-col items-center justify-center py-12 opacity-40">
            <p className="text-slate-400 font-medium text-sm tracking-widest uppercase text-center px-4">
              No industry events currently indexed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}