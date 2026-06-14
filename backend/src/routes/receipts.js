const express = require('express');
const router = express.Router();
const { supabase } = require('../db/supabase');

// POST /api/receipts/callback
router.post('/callback', async (req, res) => {
  const { communicationId, eventType } = req.body;
  if (!communicationId || !eventType) return res.status(400).json({ error: 'Missing parameters' });

  // Insert into communication_events
  const { error: eventError } = await supabase
    .from('communication_events')
    .insert([{ communication_id: communicationId, event_type: eventType }]);
    
  if (eventError) {
    console.error("Event insert error:", eventError);
  }

  // Update communications status
  const { error: commError } = await supabase
    .from('communications')
    .update({ status: eventType, updated_at: new Date().toISOString() })
    .eq('id', communicationId);
    
  if (commError) return res.status(500).json({ error: commError.message });

  res.json({ success: true });
});

module.exports = router;
