import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AIInsightBanner = () => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInsight = () => {
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
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#1c1c1e] border border-[#2c2c2e] rounded-[20px] p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-white/20 shrink-0"></div>
          <div className="flex flex-col gap-2 w-full max-w-lg">
            <div className="h-5 bg-white/20 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
        <div className="flex-1 flex justify-center w-full py-4 md:py-0">
           <div className="h-10 bg-white/20 rounded w-48 shrink-0"></div>
        </div>
        <div className="shrink-0">
           <div className="h-12 bg-white/20 rounded-full w-40 shrink-0"></div>
        </div>
      </div>
    );
  }

  if (!insight || !insight.insight) return null;

  const isHighUrgency = insight.urgency === 'high';
  const isMediumUrgency = insight.urgency === 'medium';
  
  let borderAccent = 'border-[#D2D2D7]/40';
  if (isHighUrgency) borderAccent = 'border-l-4 border-l-[#FF3B30] border-y-[#D2D2D7]/40 border-r-[#D2D2D7]/40';
  else if (isMediumUrgency) borderAccent = 'border-l-4 border-l-[#FF9500] border-y-[#D2D2D7]/40 border-r-[#D2D2D7]/40';

  return (
    <div className={`w-full bg-[#FFFFFF] ${borderAccent} border-y border-r rounded-[20px] rounded-l-md p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]`}>
      <div className="flex items-center gap-4 flex-1">

        <div>
          <h2 className="text-lg font-bold text-[#1D1D1F] tracking-tight">{insight.insight}</h2>
          <p className="text-[#86868B] text-sm mt-1">{insight.recommendation}</p>
        </div>
      </div>
      
      <div className="flex-1 text-center md:border-x border-y md:border-y-0 border-[#D2D2D7]/40 py-4 md:py-0">
        <span className="text-3xl font-bold text-[#0071E3] tracking-tight block">
          {insight.metric}
        </span>
      </div>
      
      <div className="shrink-0 flex justify-center">
        <button 
          onClick={() => navigate('/campaigns')}
          className="px-8 py-3 rounded-[12px] font-bold text-white transition-colors bg-[#0071E3] hover:bg-[#0077ED] shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
        >
          {insight.cta || 'Take Action'}
        </button>
      </div>
    </div>
  );
};

export default AIInsightBanner;
