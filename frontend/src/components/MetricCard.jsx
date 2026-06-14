import React from 'react';

const MetricCard = ({ title, value, subtitle, color }) => {
  const colorMap = {
    red: { bg: 'bg-[#FF3B30]/10', text: 'text-[#FF3B30]', dot: 'bg-[#FF3B30]' },
    amber: { bg: 'bg-[#FF9500]/10', text: 'text-[#FF9500]', dot: 'bg-[#FF9500]' },
    green: { bg: 'bg-[#34C759]/10', text: 'text-[#34C759]', dot: 'bg-[#34C759]' }
  };

  const theme = colorMap[color] || { bg: 'bg-[#F5F5F7]', text: 'text-[#86868B]', dot: 'bg-appleSecondaryText' };

  return (
    <div className="bg-[#FFFFFF] p-6 rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#D2D2D7]/40 hover:bg-[#F5F5F7] transition-colors duration-200 ease-out flex flex-col relative overflow-hidden group">

      
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${theme.dot}`}></div>
        <span className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full ${theme.bg} ${theme.text}`}>{title}</span>
      </div>
      <span className={`text-3xl font-bold tracking-tight ${theme.text}`}>{value}</span>
      {subtitle && <p className="text-[#86868B] text-xs mt-2 font-medium relative z-10">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;
