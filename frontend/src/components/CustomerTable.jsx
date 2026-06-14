import React from 'react';

const CustomerTable = ({ customers }) => {
  if (!customers || customers.length === 0) return <p className="text-[#86868B] text-center py-10 font-medium">No data available.</p>;

  const sorted = [...customers].sort((a, b) => b.churn_score - a.churn_score).slice(0, 20);

  const getTierColor = (tier) => {
    if (tier === 'critical') return 'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/20';
    if (tier === 'at_risk') return 'text-[#FF9500] bg-[#FF9500]/10 border-[#FF9500]/20';
    return 'text-[#34C759] bg-[#34C759]/10 border-[#34C759]/20';
  };

  return (
    <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D2D2D7]/40 bg-[#F5F5F7]/50 backdrop-blur-md">
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#86868B] uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#86868B] uppercase tracking-wider">Risk Tier</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#86868B] uppercase tracking-wider">Churn Score</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-[#86868B] uppercase tracking-wider">Total Spend</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-[#86868B] uppercase tracking-wider">Last Order</th>
            </tr>
          </thead>
        <tbody className="divide-y divide-appleBorder/40">
          {sorted.map(c => {
            return (
              <tr key={c.id} className="border-b border-[#D2D2D7]/40 hover:bg-[#F5F5F7] transition-colors duration-150">
                <td className="px-6 py-4 font-semibold text-[#1D1D1F]">{c.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${getTierColor(c.risk_tier)}`}>
                    {c.risk_tier.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-right font-semibold text-[#1D1D1F]">{c.churn_score}</span>
                    <div className="w-24 bg-appleBorder/30 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${c.churn_score > 70 ? 'bg-[#FF3B30]' : c.churn_score > 40 ? 'bg-[#FF9500]' : 'bg-[#34C759]'}`} 
                        style={{ width: `${c.churn_score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-[#1D1D1F] font-medium">₹{c.total_spend.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-[#86868B]">{new Date(c.last_order_date).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
