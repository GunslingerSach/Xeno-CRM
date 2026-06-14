const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { simulateDelivery } = require('./simulator');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// POST /send - receives communication from CRM
app.post('/send', (req, res) => {
  const { id, channel, recipient, message } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Communication ID is required' });
  }

  // Immediately return success response
  res.json({ accepted: true });

  // Asynchronously call simulateDelivery without awaiting
  simulateDelivery({ id, channel, recipient, message }).catch(err => {
    console.error(`Simulation error for ${id}:`, err);
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'xenocrm-channel-service' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] [SERVER] Channel Service running on port ${PORT}`);
});
