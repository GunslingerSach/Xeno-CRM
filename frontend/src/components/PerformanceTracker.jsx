import React, { useEffect, useState } from 'react';
import { getCampaigns, getCampaignStats } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FFFFFF]/90 backdrop-blur-md border border-[#D2D2D7]/40 p-3 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-sm min-w-[120px]">
        <p className="font-semibold text-[#1D1D1F] mb-1 capitalize tracking-wide">{label}</p>
        <p className="text-appleBlue font-medium text-lg">{payload[0].value} <span className="text-sm text-[#86868B]">users</span></p>
      </div>
    );
  }
  return null;
};

const CampaignRow = ({ campaign }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const data = await getCampaignStats(campaign.id);
        if (isMounted) setStats(data);
      } catch(err) {
        console.error("Failed fetching stats", err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [campaign.id]);

  if (!stats) return <div className="animate-pulse h-64 bg-white border border-gray-200 rounded-xl my-6 shadow-sm"></div>;

  const total = stats.total || 1;
  const clicked = stats.clicked || 0;
  const opened = (stats.opened || 0) + clicked;
  const delivered = (stats.delivered || 0) + opened;
  const failed = stats.failed || 0;
  const sent = total; // everything in the campaign

  const deliveryRate = ((delivered / total) * 100).toFixed(0);
  const recoveryRate = ((clicked / total) * 100).toFixed(1);

  const chartData = [
    { name: 'Sent', count: sent },
    { name: 'Delivered', count: delivered },
    { name: 'Opened', count: opened },
    { name: 'Clicked', count: clicked },
    { name: 'Failed', count: failed }
  ];

  return (
    <div className="bg-[#FFFFFF] p-8 rounded-[20px] border border-[#D2D2D7]/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-8 group">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#1D1D1F] tracking-tight mb-2">{campaign.name}</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#86868B]">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${campaign.segment_tier === 'critical' ? 'bg-brandRed/10 text-brandRed' : 'bg-brandAmber/10 text-brandAmber'}`}>
              {campaign.segment_tier.replace('_', ' ')}
            </span>
            <span className="text-[#86868B] text-sm font-semibold capitalize bg-appleBorder/20 px-3 py-1 rounded-md">{campaign.channel}</span>
            <span className="text-brandGreen text-sm font-semibold bg-brandGreen/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(48,209,88,0.2)]">
              <span className="w-2 h-2 rounded-full bg-brandGreen animate-pulse"></span>
              {campaign.status}
            </span>
          </div>
        </div>
        <div className="text-right bg-[#F5F5F7] p-4 rounded-[20px] border border-[#D2D2D7]/40 min-w-[120px]">
          <div className="text-3xl font-bold text-[#1D1D1F] mb-1">{recoveryRate}<span className="text-xl text-[#86868B]">%</span></div>
          <div className="text-[10px] text-[#86868B] uppercase tracking-widest font-bold">Recovery Rate</div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between text-sm text-[#86868B] font-medium mb-3">
          <span>Delivery Progress</span>
          <div className="text-sm font-semibold text-[#86868B] w-16 group-hover:text-[#1D1D1F] transition-colors">Progress</div>
          <div className="flex-1 mx-4">
            <div className="h-4 bg-[#F5F5F7] rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-[#0071E3] rounded-full relative transition-all duration-1000 ease-out group-hover:bg-[#0071E3]Hover" style={{ width: `${deliveryRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-48 w-full relative -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{top: 10, right: 10, bottom: 0, left: -20}}>
              <CartesianGrid strokeDasharray="4 4" stroke="#ffffff" vertical={false} opacity={0.05} />
              <XAxis dataKey="name" stroke="#8E8E93" tick={{fontSize: 12, fill: '#8E8E93', fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#8E8E93" tick={{fontSize: 12, fill: '#8E8E93', fontWeight: 500}} allowDecimals={false} axisLine={false} tickLine={false} dx={-10} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{fill: '#ffffff', opacity: 0.03}} />
              <Bar dataKey="count" fill="#0A84FF" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Sent', value: sent, color: 'text-[#1D1D1F]' },
            { label: 'Delivered', value: delivered, color: 'text-brandBlue' },
            { label: 'Opened', value: opened, color: 'text-brandIndigo' },
            { label: 'Failed', value: failed, color: 'text-brandRed' }
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 p-5 rounded-[20px] border border-white/5 flex flex-col justify-center items-center backdrop-blur-sm hover:bg-black/5 transition-colors">
              <div className={`text-3xl font-bold ${stat.color} mb-1 tracking-tight`}>{stat.value}</div>
              <div className="text-[10px] text-[#86868B] uppercase font-bold tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PerformanceTracker = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-10 h-10 border-4 border-brandBlue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#86868B] font-medium tracking-wide">Loading metrics...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-brandRed/10 border border-brandRed/20 text-brandRed p-6 rounded-[24px] text-center shadow-2xl max-w-lg mx-auto mt-20 backdrop-blur-md">
      <h2 className="text-xl font-semibold mb-2">Sync Error</h2>
      <p className="mb-6 opacity-80">{error}</p>
      <button onClick={fetchCampaigns} className="px-6 py-2.5 bg-brandRed/20 hover:bg-brandRed/30 text-brandRed font-medium rounded-full transition-colors duration-300">Retry Sync</button>
    </div>
  );

  if (campaigns.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-700">
      <div className="w-24 h-24 bg-[#F5F5F7] rounded-full flex items-center justify-center mb-6 border border-[#D2D2D7]/40">
        <svg className="w-10 h-10 text-[#86868B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
      <h2 className="text-3xl font-bold text-[#1D1D1F] tracking-tight mb-3">No active campaigns</h2>
      <p className="text-[#86868B] mb-8 max-w-md text-center text-lg">You haven't launched any win-back campaigns yet. Head over to the studio to generate your first AI sequence.</p>
      <button 
        onClick={() => navigate('/campaigns')}
        className="px-8 py-4 bg-[#0071E3] hover:bg-[#0071E3]Hover text-white font-bold rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all"
      >
        Open Campaign Studio
      </button>
    </div>
  );

  return (
    <div className="w-full space-y-0 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex justify-between items-end mb-0 border-b border-[#D2D2D7]/40 p-6 bg-[#F5F5F7]">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F] mb-2">Performance</h1>
          <p className="text-[#86868B]">Live delivery metrics and recovery rates.</p>
        </div>
        <button onClick={fetchCampaigns} className="p-3 bg-[#FFFFFF] border border-[#D2D2D7]/40 hover:bg-[#F5F5F7] rounded-full text-[#86868B] transition-colors group shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <svg className="w-5 h-5 text-[#86868B] group-hover:text-[#1D1D1F] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
      
      {campaigns.map(c => <CampaignRow key={c.id} campaign={c} />)}
    </div>
  );
};

export default PerformanceTracker;
