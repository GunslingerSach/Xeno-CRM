const express = require('express');
const router = express.Router();
const { supabase } = require('../db/supabase');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

router.post('/', aiLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;
    
    // Customers stats
    const { data: customers } = await supabase.from('customers').select('*');
    let critical = { count: 0, sum: 0, avgSpend: 0 };
    let atRisk = { count: 0, sum: 0, avgSpend: 0 };
    let safe = { count: 0 };
    let totalRevenueAtRisk = 0;
    
    let criticalCustomers = [];
    
    if (customers) {
      customers.forEach(c => {
        if (c.risk_tier === 'critical') {
          critical.count++;
          critical.sum += c.total_spend;
          totalRevenueAtRisk += c.total_spend;
          criticalCustomers.push(c);
        } else if (c.risk_tier === 'at_risk') {
          atRisk.count++;
          atRisk.sum += c.total_spend;
          totalRevenueAtRisk += c.total_spend;
        } else {
          safe.count++;
        }
      });
    }
    
    critical.avgSpend = critical.count > 0 ? Math.round(critical.sum / critical.count) : 0;
    atRisk.avgSpend = atRisk.count > 0 ? Math.round(atRisk.sum / atRisk.count) : 0;
    
    // Top 5 critical customers
    criticalCustomers.sort((a, b) => b.churn_score - a.churn_score);
    const top5 = criticalCustomers.slice(0, 5).map(c => `- ${c.name} (Score: ${c.churn_score}, Spend: ₹${c.total_spend})`).join('\n');

    // Last 3 campaigns
    const { data: campaigns } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false }).limit(3);
    const campaignSummary = campaigns && campaigns.length > 0 ? campaigns.map(c => `- ${c.name} (${c.channel}): Sent ${c.sent}, Delivered ${c.delivered}, Opened ${c.opened}`).join('\n') : 'No recent campaigns';

    const systemPrompt = `You are an AI assistant built into XenoCRM, a churn prevention CRM for retail brands.
You have access to the following live data about this brand's customers:

Customer Overview:
- Critical risk customers: ${critical.count} (avg spend: ₹${critical.avgSpend})
- At-risk customers: ${atRisk.count} (avg spend: ₹${atRisk.avgSpend})  
- Safe customers: ${safe.count}
- Total revenue at stake: ₹${totalRevenueAtRisk}

Recent Campaigns:
${campaignSummary}

Top At-Risk Customers:
${top5}

You help marketers:
1. Understand their customer churn situation
2. Decide who to target in campaigns
3. Review campaign performance
4. Get recommendations on messaging and timing

Keep responses concise (under 100 words). Be specific with numbers.
If asked something outside CRM/customer data, say you can only help with 
customer and campaign insights.
Format responses in plain text, no markdown.`;

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    
    const formattedHistory = (history || []).map(msg => {
      return { role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] };
    });
    
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am ready to help with CRM insights." }] },
        ...formattedHistory
      ]
    });

    const result = await chat.sendMessage([{ text: message }]);
    
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error('Chat API Error:', error);
    
    if (error.message && error.message.includes('503 Service Unavailable')) {
      return res.json({ reply: "Google's AI servers are currently experiencing unusually high demand (503 Error). Please try your message again in a few moments!" });
    }
    
    res.status(500).json({ error: 'Failed to process chat request', details: error.message, stack: error.stack });
  }
});

module.exports = router;
