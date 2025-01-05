const { generatePodcastScript } = require('../services/podcastService');

async function podcastController(req, res) {
  try {
    const { topic, maleHostName, maleHostPersonality, femaleHostName, femaleHostPersonality, length } = req.body;

    if (!topic || !maleHostName || !femaleHostName || !length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const script = await generatePodcastScript(topic, maleHostName, maleHostPersonality, femaleHostName, femaleHostPersonality, length);

    res.render('index', { script });

  } catch (error) {
    console.error('Error in creating podcast script:', error.message);
    return res.status(500).json({ error: 'Failed to generate podcast script.' });
  }
}

module.exports = podcastController;