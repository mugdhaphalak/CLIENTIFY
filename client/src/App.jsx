import React, { useState } from 'react';
import { Search, Loader2, Target, BarChart3, Users, Shield, Lightbulb, CheckCircle2, FileText, ShieldAlert } from 'lucide-react';

// Components
import PitchCommandCenter from './components/PitchCommandCenter';
import Watchouts from './components/Watchouts';
import DecisionMakers from './components/DecisionMakers';
import MarketOverview from './components/MarketOverview';
import CompetitorMapping from './components/CompetitorMapping';
import BrandActivity from './components/BrandActivity';
import EventsFootprint from './components/EventsFootprint';
import OutreachTracking from './components/OutreachTracking';
import PersonalizedOutreach from './components/PersonalizedOutreach';

export default function App() {
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  
  const [activeTab, setActiveTab] = useState('strategy');

  // Check if the current data is flagged as a fake/invalid entity
  const isInvalidEntity = data && (data.is_real === false || data.validation?.is_real === false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!company || !category) return;
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, category }),
      });

      // Try to parse the JSON first, even if the status is 400 (Backend might send validation data with a 400 status)
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        if (!response.ok) throw new Error(`Status ${response.status}: Analysis failed.`);
        throw new Error("Invalid data format received from server.");
      }
      
      const isFake = result.is_real === false || result.validation?.is_real === false;

      // If it failed AND it's not our intended validation response, throw a real error
      if (!response.ok && !isFake) {
        throw new Error(result.error || `Status ${response.status}: Analysis failed.`);
      }

      if (result && typeof result === 'object') {
        setData(result);
        setActiveTab('strategy');
      } else {
        throw new Error("Invalid data format received from server.");
      }
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A1428] text-slate-200 font-sans overflow-hidden">
      
      {/* --- TRANSLUCENT MOVEMENT BACKGROUND (z-0) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/10 filter blur-[120px] opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-blue-700/20 filter blur-[120px] opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-[#00D4FF]/5 filter blur-[150px] opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- FOREGROUND CONTENT WRAPPER (z-10) --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="border-b border-white/10 bg-[#0A1428]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setData(null)}>
              <Target className="w-8 h-8 text-[#00D4FF]" />
              <span className="text-3xl font-black text-white uppercase italic">
                Client<span className="text-[#00D4FF]">ify</span>
              </span>
            </div>
            
            {/* ONLY SHOW TABS IF DATA IS VALID */}
            {data && !isInvalidEntity && (
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 overflow-x-auto custom-scrollbar">
                <button 
                  onClick={() => setActiveTab('strategy')}
                  className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'strategy' ? 'bg-[#00D4FF] text-[#0A1428]' : 'text-slate-400 hover:text-white'}`}
                >
                  <BarChart3 className="w-4 h-4" /> STRATEGY
                </button>
                <button 
                  onClick={() => setActiveTab('execution')}
                  className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'execution' ? 'bg-[#00D4FF] text-[#0A1428]' : 'text-slate-400 hover:text-white'}`}
                >
                  <Users className="w-4 h-4" /> EXECUTION
                </button>
                <button 
                  onClick={() => setActiveTab('competitors')}
                  className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'competitors' ? 'bg-[#00D4FF] text-[#0A1428]' : 'text-slate-400 hover:text-white'}`}
                >
                  <Shield className="w-4 h-4" /> COMPETITORS
                </button>
                <button 
                  onClick={() => setActiveTab('conclusion')}
                  className={`flex items-center whitespace-nowrap gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'conclusion' ? 'bg-emerald-400 text-[#0A1428]' : 'text-slate-400 hover:text-emerald-400'}`}
                >
                  <Lightbulb className="w-4 h-4" /> CONCLUSION
                </button>
              </div>
            )}

            <div className="hidden lg:block text-sm font-black tracking-[0.25em] text-[#00D4FF] uppercase">
              Smarter client acquisition starts here.
            </div>
          </div>
        </nav>

        <main className="flex-grow max-w-7xl mx-auto px-6 py-8 w-full">
          {!data && (
            <div className="max-w-xl mx-auto mt-24">
              <h1 className="text-4xl font-light text-white text-center mb-8">Initiate <span className="font-bold text-[#00D4FF]">Strategic Analysis</span></h1>
              <form onSubmit={handleAnalyze} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Target Entity</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:border-[#00D4FF] transition-all outline-none" placeholder="e.g., Amazon" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Market Category</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:border-[#00D4FF] transition-all outline-none" placeholder="e.g., Cloud Computing" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#00D4FF] to-blue-500 text-[#0A1428] font-black py-5 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all active:scale-[0.98]">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    {loading ? 'PROCESSING SIGNALS...' : 'GENERATE INTELLIGENCE'}
                  </button>
                  {error && <p className="mt-4 text-red-400 text-sm text-center font-bold bg-red-400/10 py-2 rounded-lg">{error}</p>}
                </div>
              </form>
            </div>
          )}

          {data && (
            <div className="space-y-8">
              
              {/* --- NEW: INVALID ENTITY DASHBOARD VIEW --- */}
              {isInvalidEntity ? (
                 <div className="flex flex-col items-center justify-center pt-16 animate-in fade-in duration-700">
                   <div className="bg-red-500/5 border border-red-500/20 p-12 rounded-[2.5rem] max-w-2xl text-center shadow-2xl backdrop-blur-sm">
                      <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                         <ShieldAlert className="w-12 h-12 text-red-400" />
                      </div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">Target Validation Failed</h2>
                      <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        The intelligence engine was unable to verify <strong className="text-white">{company}</strong> as a valid commercial organization. Strategic analysis has been aborted to preserve data integrity.
                      </p>
                      
                      <div className="bg-black/50 border border-white/5 rounded-xl p-4 mb-10 inline-block text-left">
                        <span className="text-red-400 font-bold uppercase tracking-widest text-[10px] block mb-1">System Diagnostic:</span>
                        <span className="text-white font-mono text-sm capitalize">{data.reason || data.validation?.reason || "Unverified Entity"}</span>
                      </div>

                      <div className="block">
                        <button 
                          onClick={() => setData(null)}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-8 rounded-xl transition-all uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                        >
                          Initiate New Search
                        </button>
                      </div>
                   </div>
                 </div>
              ) : (
                /* --- NORMAL DASHBOARD RENDER --- */
                <>
                  {/* PAGE 1: STRATEGY */}
                  {activeTab === 'strategy' && (
                    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
                      <PitchCommandCenter conclusion={data.conclusion} market={data.market} />
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 flex flex-col gap-8">
                          <MarketOverview overview={data.overview} market={data.market} />
                          <PersonalizedOutreach outreach={data.outreach} />
                        </div>
                        <div className="lg:col-span-4">
                          <BrandActivity activity={data.activity} />
                        </div>
                        <div className="lg:col-span-12">
                          <Watchouts watchouts={data.watchouts} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PAGE 2: EXECUTION */}
                  {activeTab === 'execution' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-700">
                      <div className="lg:col-span-4 sticky top-24">
                        <DecisionMakers people={data.people?.decision_makers || data.people || []} outreach={data.outreach || {}} />
                      </div>
                      <div className="lg:col-span-8 flex flex-col gap-8">
                        <OutreachTracking tracking={data.tracking || {}} />
                        <EventsFootprint events={data.events || []} />
                      </div>
                    </div>
                  )}

                  {/* PAGE 3: COMPETITORS */}
                  {activeTab === 'competitors' && (
                    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
                      <div className="bg-gradient-to-r from-[#00D4FF]/10 to-transparent p-8 rounded-3xl border border-[#00D4FF]/20">
                         <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Competitive Intelligence</h1>
                         <p className="text-slate-400 text-sm max-w-2xl">Detailed breakdown of market rivals and strategic vulnerabilities discovered during analysis.</p>
                      </div>
                      <CompetitorMapping competitors={data.competitors || []} />
                    </div>
                  )}

                  {/* PAGE 4: CONCLUSION */}
                  {activeTab === 'conclusion' && (
                    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
                      <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-8 rounded-3xl border border-emerald-500/20">
                         <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Executive Conclusion</h1>
                         <p className="text-emerald-400/80 text-sm max-w-2xl font-bold tracking-wide">Complete synthesis of strategic intelligence.</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-12 bg-[#111b2d] border border-white/10 rounded-3xl p-8 shadow-xl">
                          <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                            <Lightbulb className="text-emerald-400 w-5 h-5" /> The Final Verdict
                          </h2>
                          <div className="p-6 bg-black/40 rounded-2xl border border-white/5 mb-8">
                             <p className="text-lg text-slate-300 leading-relaxed">
                               {data.conclusion?.verdict || data.conclusion?.summary || "No final summary text was provided by the backend intelligence engine."}
                             </p>
                          </div>

                          <h2 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">Backend Payload Synthesis</h2>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                              <div className="text-3xl font-black text-[#00D4FF]">{data.competitors?.length || 0}</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Competitors</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                              <div className="text-3xl font-black text-red-400">{data.watchouts?.length || 0}</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Watchouts</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                              <div className="text-3xl font-black text-fuchsia-400">{data.events?.length || 0}</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Events</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                              <div className="text-3xl font-black text-amber-400">{data.activity?.length || 0}</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Activities</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                              <div className="text-3xl font-black text-emerald-400">{(data.people?.decision_makers || data.people || []).length}</div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Targets</div>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-12 bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
                           <h2 className="text-lg font-black text-[#00D4FF] mb-6 uppercase tracking-widest flex items-center gap-2">
                             <FileText className="w-5 h-5" /> Executive Intelligence Briefing
                           </h2>
                           <div className="space-y-6 text-slate-300 leading-relaxed text-[15px]">
                             <p>
                               Based on the generated intelligence payload, the target operates in a market where the overall consumer sentiment is currently observed as <strong className="text-white">{data.market?.consumer_sentiment?.toLowerCase() || 'fluctuating'}</strong>. The organization maintains a competitive position described as: <em>"{data.market?.market_share_est || 'developing market presence'}"</em>. Recent market shifts, specifically surrounding <strong className="text-white">{data.market?.recent_shifts || 'unspecified industry changes'}</strong>, indicate a crucial window of opportunity for targeted strategic outreach.
                             </p>
                             {data.competitors && data.competitors.length > 0 && (
                               <p>
                                 The immediate competitive landscape is actively contested by {data.competitors.length} primary rivals. The most prominent threat to the target is <strong className="text-fuchsia-400">{data.competitors[0].name}</strong>, who relies heavily on their positioning of <em>"{data.competitors[0].positioning}"</em>. However, our analysis reveals a critical strategic gap in their operations—specifically, their <strong className="text-[#00D4FF]">{data.competitors[0].gap?.toLowerCase() || 'market execution'}</strong>. This vulnerability presents the primary leverage point for our proposed solution.
                               </p>
                             )}
                             {data.watchouts && data.watchouts.length > 0 && (
                               <p>
                                 Approaching this account requires careful navigation of {data.watchouts.length} identified strategic watchouts. Notably, <strong className="text-red-400">{data.watchouts[0].title}</strong> poses a significant friction point to entry. We recommend timing the initial outreach carefully, utilizing the identified decision-makers and potentially aligning communications with their recent <em>"{data.activity?.[0]?.title || 'strategic brand moves'}"</em> to establish immediate relevance and industry authority.
                               </p>
                             )}

                             
                           </div>
                           
                        </div>
                        {/* 2. PASTE YOUR NEW STRATEGIC TAKEAWAYS HERE */}
      <div className="lg:col-span-12 bg-[#0A1428] border border-white/10 rounded-3xl p-8 shadow-xl">
         <h2 className="text-sm font-bold text-[#00D4FF] mb-6 uppercase tracking-widest flex items-center gap-2">
           <CheckCircle2 className="w-5 h-5" /> Strategic Takeaways
         </h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {data.market?.market_share_est && (
             <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col justify-start">
               <div className="w-8 h-8 rounded-full bg-[#00D4FF]/10 flex items-center justify-center mb-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" />
               </div>
               <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-xs">Market Position</h3>
               <p className="text-slate-400 text-sm leading-relaxed">{data.market.market_share_est}</p>
             </div>
           )}

           {data.market?.consumer_sentiment && (
             <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col justify-start">
               <div className="w-8 h-8 rounded-full bg-emerald-400/10 flex items-center justify-center mb-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
               </div>
               <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-xs">Consumer Sentiment</h3>
               <p className="text-slate-400 text-sm leading-relaxed">{data.market.consumer_sentiment}</p>
             </div>
           )}

           {data.competitors?.length > 0 && (
             <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col justify-start">
               <div className="w-8 h-8 rounded-full bg-fuchsia-400/10 flex items-center justify-center mb-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-400" />
               </div>
               <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-xs">Competitive Threat Level</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Identified {data.competitors.length} primary competitors. Top identified rival is <strong>{data.competitors[0].name}</strong>.
               </p>
             </div>
           )}

           {data.watchouts?.length > 0 && (
             <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col justify-start">
               <div className="w-8 h-8 rounded-full bg-red-400/10 flex items-center justify-center mb-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
               </div>
               <h3 className="text-white font-bold mb-2 uppercase tracking-wide text-xs">Strategic Vulnerabilities</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Tracking {data.watchouts.length} identified risk factors that require immediate attention in upcoming outreach strategies.
               </p>
             </div>
           )}
         </div>
      </div>
                      </div>
                      
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}