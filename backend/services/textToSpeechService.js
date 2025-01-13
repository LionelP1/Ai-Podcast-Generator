require('dotenv').config();
const fs = require('fs').promises;
const textToSpeech = require('@google-cloud/text-to-speech');
const { GoogleAuth } = require('google-auth-library');

const googleCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
if (!googleCredentials) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set');
}

const credentials = JSON.parse(googleCredentials);

const auth = new GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

const client = new textToSpeech.TextToSpeechClient({
  authClient: auth,
});

async function convertTextToSpeech(text, voice) {
  const request = {
    input: { text },
    voice: { languageCode: voice.slice(0, 5), name: voice },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  return Buffer.from(response.audioContent, 'binary');
}

/* Dialogs are in the form of:
  [
    { text: "Hello, how are you?", voice: "en-US-Wavenet-D" },
    { text: "I'm doing great, thank you!", voice: "en-US-Wavenet-C" }
  ];
*/
async function processDialogues(dialogues) {
  const audioBuffers = await Promise.all(
    dialogues.map(dialogue => convertTextToSpeech(dialogue.text, dialogue.voice))
  );
  return Buffer.concat(audioBuffers);
}

module.exports = { convertTextToSpeech, processDialogues };









// const fs = require('fs').promises;
// const textToSpeech = require('@google-cloud/text-to-speech');

// const client = new textToSpeech.TextToSpeechClient();

// async function convertTextToSpeech(text, voice) {
//   const request = {
//     input: { text },
//     voice: { languageCode: voice.slice(0, 5), name: voice },
//     audioConfig: { audioEncoding: 'MP3' },
//   };

//   const [response] = await client.synthesizeSpeech(request);
//   return Buffer.from(response.audioContent, 'binary');
// }

// /* Dialogs are in the form of:
//   [
//     { text: "Hello, how are you?", voice: "en-US-Wavenet-D" },
//     { text: "I'm doing great, thank you!", voice: "en-US-Wavenet-C" }
//   ];
// */
// async function processDialogues(dialogues) {
//   const audioBuffers = await Promise.all(
//     dialogues.map(dialogue => convertTextToSpeech(dialogue.text, dialogue.voice))
//   );
//   return Buffer.concat(audioBuffers);
// }

// module.exports = { convertTextToSpeech, processDialogues };
