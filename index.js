const express = require('express');
const fetch = require('node-fetch');
const API_KEY = "2590a20cae3b7d5dab4dd3104cab54bd"


const app = express()
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});

app.use(express.json())

app.post('/webhook', async (req, res) => {
  console.log("Dialogflow: Received a POST request");
  if (!req.body) return res.sendStatus(400)
  console.log("Content: " + req.body)
  console.log("geo-City: " + req.body.queryResult.parameters['geo-city']);

  var city =  req.body.queryResult.parameters['geo-city'];

  var response = await getWeather(city);

  let responseObj = {
    "fulfillmentText": response,
    "fulfillmentMessages": [
      {
        "text": {
          "text": [
            response
          ]
        }
      }
    ],
    "source": ""
  }

  console.log("Response: " + JSON.stringify(responseObj));

  return res.json(responseObj)
})


async function getWeather(city){
  const weather_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  console.log(weather_url);
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();
  let response = await parseWeatherData(weather_data);
  return response;
}

async function parseWeatherData(body){
  let weatherData = body;
  if(weatherData.cod != 200) {
    return "Unable to get weather " + weatherData.message
  }
  else {
    return "Right now its " + weatherData.main.temp + " degree with " + weatherData.weather[0].description;
  }
}

app.get('/sample', async (req, res) => {
    var response = await getWeather(req.query.q)

    res.json({"response": response});  
})
