const express = require('express');
const podcastController  = require('../controllers/podcastController');

const router = express.Router();

router.post('/', podcastController);

module.exports = router;