import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
});

export const getCustomers = () => api.get('/api/customers').then(res => res.data);
export const getCustomerStats = () => api.get('/api/customers/stats').then(res => res.data);
export const seedCustomers = () => api.post('/api/customers/seed').then(res => res.data);
export const generateCampaign = (stats) => api.post('/api/ai/generate-campaign', { stats }).then(res => res.data);
export const getCampaigns = () => api.get('/api/campaigns').then(res => res.data);
export const createCampaign = (payload) => api.post('/api/campaigns', payload).then(res => res.data);
export const launchCampaign = (id) => api.post(`/api/campaigns/${id}/launch`).then(res => res.data);
export const getCampaignStats = (id) => api.get(`/api/campaigns/${id}/stats`).then(res => res.data);
