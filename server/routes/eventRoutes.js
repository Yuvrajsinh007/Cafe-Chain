// server/routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const { getActiveEvents } = require('../controllers/eventController');

// This is the public endpoint that both your User and Cafe frontends will call.
router.get('/active', getActiveEvents);

module.exports = router;