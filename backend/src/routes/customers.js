const express = require('express');
const router = express.Router();
const { supabase } = require('../db/supabase');
const { calculateChurnScore } = require('../services/churnScoring');
const { seedDatabase } = require('../db/seed');

// POST /api/customers/seed
router.post('/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/customers
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('churn_score', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/customers/stats
router.get('/stats', async (req, res) => {
  const { data, error } = await supabase.from('customers').select('risk_tier, total_spend');
  if (error) return res.status(500).json({ error: error.message });

  const stats = {
    critical: { count: 0, totalRevenue: 0, avgSpend: 0 },
    at_risk: { count: 0, totalRevenue: 0, avgSpend: 0 },
    safe: { count: 0, totalRevenue: 0, avgSpend: 0 },
    totalRevenueAtRisk: 0
  };

  data.forEach(c => {
    if (stats[c.risk_tier]) {
      stats[c.risk_tier].count += 1;
      stats[c.risk_tier].totalRevenue += c.total_spend;
    }
  });

  ['critical', 'at_risk', 'safe'].forEach(tier => {
    stats[tier].avgSpend = stats[tier].count > 0 ? (stats[tier].totalRevenue / stats[tier].count) : 0;
  });

  stats.totalRevenueAtRisk = stats.critical.totalRevenue + stats.at_risk.totalRevenue;

  res.json(stats);
});

// POST /api/customers/score
router.post('/score', async (req, res) => {
  const { data: customers, error } = await supabase.from('customers').select('*');
  if (error) return res.status(500).json({ error: error.message });

  let updatedCount = 0;
  for (const customer of customers) {
    const { score, tier } = calculateChurnScore(customer);
    const { error: updateError } = await supabase
      .from('customers')
      .update({ churn_score: score, risk_tier: tier })
      .eq('id', customer.id);
    
    if (!updateError) updatedCount++;
  }

  res.json({ success: true, updatedCount });
});

module.exports = router;
