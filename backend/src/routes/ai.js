const express = require('express');
const router = express.Router();
const { generateCampaignContent } = require('../services/aiService');
const { supabase } = require('../db/supabase');

// POST /api/ai/generate-campaign
router.post('/generate-campaign', async (req, res) => {
  let stats = req.body.stats;
  
  if (!stats) {
    const { data } = await supabase.from('customers').select('risk_tier, total_spend');
    stats = {
      critical: { count: 0, totalRevenue: 0 },
      at_risk: { count: 0, totalRevenue: 0 }
    };
    if (data) {
      data.forEach(c => {
        if (stats[c.risk_tier]) {
          stats[c.risk_tier].count++;
          stats[c.risk_tier].totalRevenue += c.total_spend;
        }
      });
    }
  }

  const variants = await generateCampaignContent(stats);
  res.json(variants);
});

module.exports = router;
