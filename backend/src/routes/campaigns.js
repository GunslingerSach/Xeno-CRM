const express = require('express');
const router = express.Router();
const { supabase } = require('../db/supabase');
const { sendToChannel } = require('../services/channelClient');
const { v4: uuidv4 } = require('uuid');

// GET /api/campaigns
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/campaigns
router.post('/', async (req, res) => {
  const { name, segment_tier, message_template, channel } = req.body;
  const { data, error } = await supabase
    .from('campaigns')
    .insert([{ name, segment_tier, message_template, channel, status: 'draft' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/campaigns/:id/launch
router.post('/:id/launch', async (req, res) => {
  const { id } = req.params;
  const { data: campaign, error: campError } = await supabase.from('campaigns').select('*').eq('id', id).single();
  if (campError || !campaign) return res.status(404).json({ error: 'Campaign not found' });

  const { data: customers, error: custError } = await supabase
    .from('customers')
    .select('*')
    .eq('risk_tier', campaign.segment_tier);
  
  if (custError) return res.status(500).json({ error: custError.message });

  const communications = customers.map(c => ({
    id: uuidv4(),
    campaign_id: id,
    customer_id: c.id,
    status: 'queued',
    channel: campaign.channel,
    message: campaign.message_template.replace(/{name}/g, c.name)
  }));

  if (communications.length > 0) {
    const { error: commError } = await supabase.from('communications').insert(communications);
    if (commError) return res.status(500).json({ error: commError.message });
  }

  await supabase.from('campaigns').update({ status: 'running' }).eq('id', id);

  console.log(`[${new Date().toISOString()}] [CAMPAIGN] Launched campaign ${id} to ${communications.length} recipients`);

  res.json({ launched: true, recipientCount: communications.length });

  // Fire and forget channel client
  communications.forEach(comm => {
    const customer = customers.find(c => c.id === comm.customer_id);
    sendToChannel({
      id: comm.id,
      channel: comm.channel,
      recipient: { name: customer.name, email: customer.email, phone: customer.phone },
      message: comm.message
    }).catch(err => console.error(`Failed to send to channel for comm ${comm.id}:`, err));
  });
});

// GET /api/campaigns/:id/stats
router.get('/:id/stats', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('communications')
    .select('status')
    .eq('campaign_id', id);
  
  if (error) return res.status(500).json({ error: error.message });

  const stats = { sent: 0, delivered: 0, failed: 0, opened: 0, clicked: 0, total: data.length, queued: 0 };
  data.forEach(c => {
    if (stats[c.status] !== undefined) {
      stats[c.status]++;
    } else {
      stats[c.status] = 1;
    }
  });

  res.json(stats);
});

module.exports = router;
