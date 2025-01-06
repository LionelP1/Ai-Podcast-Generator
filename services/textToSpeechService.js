
const textToSpeech = require('@google-cloud/text-to-speech');

const {writeFile} = require('node:fs/promises');

const client = new textToSpeech.TextToSpeechClient();

const text = `The Clockmaker's Gift
In a quiet village nestled between two towering mountains, there lived an old clockmaker named Elias. His shop was small, crammed with cogs, springs, and half-finished clocks that seemed to tick in harmony with the pulse of the earth. People came from miles around to marvel at his creations, for Elias was said to craft clocks with hearts.

One winter, as the first snow began to fall, a young girl named Mara entered his shop. She was no more than twelve, with fiery red hair and eyes that seemed too old for her face. Clutched in her hands was a broken pocket watch.

“Can you fix it?” she asked, her voice trembling.

Elias took the watch gently, inspecting the intricate engravings on its surface. It was unlike anything he had seen—tiny gears too delicate for human hands and markings written in a language long forgotten.

“Where did you get this?” he asked.
`;


async function quickStart() {
  try {

    const request = {
      input: { text: text },
      voice: {
        languageCode: 'en-US',
        // name: 'en-US-Journey-F',
        name: 'en-US-Journey-D',
      },
      audioConfig: { audioEncoding: 'MP3' },
    };

    console.log('Sending synthesis request...');
    const [response] = await client.synthesizeSpeech(request);

    console.log('Writing audio content to file...');
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content successfully written to output.mp3');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

(async () => {
  await quickStart();
})();