const { convertTextToSpeech } = require('./convertTextToSpeech');

async function generateAudio(req, res) {
  const { text, voice } = req.body;

  if (!text || !voice) {
    return res.status(400).json({ error: 'Text and voice are required' });
  }

  try {
    const audioContent = await convertTextToSpeech(text, voice);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'inline; filename="audio.mp3"',
    });

    res.send(audioContent);
  } catch (error) {
    console.error('Error generating audio:', error.message);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
}


async function downloadPodcast(req, res) {
  const { text, voice } = req.body;

  if (!text || !voice) {
    return res.status(400).json({ error: 'Text and voice are required' });
  }

  try {
    const audioContent = await convertTextToSpeech(text, voice);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="audio.mp3"',
    });

    res.send(audioContent);
  } catch (error) {
    console.error('Error generating audio:', error.message);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
}

module.exports = { generateAudio, downloadPodcast };