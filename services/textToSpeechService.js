/* VOICES: 
Male 1: en-US-Journey-D 
Female 1: en-US-Journey-F

Male 2: en-GB-Journey-D
Female 2: en-GB-Journey-F
*/
const fs = require('fs').promises;
const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient();

const dialogues = [
  { text: "Welcome back to Beyond the Horizon, the podcast where we take you to the edge of the unknown and beyond, I’m your host, Mike Dawson, and joining me is my co-host, Dr. Emily Carter. How are you, Emily?\n", voice: 'en-US-Journey-D' },
  { text: "I’m doing great, Mike! Excited to dive into today’s topic. Space exploration has been making headlines lately, and there’s so much to unpack.\n", voice: 'en-US-Journey-F' },
  { text: "Absolutely. From NASA’s Artemis program to private ventures like SpaceX and Blue Origin, it feels like we’re on the brink of a new space age. Let’s start with Artemis. Emily, can you break it down for our listeners?\n", voice: 'en-US-Journey-D' },
  { text: "Sure! Artemis is NASA’s ambitious program to return humans to the Moon and establish a sustainable presence there by the end of this decade. The ultimate goal. Using the Moon as a stepping stone for human missions to Mars. The program’s name is inspired by the Greek goddess Artemis, Apollo’s twin sister, which is fitting since it’s essentially the follow-up to the Apollo missions.\n", voice: 'en-US-Journey-F' },
  { text: "That’s a poetic touch, isn’t it? What’s remarkable is how international collaboration is shaping Artemis. The European Space Agency, Canada, Japan—they’re all on board. It’s like a global effort to push humanity into the cosmos.\n", voice: 'en-US-Journey-D' },
  ];

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

const outputFile = 'journey_podcast1.mp3';
createPodcast(outputFile, dialogues);

