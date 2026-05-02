import React, { useState } from 'react';
import { Send, Copy, Check, Mail, MessageSquare } from 'lucide-react';

export default function PersonalizedOutreach({ outreach }) {
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!outreach || Object.keys(outreach).length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-900/40 to-[#0A1428] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
      <div className="flex items-center gap-3 mb-6 border-b border-emerald-500/20 pb-4">
        <Send className="w-6 h-6 text-emerald-400" />
        {/* Updated Title Below */}
        <h2 className="text-xl font-semibold text-white">Personalized Outreach</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/30 border border-white/5 rounded-xl p-5 relative group">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-400 uppercase mb-3">
            <Mail className="w-4 h-4" /> Email Subject
          </h3>
          <p className="text-sm text-slate-200 font-medium italic">
            "{outreach.email_subject || 'No subject generated.'}"
          </p>
          <button onClick={() => handleCopy(outreach.email_subject, 'email')} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-md text-white transition-colors cursor-pointer">
            {copied === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-xl p-5 relative group">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#00D4FF] uppercase mb-3">
            <MessageSquare className="w-4 h-4" /> LinkedIn Hook
          </h3>
          <p className="text-sm text-slate-200 font-medium">
            "{outreach.linkedin_message || 'No message generated.'}"
          </p>
          <button onClick={() => handleCopy(outreach.linkedin_message, 'linkedin')} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-md text-white transition-colors cursor-pointer">
            {copied === 'linkedin' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}