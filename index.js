// Import required modules
const { config } = require('dotenv');
const { LaML } = require('@signalwire/compatibility-api').RestClient;
const axios = require('axios');
const express = require('express');

// Load environment variables
config();

// Initialize Express app
const app = express();

// Define constants
const PORT = process.env.PORT || 3000;
const XML_CONTENT_TYPE = 'text/xml';
const SERVER_OK_STATUS = 200;
const SERVER_ERROR_STATUS = 500;

// Define initial route for the incoming call
app.post('/', async (req, res) => {
  // Create new LaML response object
  const laml = new LaML.VoiceResponse();

  // Create gather object to collect user input
  const gather = laml.gather({
    input: 'dtmf',
    timeout: 10,
    numDigits: 5,
    action: '/weather',
    method: 'GET',
  });

  // Prompt user to enter postcode
  gather.say('Welcome to our demo. Please enter the postcode for a weather query.');

  // Say message if no input is received
  laml.say('We did not receive any input');

  // Log LaML response object
  console.log(laml.toString());

  // Send LaML response object as XML
  res.type(XML_CONTENT_TYPE);
  res.send(laml.toString());
});

// Define route for weather query
app.get('/weather', async (req, res, next) => {
  // Extract digitPressed from query string
  const { Digits: digitPressed } = req.query;

  // Create new LaML response object
  const laml = new LaML.VoiceResponse();

  try {
    // Call OpenWeather API to get weather data
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${digitPressed},DE&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`);

    // Extract relevant weather data
    const { name, main: { temp } } = response.data;

    // Say weather data to user
    laml.say(`In ${name} it is ${temp} degrees.`);
  } catch (error) {
    console.log('Error while getting weather data:', error);

    // Pass error to error handling middleware
    return next(error);
  }

  // Hang up the call
  laml.hangup();

  // Log LaML response object
  console.log(laml.toString());

  // Send LaML response object as XML
  res.type(XML_CONTENT_TYPE);
  res.send(laml.toString());
});

// Define route for health check
app.get('/health', (req, res) => {
  res.status(SERVER_OK_STATUS).send('OK - healthy');
});

// Define error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(SERVER_ERROR_STATUS).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});
