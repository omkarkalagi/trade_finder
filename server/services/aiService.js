const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

async function analyzeStock(symbol) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    
    const prompt = `Act as a professional stock market analyst. 
    Provide a trading recommendation (BUY, SELL, or HOLD) for ${symbol} stock. 
    Include: 
    - Recommendation
    - Target price
    - Stop loss
    - Confidence level (0-100%)
    - Brief rationale (max 2 sentences)`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
}

module.exports = { analyzeStock };