/* VOICES: 
Male 1: en-US-Journey-D 
Female 1: en-US-Journey-F

Male 2: en-GB-Journey-D
Female 2: en-GB-Journey-F
*/
const { v4: uuidv4 } = require('uuid');
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


async function generateAndStoreAudio(req, res) {
  const { dialogues } = req.body;

  if (!dialogues || !Array.isArray(dialogues) || dialogues.length === 0) {
    return res.status(400).json({ error: 'Dialogues array is required' });
  }

  for (const dialogue of dialogues) {
    if (!dialogue.text || !dialogue.voice) {
      return res.status(400).json({ error: 'Each dialogue must have both text and voice' });
    }
  }

  try {
    const audioContent = await processDialogues(dialogues);

    const audioId = uuidv4();

    // Store the audio in memory
    audioCache[audioId] = {
      audioContent,
      createdAt: Date.now(),
    };
    
    res.status(200).json({ audioId });
  } catch (error) {
    console.error('Error generating audio:', error.message);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
}