import React from 'react';
import { Activity, ListOrdered, BarChart2 } from 'lucide-react';

export default function OutreachTracking({ tracking }) {
  if (!tracking || Object.keys(tracking).length === 0) return null;

  const sequence = Array.isArray(tracking.sequence) ? tracking.sequence : [];
  const metrics = Array.isArray(tracking.metrics) ? tracking.metrics : [];

  return (
    <div className="bg-[#111b2d] border border-white/10 rounded-2xl p-6 shadow-xl w-full">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Activity className="w-6 h-6 text-[#00D4FF]" />
        {/* Updated Title Below */}
        <h2 className="text-xl font-semibold text-white">Outreach Tracking Logic</h2>
      </div>

      <div className="flex flex-col gap-6">
        {/* Sequence Section */}
        {sequence.length > 0 && (
          <div className="w-full">
            <h3 className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
              <ListOrdered className="w-3 h-3 text-[#00D4FF]" /> Planned Sequence
            </h3>
            <div className="flex flex-col gap-3">
              {sequence.map((step, idx) => (
                <div key={idx} className="bg-[#1a2638] border border-white/5 rounded-xl p-4 shadow-inner w-full">
                  <div className="text-[#00D4FF] font-bold text-xs mb-1 uppercase tracking-tighter">
                    Day {step.day ?? idx}:
                  </div>
                  <div className="text-slate-200 text-sm leading-snug">
                    {step.action || JSON.stringify(step)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics Section */}
        {metrics.length > 0 && (
          <div className="w-full">
            <h3 className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
              <BarChart2 className="w-3 h-3 text-[#00D4FF]" /> Target KPIs
            </h3>
            <div className="flex flex-col gap-3">
              {metrics.map((metric, idx) => (
                <div key={idx} className="bg-[#060e1a] border-l-4 border-[#00D4FF] rounded-r-lg p-3 flex justify-between items-center w-full">
                  <span className="text-slate-300 text-xs font-medium">{metric.name || 'Metric'}</span>
                  <span className="text-[#00D4FF] text-xs font-bold font-mono bg-[#00D4FF]/10 px-2 py-1 rounded">
                    {metric.target || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}