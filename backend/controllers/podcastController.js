const { generatePodcast } = require('../services/podcastService');
const { processDialogues } = require('../services/textToSpeechService');

const { v4: uuidv4 } = require('uuid');
const audioCache = {};

async function generatePodcastController(req, res) {
  console.log("Request body:", req.body);
  console.log("hi");
  const {
    podcastTopic,
    maleHostName,
    maleHostPersonality,
    femaleHostName,
    femaleHostPersonality,
    length,
  } = req.body;

  const numOfWords = parseInt(length, 10) * 150;

  const participants = [
    {
      Name: maleHostName,
      Gender: 'male',
      SpeakingOrder: 1,
      voice: 'en-US-Journey-D',
      Personality: maleHostPersonality,
    },
    {
      Name: femaleHostName,
      Gender: 'female',
      SpeakingOrder: 2,
      voice: 'en-US-Journey-F',
      Personality: femaleHostPersonality,
    },
  ];

  try {
    const dialogues = await generatePodcast(numOfWords, podcastTopic, participants);

    const audioContent = await processDialogues(dialogues);

    const audioId = uuidv4();
    audioCache[audioId] = {
      audioContent,
      createdAt: Date.now(),
    };

    res.status(200).json({ audioId });
  } catch (error) {
    console.error('Error generating podcast:', error.message);
    res.status(500).json({ error: 'Failed to generate podcast' });
  }
}

async function serveAudio(req, res) {
  const { id } = req.params;

  const cachedAudio = audioCache[id];
  if (!cachedAudio) {
    return res.status(404).json({ error: 'Audio not found' });
  }

  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': `inline; filename="audio-${id}.mp3"`,
  });

  res.send(cachedAudio.audioContent);
}

async function downloadAudio(req, res) {
  const { id } = req.params;

  const cachedAudio = audioCache[id];
  if (!cachedAudio) {
    return res.status(404).json({ error: 'Audio not found' });
  }

  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': `attachment; filename="audio-${id}.mp3"`,
  });

  res.send(cachedAudio.audioContent);
}

module.exports = { generatePodcastController, serveAudio, downloadAudio };