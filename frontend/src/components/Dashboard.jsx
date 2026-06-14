import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from './MetricCard';
import ChurnHeatmap from './ChurnHeatmap';
import CustomerTable from './CustomerTable';
import AiInsightCard from './AiInsightCard';
import AIInsightBanner from './AIInsightBanner';
import { getCustomerStats, getCustomers } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, customersData] = await Promise.all([
        getCustomerStats(),
        getCustomers()
      ]);
      setStats(statsData);
      setCustomers(customersData);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center animate-pulse">
        <div className="w-10 h-10 border-4 border-brandBlue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#86868B] font-medium tracking-wide">Loading overview...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-brandRed/10 border border-brandRed/20 text-brandRed p-6 rounded-[24px] text-center shadow-2xl max-w-lg mx-auto mt-20 backdrop-blur-md">
      <svg className="w-12 h-12 mx-auto mb-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 className="text-xl font-semibold mb-2">Failed to load data</h2>
      <p className="mb-6 opacity-80">{error}</p>
      <button onClick={fetchData} className="px-6 py-2.5 bg-brandRed/20 hover:bg-brandRed/30 text-brandRed font-medium rounded-full transition-colors duration-300">Retry Connection</button>
    </div>
  );

  return (
    <div className="w-full space-y-0 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-[#D2D2D7]/40 bg-[#F5F5F7]">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F] mb-1">Overview</h1>
          <p className="text-[#86868B]">Your AI-driven churn prevention center.</p>
        </div>
      </div>
      
      <AIInsightBanner />
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-b border-[#D2D2D7]/40">
          <MetricCard title="Critical Risk" value={stats.critical.count} subtitle="Immediate action required" color="red" />
          <MetricCard title="At Risk" value={stats.at_risk.count} subtitle="Showing signs of churn" color="amber" />
          <MetricCard title="Revenue at Stake" value={`₹${stats.totalRevenueAtRisk.toLocaleString()}`} subtitle="Critical + At Risk combined" color="red" />
          <MetricCard title="Safe Customers" value={stats.safe.count} subtitle="Healthy engagement" color="green" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="lg:col-span-1 bg-[#FFFFFF] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#D2D2D7]/40 relative overflow-hidden group">
          <h2 className="text-xl font-semibold mb-6 tracking-tight text-[#1D1D1F]">Risk Map</h2>
          <ChurnHeatmap customers={customers} />
        </div>
        <div className="lg:col-span-2 bg-[#FFFFFF] rounded-[20px] p-0 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#D2D2D7]/40 relative overflow-hidden">
          <div className="p-6 border-b border-[#D2D2D7]/40">
            <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">Top Customers at Risk</h2>
          </div>
          <CustomerTable customers={customers} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
