const { generatePodcast } = require('../services/podcastService');


async function podcastController(req, res) {
  try {
    const { topic, maleHostName, maleHostPersonality, femaleHostName, femaleHostPersonality, length } = req.body;

    if (!topic || !maleHostName || !femaleHostName || !length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const participants = [
      {
        Name: maleHostName,
        Gender: "male",
        SpeakingOrder: 1,
        voice: "en-US-Journey-D",
        Personality: maleHostPersonality,
      },
      {
        Name: femaleHostName,
        Gender: "female",
        SpeakingOrder: 2,
        voice: "en-US-Journey-F",
        Personality: femaleHostPersonality,
      }
    ];

    const numOfWords = 220 * length

    const podcastScript = await generatePodcast(numOfWords, topic, participants);


    res.render('index', { script: podcastScript });

  } catch (error) {
    console.error('Error in creating podcast script:', error.message);
    return res.status(500).json({ error: 'Failed to generate podcast script.' });
  }
}



module.exports = podcastController;