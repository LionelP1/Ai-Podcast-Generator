const express = require('express');
const { generateAudio, downloadPodcast }   = require('../controllers/podcastController');

const router = express.Router();

router.post('/generate-audio', generateAudio);

router.post('/download-audio', downloadPodcast);

module.exports = router;