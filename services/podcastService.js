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
      Generate a response for this podcast, nothing more.
      The podcast topic is: "${podcastTopic}".
      The recent conversation is:\n"${conversationRecent.join('\n')}"\nIf there is no past conversation, the podcast is beginning. Generate an appropriate introduction.
      The response should reflect the personality of "${currentSpeaker.Personality}".
      The podcast will not conclude; the next response is based on the history given.
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

    try {
      //Generate dialog
      const dialogGenerated = await generateText(payload);

      //Add the newly generated dialog to the history
      conversationHistory.push(dialogGenerated);
      if (conversationHistory.length > 0){
        conversationRecent = conversationHistory.slice(-1);
      }
 
      //Use modular arithmetic to get the next speaker index
      currentSpeakerIndex = (currentSpeakerIndex + 1) % participants.length;

      // Update word count and break if limit is exceeded
      const wordsInDialog = countWordsInText(dialogGenerated);
      if (currentWordCount + wordsInDialog > wordsBeforeEnding) break;
      currentWordCount += wordsInDialog;
    
    } catch (error) {
      console.error('Error generating dialogue:', error.message);
      throw new Error('An error occurred while generating the podcast.');
    }

  // Generate a conclusion for each participant
  for (let i = 0; i < participants.length; i++) {
    const currentSpeaker = participants[currentSpeakerIndex];

    const promptText = ``;

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

  return conversationHistory;

}

module.exports = { generatePodcast };