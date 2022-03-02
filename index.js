const express = require('express');
const fetch = require('node-fetch'); // node-fetch@2
require('dotenv').config();
const app = express();


// set up server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening at 3000'));
app.use(express.static('public')); // serving 'public/index.html'
app.use(express.json({ limit: '1mb' }));

app.post('/api', async (request, response) => {
    console.log(request.body)
    const lat = request.body.lat;
    const lon = request.body.lon;
    const api_key = process.env.weather_api_key;
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`; 
    const weather_resp = await fetch(weather_url);
    const weather_data = await weather_resp.json();

    const aq_url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`; 
    const aq_resp = await fetch(aq_url);
    const aq_data = await aq_resp.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    }
    response.json(data);
});


