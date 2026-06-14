const calculateChurnScore = (customer) => {
  const now = new Date();
  const lastOrderDate = new Date(customer.last_order_date);
  const firstOrderDate = new Date(customer.first_order_date);
  
  const daysSinceLastOrder = Math.max(0, (now - lastOrderDate) / (1000 * 60 * 60 * 24));
  const monthsActive = Math.max(1, (now - firstOrderDate) / (1000 * 60 * 60 * 24 * 30));
  
  const avgOrderValue = customer.total_spend / Math.max(1, customer.total_orders);
  const ordersPerMonth = customer.total_orders / monthsActive;

  // Recency component (40 points max): days since last order / 90, capped at 1
  const recencyScore = Math.min(daysSinceLastOrder / 90, 1) * 40;

  // Frequency component (30 points max): lower frequency = higher risk.
  // 0 orders/mo = 30 points. 4+ orders/mo = 0 points.
  const frequencyScore = Math.max(0, 30 - (ordersPerMonth / 4) * 30);

  // Monetary component (30 points max): based on avg order value vs 5000 benchmark
  // Higher AOV means a higher business risk if lost.
  const monetaryScore = Math.min(avgOrderValue / 5000, 1) * 30;

  // Total churn score (0-100)
  const score = Math.min(100, Math.round(recencyScore + frequencyScore + monetaryScore));

  // Risk Tier categorization based on distribution rules
  let tier = 'safe';
  if (daysSinceLastOrder >= 75 && customer.total_spend >= 8000) {
    tier = 'critical';
  } else if (daysSinceLastOrder >= 35 && customer.total_spend >= 2000) {
    tier = 'at_risk';
  }

  return { score, tier };
};

module.exports = { calculateChurnScore };
