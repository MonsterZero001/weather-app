const jwt = require('jsonwebtoken');
const axios = require('axios');
const db = require('../config/db');

exports.fetchWeather = (req, res) => {
  const { city } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${city}`)
      .then((response) => {
        const weatherInfo = response.data;

        db.query(
          'INSERT INTO search_history (user_id, city, weather_info, searched_at) VALUES (?, ?, ?, NOW())',
          [decoded.id, city, JSON.stringify(weatherInfo)],
          (err) => {
            if (err) return res.status(500).send('Error saving search.');
            res.json(weatherInfo);
          }
        );
      })
      .catch(() => res.status(500).send('Error fetching weather data.'));
  } catch {
    res.status(401).send('Unauthorized.');
  }
};

exports.getReport = (req, res) => {
  db.query(
    'SELECT users.username, search_history.city, search_history.weather_info, search_history.searched_at FROM search_history JOIN users ON search_history.user_id = users.id',
    (err, results) => {
      if (err) return res.status(500).send('Error fetching report.');
      res.json(results);
    }
  );
};
