require('dotenv').config();
const express = require('express');
const { RestClient } = require('@signalwire/compatibility-api');
const axios = require('axios');

const app = express();

app.post('/', (req, res) => {
  const laml = new RestClient.LaML.VoiceResponse();
  const gather = laml.gather({
    input: 'dtmf',
    timeout: 10,
    numDigits: 5,
    action: '/weather',
    method: 'GET',
  });
  gather.say('Welcome to our demo. Please enter the postcode for a weather query.');
  laml.say('We did not receive any input');

  console.log(laml.toString());
  res.type('text/xml');
  res.send(laml.toString());
});

app.get('/weather', async (req, res) => {
  const digitPressed = req.query.Digits;
  const laml = new RestClient.LaML.VoiceResponse();

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${digitPressed},DE&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);
    const weatherData = response.data;
    laml.say(`In ${weatherData.name} it is ${weatherData.main.temp} degrees.`);
  } catch (error) {
    console.log('Error while getting weather data:', error);
    laml.say('Error while getting weather data.');
  }

  laml.hangup();
  console.log(laml.toString());
  res.type('text/xml');
  res.send(laml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
