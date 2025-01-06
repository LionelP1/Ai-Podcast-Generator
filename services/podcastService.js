const { generateText } = require('./aiService');

async function generatePodcastScript(topic, maleHostName, maleHostPersonality, femaleHostName, femaleHostPersonality, length) {
  try {
    // const userPrompt = `The topic of the podcast is: ${topic}. 
    // The male host is ${maleHostName}, who has a ${maleHostPersonality} personality. 
    // The female host is ${femaleHostName}, who has a ${femaleHostPersonality} personality. 
    // The podcast should be engaging and informative, with a length of approximately ${length} minutes. 
    // Start the conversation and make sure to generate a proper conclusion`;

//     const userPrompt = `Generate a podcast script as SSML with two speakers: 
// 1. The male host (${maleHostName}) with a ${maleHostPersonality} personality.
// 2. The female host (${femaleHostName}) with a ${femaleHostPersonality} personality. 
// The topic is: ${topic}. 
// Ensure that each speaker is identified, and their lines are enclosed in appropriate SSML <speak> tags. 
// Provide pauses between lines using <break> tags, and make sure the script is engaging, informative, and includes a proper conclusion.`;

const userPrompt = `Generate a conversational podcast script in JSON format. 
There are two speakers: 
1. John, who has a witty and engaging personality.
2. Jane, who has a thoughtful and curious personality. 
The podcast topic is: ${topic}. 
Alternate between the speakers in a natural flow. Ensure the JSON has the following structure:
{
  "conversation": [
    { "speaker": "John", "text": "First line of dialogue." },
    { "speaker": "Jane", "text": "Response line of dialogue." },
    ...
  ]
} Only give the json object no other text that will change the form`;




    const payload = {
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

    const script = await generateText(payload);
    return script;
  } catch (error) {
    console.error('Error generating podcast script:', error.message);
    throw new Error('Failed to generate podcast script.');
  }
}

module.exports = { generatePodcastScript };