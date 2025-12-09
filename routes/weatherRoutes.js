const express = require('express');
const router = express.Router();
const axios = require('axios');
const City = require('../models/City');

// get weather data from api
router.post('/search', async (req, res) => {
  try {
    const { city } = req.body;
    const apiKey = process.env.WEATHER_API_KEY;
    
    const response = await axios.get(
      `https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}&units=I`
    );

    const weatherData = response.data.data[0];
    
    // save to mongodb
    const newCity = new City({
      cityName: weatherData.city_name,
      country: weatherData.country_code,
      temperature: weatherData.temp,
      description: weatherData.weather.description,
      humidity: weatherData.rh,
      windSpeed: weatherData.wind_spd
    });

    await newCity.save();

    res.json({
      success: true,
      data: {
        city: weatherData.city_name,
        country: weatherData.country_code,
        temperature: weatherData.temp,
        description: weatherData.weather.description,
        humidity: weatherData.rh,
        windSpeed: weatherData.wind_spd,
        icon: weatherData.weather.icon
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching weather data. Please check city name.' 
    });
  }
});

// get saved cities from mongodb
router.get('/history', async (req, res) => {
  try {
    const cities = await City.find().sort({ searchedAt: -1 }).limit(20);
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving history' });
  }
});

// clear history
router.delete('/clear', async (req, res) => {
  try {
    await City.deleteMany({});
    res.json({ success: true, message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clearing history' });
  }
});

module.exports = router;