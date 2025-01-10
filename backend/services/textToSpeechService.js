/* VOICES: 
Male 1: en-US-Journey-D 
Female 1: en-US-Journey-F

Male 2: en-GB-Journey-D
Female 2: en-GB-Journey-F
*/
const fs = require('fs').promises;
const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

async function convertTextToSpeech(text, voice) {
  const request = {
    input: { text },
    voice: { languageCode: voice.slice(0, 5), name: voice },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  return Buffer.from(response.audioContent, 'binary');
}

async function processDialogues(dialogues) {
  const audioBuffers = await Promise.all(
    dialogues.map(dialogue => convertTextToSpeech(dialogue.text, dialogue.voice))
  );
  return Buffer.concat(audioBuffers);
}

async function createPodcast(outputFile, dialogues) {
  try {
    console.log('Processing dialogues...');
    const combinedAudioBuffer = await processDialogues(dialogues);

    console.log(`Saving podcast to file: ${outputFile}`);
    await fs.writeFile(outputFile, combinedAudioBuffer);

    console.log(`Podcast saved successfully as: ${outputFile}`);
  } catch (error) {
    console.error('Error creating podcast:', error.message);
  }
}
