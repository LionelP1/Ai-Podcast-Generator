const { generateText } = require('./aiService');

async function generatePodcastScript(topic, maleHostName, maleHostPersonality, femaleHostName, femaleHostPersonality, length) {
  try {
    const systemInstruction = `You are generating a conversational podcast script. The male host is ${maleHostName}, who has a ${maleHostPersonality} personality. The female host is ${femaleHostName}, who has a ${femaleHostPersonality} personality. The podcast should be engaging and informative, with a length of approximately ${length} minutes.`;

    const userPrompt = `The topic of the podcast is: ${topic}. Start the conversation.`;

    const payload = {
      contents: [
        {
          role: 'system',
          parts: [
            {
              text: systemInstruction,
            },
          ],
        },
        {
          role: 'user',
          parts: [
            {
              text: userPrompt,
            },
          ],
        },
      ],
    };

    const script = await generateText(payload);
    return script;
  } catch (error) {
    console.error('Error generating podcast script:', error.message);
    throw new Error('Failed to generate podcast script.');
  }
}

module.exports = { generatePodcastScript };