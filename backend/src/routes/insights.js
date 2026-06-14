const express = require('express');
const router = express.Router();
const { supabase } = require('../db/supabase');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET /api/insights/recommendation
router.get('/recommendation', async (req, res) => {
  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .in('risk_tier', ['critical', 'at_risk']);

    if (error) throw error;

    let criticalCount = 0;
    let atRiskCount = 0;
    let totalRevenueAtRisk = 0;
    let maxChurnScore = -1;
    let topCriticalName = '';
    let totalDaysInactiveCritical = 0;
    const now = new Date();

    customers.forEach(c => {
      totalRevenueAtRisk += c.total_spend;
      if (c.risk_tier === 'critical') {
        criticalCount++;
        const daysInactive = Math.floor((now - new Date(c.last_order_date)) / (1000 * 60 * 60 * 24));
        totalDaysInactiveCritical += daysInactive;
        
        if (c.churn_score > maxChurnScore) {
          maxChurnScore = c.churn_score;
          topCriticalName = c.name;
        }
      } else if (c.risk_tier === 'at_risk') {
        atRiskCount++;
      }
    });

    const avgDaysInactive = criticalCount > 0 ? Math.round(totalDaysInactiveCritical / criticalCount) : 0;

    const prompt = `You are a CRM analyst. Based on this retail brand's customer data, generate one 
urgent actionable insight as JSON only, no markdown:
{
  "urgency": "high" | "medium",
  "insight": "one sentence describing the problem (max 80 chars)",
  "recommendation": "one sentence recommended action (max 80 chars)", 
  "cta": "button text (max 20 chars)",
  "metric": "key number to highlight e.g. ₹7,46,374 at risk"
}

Data: ${criticalCount} critical customers, ${atRiskCount} at-risk customers, 
₹${totalRevenueAtRisk} revenue at stake, avg ${avgDaysInactive} days inactive 
for critical tier. Top critical customer is ${topCriticalName} (score: ${maxChurnScore}).`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-lite-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Clean markdown backticks if present
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    res.json(JSON.parse(text));
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [SERVER] Error generating insight:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
