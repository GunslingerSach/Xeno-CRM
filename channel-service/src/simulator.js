const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// CRM_URL from environment
const CRM_URL = process.env.CRM_URL || process.env.BACKEND_API_URL || 'http://localhost:5000';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const sendCallback = async (communicationId, eventType) => {
  const url = `${CRM_URL}/api/receipts/callback`;
  const payload = { communicationId, eventType };

  try {
    await axios.post(url, payload);
    console.log(`[${new Date().toISOString()}] [SIMULATOR] Callback sent: ${eventType} for ${communicationId}`);
  } catch (error) {
    console.warn(`[Simulator] Callback failed for ${communicationId}. Retrying in 2s...`);
    await sleep(2000);
    try {
      await axios.post(url, payload);
      console.log(`[${new Date().toISOString()}] [SIMULATOR] Retry succeeded: ${eventType} for ${communicationId}`);
    } catch (retryError) {
      console.error(`[Simulator] Retry failed: ${eventType} for ${communicationId} - ${retryError.message}`);
    }
  }
};

const simulateDelivery = async (communication) => {
  const { id, channel } = communication;

  // 1. Wait random 1-4 seconds
  await sleep(randomInt(1000, 4000));

  // Determine delivery rate based on channel
  let deliveryRate = 0.85; // Default (SMS)
  const lowerChannel = channel ? channel.toLowerCase() : '';
  
  if (lowerChannel === 'whatsapp') deliveryRate = 0.92;
  else if (lowerChannel === 'sms') deliveryRate = 0.85;
  else if (lowerChannel === 'email') deliveryRate = 0.78;
  else if (lowerChannel === 'rcs') deliveryRate = 0.88;

  // 2. Determine outcome based on probabilities
  const isDelivered = Math.random() < deliveryRate;

  if (!isDelivered) {
    await sendCallback(id, 'failed');
    return; // Flow stops here if failed
  }

  await sendCallback(id, 'delivered');

  // 3. Wait 2-5 more seconds, then 60% chance opened
  await sleep(randomInt(2000, 5000));
  
  const isOpened = Math.random() < 0.60;
  if (!isOpened) return; // Flow stops here if not opened

  await sendCallback(id, 'opened');

  // 4. Wait 1-3 more seconds, then 35% chance clicked
  await sleep(randomInt(1000, 3000));

  const isClicked = Math.random() < 0.35;
  if (isClicked) {
    await sendCallback(id, 'clicked');
  }
};

module.exports = { simulateDelivery };
