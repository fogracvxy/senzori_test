const express = require("express");
const app = express();
const sensor = require("node-dht-sensor");
const { BMP280 } = require("@idenisovs/bmp280");
const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

let temperatura = 0;
let vlaznost = 0;
let pritisak = 0;
let temperaturaBMP280 = 0;

async function baroMetar() {
  try {
    const bmp280 = new BMP280({
      bus: 1,
      address: 0x76,
    });

    await bmp280.connect();

    const values = await bmp280.sensors();
    console.log(
      `Temperatura prostorije: ${values.temperature}°C, Pritisak : ${Math.round(
        values.pressure
      )} hPa`
    );
    pritisak = values.pressure;
    temperaturaBMP280 = values.temperature;
    await bmp280.disconnect();
  } catch (error) {
    console.error("Error in baroMetar:", error);
  }
}

function readDHTSensor() {
  sensor.read(11, 4, (err, temperature, humidity) => {
    if (!err) {
      console.log(
        `Temperatura prostorije: ${temperature}°C, Vlažnost prostorije: ${humidity}%`
      );
      vlaznost = humidity;
      temperatura = temperature;
    } else {
      console.error("Error in readDHTSensor:", err);
    }
  });
}

setInterval(baroMetar, 15000);
setInterval(readDHTSensor, 15000);

app.get("/senzor", (req, res) => {
  res.json({
    temperature: `${temperatura}°C`,
    humidity: `${vlaznost}%`,
    pressure: `${pritisak} hPa`,
    temperaturabmp280: `${temperaturaBMP280} °C`,
  });
});
