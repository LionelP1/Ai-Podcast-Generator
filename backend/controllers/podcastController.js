const { convertTextToSpeech } = require('./convertTextToSpeech');

const fs = require('fs').promises;
const audioCache = {};

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

    // Store the audio in cache
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

module.exports = { generateAndStoreAudio };