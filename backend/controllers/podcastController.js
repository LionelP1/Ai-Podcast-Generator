const { generatePodcast } = require('../services/podcastService');
const { processDialogues } = require('./convertTextToSpeech');

const { v4: uuidv4 } = require('uuid');
const audioCache = {};

async function generatePodcastController(req, res) {
  const { numOfWords, podcastTopic, participants } = req.body;

  if (!numOfWords || !podcastTopic || !participants || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ error: 'Please provide numOfWords, podcastTopic, and participants' });
  }

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