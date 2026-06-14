const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const CHANNEL_SERVICE_URL = process.env.CHANNEL_SERVICE_URL || 'http://localhost:5001';

const sendToChannel = async (communication) => {
  try {
    const { id, channel, recipient, message } = communication;
    const response = await axios.post(`${CHANNEL_SERVICE_URL}/send`, {
      id,
      channel,
      recipient,
      message
    });
    return response.data;
  } catch (error) {
    console.error(`Error sending communication ${communication.id} to channel service:`, error.message);
    throw error;
  }
};

module.exports = { sendToChannel };
