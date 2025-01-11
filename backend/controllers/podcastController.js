const { generatePodcast } = require('../services/podcastService');
const { processDialogues } = require('../services/textToSpeechService');

const { v4: uuidv4 } = require('uuid');
const audioCache = {};

async function generatePodcastController(req, res) {
  let { numOfWords, podcastTopic, participants } = req.body;

  participants = JSON.parse(participants.trim());
  numOfWords = Number(numOfWords);

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

    // res.status(200).json({ audioId });
    res.render('index', { audioId }); //Change later
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