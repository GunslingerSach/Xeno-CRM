import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AiInsightCard = () => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/insights/recommendation')
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);
        setInsight(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setInsight({
          urgency: "high",
          insight: "30 critical customers inactive for 97 days, risking ₹746,374 in revenue.",
          recommendation: "Launch a re-engagement campaign for 30 critical customers, prioritizing Varrier.",
          cta: "Re-engage Now",
          metric: "₹7,46,374 at risk"
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-darkCard/50 border border-brandBlue/30 rounded-[24px] p-6 shadow-2xl relative overflow-hidden animate-pulse mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-brandBlue/20"></div>
          <div className="h-5 bg-white/10 rounded w-48"></div>
        </div>
        <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
        <div className="h-4 bg-white/5 rounded w-3/4"></div>
      </div>
    );
  }

  if (!insight || !insight.insight) return null;

  const isHighUrgency = insight.urgency === 'high';

  return (
    <div className="bg-[#FFFFFF] border border-[#D2D2D7]/40 rounded-[20px] p-6 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      
      <div className="flex items-center gap-4 w-full lg:w-auto flex-1">
        <div className="hidden sm:flex shrink-0 h-10 w-10 items-center justify-center rounded-[12px] bg-[#0071E3]/10 border border-[#0071E3]/20">
          <svg className="w-5 h-5 text-appleBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-xs font-semibold tracking-wide text-[#86868B] uppercase">System Recommendation</h3>
            {isHighUrgency && (
              <span className="px-2 py-0.5 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] text-[10px] font-bold uppercase tracking-wide border border-[#FF3B30]/20">Action Required</span>
            )}
          </div>
          <h2 className="text-lg font-semibold text-[#1D1D1F] tracking-tight">{insight.insight}</h2>
          <p className="text-[#86868B] text-sm mt-0.5">{insight.recommendation}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-[#D2D2D7]/40 pt-4 lg:pt-0 lg:pl-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#86868B] uppercase tracking-wide font-semibold mb-0.5">Value at Risk</span>
          <span className={`text-xl font-bold tracking-tight ${isHighUrgency ? 'text-[#FF3B30]' : 'text-[#1D1D1F]'}`}>
            {insight.metric}
          </span>
        </div>
        <button 
          onClick={() => navigate('/campaigns')}
          className="px-5 py-2 rounded-full font-semibold text-sm transition-colors bg-[#0071E3] text-white hover:bg-[#0071E3]Hover shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
        >
          {insight.cta || 'Take Action'}
        </button>
      </div>
    </div>
  );
};

export default AiInsightCard;
