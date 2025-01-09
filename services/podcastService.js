const { generateText } = require('./aiService');

/* Participants array will be in this form, i.e an array of the participants in the podcast
 [
   {
     Name: "Bob",
     Gender: "male",
     SpeakingOrder: 1,
     voice: "en-US-Journey-D"    
     Personality: "Funny",
    
   },
   {
     Name: "Alice",
     Gender: "female",
     SpeakingOrder: 2,
     voice: "en-US-Journey-F",
     Personality: "Professional",
   }
 ]
*/

function countWordsInText(text) {
  const words = text.trim().split(/\s+/);
  return words.length;
}

async function generatePodcast( numOfWords, podcastTopic, participants) {
  participants.sort((a, b) => a.SpeakingOrder - b.SpeakingOrder);

  const wordsBeforeEnding = numOfWords - 50;
  let currentWordCount = 0;
  let conversationHistory = [];
  let conversationRecent = [];
  let currentSpeakerIndex = 0;
 
  while (currentWordCount < wordsBeforeEnding) {
    const currentSpeaker = participants[currentSpeakerIndex];

    const promptText = `

  `;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: promptText
          }
        ]
      }
    ],
  };



  }

}

module.exports = { generatePodcast };