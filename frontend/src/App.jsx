import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CampaignBuilder from './components/CampaignBuilder';
import PerformanceTracker from './components/PerformanceTracker';
import ChatBot from './components/ChatBot';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen bg-[#F5F5F7] text-[#1D1D1F] overflow-hidden selection:bg-[#0071E3]/20 selection:text-appleBlue font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-0 w-full">
          <div className="w-full h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaigns" element={<CampaignBuilder />} />
              <Route path="/performance" element={<PerformanceTracker />} />
            </Routes>
          </div>
        </main>
        <ChatBot />
      </div>
    </div>
  );
}

export default App;
