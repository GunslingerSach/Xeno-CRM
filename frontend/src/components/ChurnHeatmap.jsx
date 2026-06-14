import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

const ChurnHeatmap = ({ customers }) => {
  if (!customers || customers.length === 0) return null;

  const data = [
    { name: 'Critical', count: customers.filter(c => c.risk_tier === 'critical').length, color: '#dc2626' },
    { name: 'At Risk', count: customers.filter(c => c.risk_tier === 'at_risk').length, color: '#d97706' },
    { name: 'Safe', count: customers.filter(c => c.risk_tier === 'safe').length, color: '#059669' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FFFFFF] p-3 border border-[#D2D2D7]/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-[20px] z-50">
          <p className="font-semibold text-[#1D1D1F] mb-1">{payload[0].payload.name}</p>
          <p className="text-[#86868B] text-sm">{payload[0].value} customers</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[320px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 13, fontWeight: 500}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={80}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChurnHeatmap;
