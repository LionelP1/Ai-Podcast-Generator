const { GoogleGenerativeAI } = require('@google/generative-ai');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        maxOutputTokens: 1000,
        temperature: 1,
    }
});

async function generateSummary(userPrompt) {
  try {
    const requestPayload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: userPrompt
            }
          ]
        }
      ],
    };

    const apiResponse = await model.generateContent(requestPayload);

    const result = apiResponse.response?.candidates[0]?.content?.parts[0]?.text;

    if (!result) {
      throw new Error('Failed to generate a valid summary.');
    }

    return result;
  } catch (error) {
    console.error('Error in generateSummary:', error.message);
    throw new Error('An error occurred while generating the summary.');
  }
}

module.exports = { generateSummary };