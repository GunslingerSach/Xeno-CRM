import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerStats, generateCampaign, createCampaign, launchCampaign } from '../api';

const CampaignBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState(null);
  
  const [content, setContent] = useState({ critical: '', at_risk: '' });
  const [channel, setChannel] = useState('whatsapp');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCustomerStats();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch customer stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleGenerate = async () => {
    setAiGenerating(true);
    setError(null);
    try {
      const response = await generateCampaign(stats);
      setContent({
        critical: response.criticalVariant,
        at_risk: response.atRiskVariant
      });
      setStep(2);
    } catch (err) {
      setError(err.message || 'AI Generation failed');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleLaunch = async () => {
    setLaunching(true);
    setError(null);
    try {
      const critCamp = await createCampaign({
        name: `Critical Win-Back ${new Date().toISOString().split('T')[0]}`,
        segment_tier: 'critical',
        message_template: content.critical,
        channel
      });
      const riskCamp = await createCampaign({
        name: `At-Risk Re-engagement ${new Date().toISOString().split('T')[0]}`,
        segment_tier: 'at_risk',
        message_template: content.at_risk,
        channel
      });

      await Promise.all([launchCampaign(critCamp.id), launchCampaign(riskCamp.id)]);
      navigate('/performance');
    } catch (err) {
      setError(err.message || 'Failed to launch campaigns');
      setLaunching(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-10 h-10 border-4 border-brandBlue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Preparing studio...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F] mb-3">Campaign Studio</h1>
        <p className="text-[#86868B] text-lg">Harness intelligent AI to win back your customers.</p>
      </div>
      
      {error && (
        <div className="bg-brandRed/10 border border-brandRed/20 text-brandRed p-4 rounded-2xl flex justify-between items-center backdrop-blur-md">
          <p className="font-medium">{error}</p>
          <button onClick={() => setError(null)} className="p-2 hover:bg-brandRed/20 rounded-full transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {step === 1 && stats && (
        <div className="bg-[#FFFFFF] p-12 rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#D2D2D7]/40 text-center relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto bg-[#0071E3] rounded-[20px] flex items-center justify-center mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-[#1D1D1F]">Generate with Gemini</h2>
            <p className="text-[#86868B] text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              We identified <span className="text-[#FF3B30] font-semibold">{stats.critical.count} critical</span> and <span className="text-[#FF9500] font-semibold">{stats.at_risk.count} at-risk</span> customers. Let our AI craft the perfect personalized messages to recover <span className="text-[#1D1D1F] font-semibold">₹{stats.totalRevenueAtRisk.toLocaleString()}</span>.
            </p>
            <button 
              onClick={handleGenerate}
              disabled={aiGenerating}
              className={`px-8 py-4 rounded-[12px] font-semibold text-lg text-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-center mx-auto gap-3 ${aiGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0071E3] hover:bg-[#0071E3]Hover'}`}
            >
              {aiGenerating ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Synthesizing...</>
              ) : 'Generate Content'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 p-1.5 rounded-full flex gap-1 border border-white/5 backdrop-blur-md">
              {['whatsapp', 'sms', 'email', 'rcs'].map(c => (
                <button 
                  key={c}
                  onClick={() => setChannel(c)}
                  className={`px-6 py-2 rounded-[12px] capitalize font-medium text-sm transition-colors duration-200 ${channel === c ? 'bg-[#0071E3] text-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]' : 'text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FFFFFF] p-8 rounded-[20px] border border-[#D2D2D7]/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#FF3B30]/10 flex items-center justify-center text-[#FF3B30]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Critical Variant</h3>
                  <p className="text-[#86868B] text-sm">{stats.critical.count} recipients</p>
                </div>
              </div>
              <textarea 
                value={content.critical}
                onChange={e => setContent({...content, critical: e.target.value})}
                className="w-full bg-[#F5F5F7] border border-[#D2D2D7]/40 text-[#1D1D1F] rounded-[20px] p-5 min-h-[140px] focus:ring-2 focus:ring-appleBlue focus:border-transparent outline-none transition-all resize-none shadow-inner"
              />
              <p className="text-[#86868B] text-xs mt-4 text-center font-medium">AI-generated • Edit before sending</p>
            </div>

            <div className="bg-[#FFFFFF] p-8 rounded-[20px] border border-[#D2D2D7]/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#FF9500]/10 flex items-center justify-center text-[#FF9500]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">At-Risk Variant</h3>
                  <p className="text-[#86868B] text-sm">{stats.at_risk.count} recipients</p>
                </div>
              </div>
              <textarea 
                value={content.at_risk}
                onChange={e => setContent({...content, at_risk: e.target.value})}
                className="w-full bg-[#F5F5F7] border border-[#D2D2D7]/40 text-[#1D1D1F] rounded-[20px] p-5 min-h-[140px] focus:ring-2 focus:ring-appleBlue focus:border-transparent outline-none transition-all resize-none shadow-inner"
              />
              <p className="text-[#86868B] text-xs mt-4 text-center font-medium">AI-generated • Edit before sending</p>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button 
              onClick={handleLaunch} 
              disabled={launching} 
              className={`w-full py-5 rounded-[12px] font-bold text-xl text-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-center gap-3 ${launching ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#34C759] hover:bg-[#34C759]/90'}`}
            >
              {launching && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-none animate-spin"></div>}
              {launching ? 'Deploying...' : 'Deploy Campaigns'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignBuilder;
