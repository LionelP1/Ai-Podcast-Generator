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
  { text: "Welcome back to Beyond the Horizon, the podcast where we take you to the edge of the unknown and beyond, I’m your host, Mike Dawson, and joining me is my co-host, Dr. Emily Carter. How are you, Emily?   ", voice: 'en-US-Journey-D' },
  { text: "Welcome back to Beyond the Horizon, the podcast where we take you to the edge of the unknown and beyond, I’m your host, Mike Dawson, and joining me is my co-host, Dr. Emily Carter. How are you, Emily?, . ", voice: 'en-US-Journey-D' },
  { text: "I’m doing great, Mike! Excited to dive into today’s topic. Space exploration has been making headlines lately, and there’s so much to unpack.", voice: 'en-US-Journey-F' },
  { text: "Absolutely. From NASA’s Artemis program to private ventures like SpaceX and Blue Origin, it feels like we’re on the brink of a new space age. Let’s start with Artemis. Emily, can you break it down for our listeners?", voice: 'en-US-Journey-D' },
  { text: "Sure! Artemis is NASA’s ambitious program to return humans to the Moon and establish a sustainable presence there by the end of this decade. The ultimate goal. Using the Moon as a stepping stone for human missions to Mars. The program’s name is inspired by the Greek goddess Artemis, Apollo’s twin sister, which is fitting since it’s essentially the follow-up to the Apollo missions.", voice: 'en-US-Journey-F' },
  { text: "That’s a poetic touch, isn’t it? What’s remarkable is how international collaboration is shaping Artemis. The European Space Agency, Canada, Japan—they’re all on board. It’s like a global effort to push humanity into the cosmos.", voice: 'en-US-Journey-D' },
  ];

async function textToSpeech(text, voice) {
  const request = {
    input: { text },
    voice: { languageCode: voice.slice(0, 5), name: voice },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  return Buffer.from(response.audioContent, 'binary');
}

//Creates a silence which will be used after each dialog
function createSilence(durationSeconds, sampleRate = 24000) {
  const silenceSamples = Math.floor(durationSeconds * sampleRate);
  return Buffer.alloc(silenceSamples, 0);
}

//Convert dialog to audio and combine them
async function processDialogues(dialogues, silenceDuration = 0.5) {
  const silenceBuffer = createSilence(silenceDuration);
  let combinedAudioBuffer = Buffer.alloc(0);

  for (const dialogue of dialogues) {
    const audioBuffer = await textToSpeech(dialogue.text, dialogue.voice);
    combinedAudioBuffer = Buffer.concat([combinedAudioBuffer, audioBuffer, silenceBuffer]);
  }

  return combinedAudioBuffer;
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

const outputFile = 'journey_podcast.mp3';
createPodcast(outputFile, dialogues);







// const textToSpeech = require('@google-cloud/text-to-speech');

// const {writeFile} = require('node:fs/promises');

// const client = new textToSpeech.TextToSpeechClient();

// const text = `The Clockmaker's Gift
// In a quiet village nestled between two towering mountains, there lived an old clockmaker named Elias. His shop was small, crammed with cogs, springs, and half-finished clocks that seemed to tick in harmony with the pulse of the earth. People came from miles around to marvel at his creations, for Elias was said to craft clocks with hearts.

// One winter, as the first snow began to fall, a young girl named Mara entered his shop. She was no more than twelve, with fiery red hair and eyes that seemed too old for her face. Clutched in her hands was a broken pocket watch.

// “Can you fix it?” she asked, her voice trembling.

// Elias took the watch gently, inspecting the intricate engravings on its surface. It was unlike anything he had seen—tiny gears too delicate for human hands and markings written in a language long forgotten.

// “Where did you get this?” he asked.
// `;


// async function quickStart() {
//   try {

//     const request = {
//       input: { text: text },
//       voice: {
//         languageCode: 'en-US',
//         // name: 'en-US-Journey-F',
//         name: 'en-US-Journey-D',
//       },
//       audioConfig: { audioEncoding: 'MP3' },
//     };

//     console.log('Sending synthesis request...');
//     const [response] = await client.synthesizeSpeech(request);

//     console.log('Writing audio content to file...');
//     await writeFile('output.mp3', response.audioContent, 'binary');
//     console.log('Audio content successfully written to output.mp3');
//   } catch (error) {
//     console.error('An error occurred:', error.message);
//   }
// }

// (async () => {
//   await quickStart();
// })();