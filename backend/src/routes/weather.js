const express = require('express');
const { fetchWeather, getReport } = require('../controllers/weatherController');
const router = express.Router();

router.post('/', fetchWeather);
router.get('/report', getReport);

module.exports = router;
