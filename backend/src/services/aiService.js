const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

// We are using Gemini (@google/generative-ai) as requested in the first prompt
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateCampaignContent = async (customerStats) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-lite-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert CRM marketer for a retail brand. 
      Based on the following customer stats, generate two short, compelling SMS/Email message variants to prevent churn:
      1. For 'critical' tier customers (High risk, high value)
      2. For 'at_risk' tier customers (Medium risk, medium value)
      
      Customer Stats Context:
      ${JSON.stringify(customerStats, null, 2)}
      
      Requirements:
      - Include the exact placeholder {name} for personalization.
      - Make the critical message more aggressive with an offer (e.g. 20% off).
      - Make the at_risk message a gentle re-engagement (e.g. 10% off or free shipping).
      - Output valid JSON only exactly in this format: { "criticalVariant": "...", "atRiskVariant": "..." }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    if (text.startsWith('```json')) text = text.replace('```json', '');
    if (text.endsWith('```')) text = text.replace('```', '');
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error('Error generating AI campaign content:', error);
    return {
      criticalVariant: "Hi {name}! We miss you. Come back now and get 20% off your next order!",
      atRiskVariant: "Hey {name}, it's been a while! Here is 10% off to welcome you back."
    };
  }
};

module.exports = { generateCampaignContent };
