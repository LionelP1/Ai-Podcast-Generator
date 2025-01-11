const express = require('express');
const { generatePodcastController, serveAudio, downloadAudio }   = require('../controllers/podcastController');

const router = express.Router();

router.post('/generate', generatePodcastController);

router.get('/audio/:id', serveAudio);

router.get('/audio/:id/download', downloadAudio);

module.exports = router;