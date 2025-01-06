const { GoogleGenerativeAI } = require('@google/generative-ai');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        maxOutputTokens: 800,
        temperature: 1,
    }
});

async function generateText(payload) {
  try {
    const apiResponse = await model.generateContent(payload);

    const result = apiResponse.response?.candidates[0]?.content?.parts[0]?.text;

    if (!result) {
      throw new Error('Failed to generate a valid text.');
    }

    return result;
  } catch (error) {
    console.error('Error in generateText:', error.message);
    throw new Error('An error occurred while generating the text.');
  }
}

module.exports = { generateText };