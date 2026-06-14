import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#FFFFFF]/80 backdrop-blur-xl border-r border-[#D2D2D7]/40 flex flex-col h-screen overflow-y-auto shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-[#D2D2D7]/40 shrink-0">
        <div className="flex items-center gap-2 text-xl font-semibold text-[#1D1D1F] tracking-tight">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          XenoCRM
        </div>
      </div>



      <nav className="flex-1 px-4 space-y-1">
        <NavLink 
          to="/" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-[12px] transition-colors font-medium ${isActive ? 'bg-[#0071E3] text-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]' : 'text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Dashboard
        </NavLink>
        <NavLink 
          to="/campaigns" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-[12px] transition-colors font-medium ${isActive ? 'bg-[#0071E3] text-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]' : 'text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
          Campaigns
        </NavLink>
        <NavLink 
          to="/performance" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-[12px] transition-colors font-medium ${isActive ? 'bg-[#0071E3] text-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]' : 'text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'}`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          Performance
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
