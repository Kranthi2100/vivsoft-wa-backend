var app = require("express")();
var fetch = require("isomorphic-fetch");
var cors = require('cors')

const API = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.key}&q=20171&days=1`;

function parseHourlyForcast(data) {
  const hourlyData = data.forecast.forecastday[0].hour;

  return Object.values(hourlyData).map((value) => ({
    time: value.time,
    temp_f: value.temp_f
  }));
}

app.get('/', cors(), async (req, res) {
    try {
      const apiRes = await fetch(API);

      if (apiRes.status === 200) {
        const weatherData = await apiRes.json();

        
        const data = {
          current: {
            temp_f: weatherData.current.temp_f
          },
          forecast: parseHourlyForcast(weatherData)
        };

        return res.status(200).json(data);
      } else {
        throw new Error("status not handled");
      }
    } catch (error) {
      console.error(error);
      return res.status(500);
    }
  })

app.listen(8080); //the server object listens on port 8080
