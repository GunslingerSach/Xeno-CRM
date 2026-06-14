// Trigger restart
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import Routes
const customersRoutes = require('./src/routes/customers');
const campaignsRoutes = require('./src/routes/campaigns');
const receiptsRoutes = require('./src/routes/receipts');
const aiRoutes = require('./src/routes/ai');
const insightsRoutes = require('./src/routes/insights');
const chatRoutes = require('./src/routes/chat');

// Mount Routes
app.use('/api/customers', customersRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/receipts', receiptsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'xenocrm-backend' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] [SERVER] Backend running on port ${PORT}`);
});
