var http = require("http");
var fetch = require("isomorphic-fetch");

const API = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.key}&q=20171&days=1`;

function parseHourlyForcast(data) {
  const hourlyData = data.forecast.forecastday[0].hour;

  return Object.values(hourlyData).map((value) => ({
    time: value.time,
    temp_f: value.temp_f
  }));
}

http
  .createServer(async function (req, res) {
    try {
      const apiRes = await fetch(API);

      if (apiRes.status === 200) {
        const weatherData = await apiRes.json();

        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        const data = {
          current: {
            temp_f: weatherData.current.temp_f
          },
          forecast: parseHourlyForcast(weatherData)
        };

        res.end(JSON.stringify(data));
      } else {
        throw new Error("status not handled");
      }
    } catch (error) {
      console.error(error);
      res.writeHead(500);
      return res.end();
    }
  })
  .listen(8080); //the server object listens on port 8080
