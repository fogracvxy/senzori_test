var express = require("express");
var app = express();
var sensor = require("node-dht-sensor");
const { BMP280 } = require('@idenisovs/bmp280');
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

let temperatura = 0
let vlaznost = 0
let pritisak = 0
let temperaturaBMP280 = 0

async function baroMetar (){
    const bmp280 = new BMP280({
        bus: 1,
        address: 0x76
    });

    await bmp280.connect();

    const values = await bmp280.sensors();
    console.log(`Temperatura prostorije: ${values.temperature}°C, Pritisak : ${Math.round(values.pressure)} hPa`);
    pritisak = values.pressure
    temperaturaBMP280 = values.temperature
    await bmp280.disconnect();

};

setInterval(() => {baroMetar()}, 15000)

setInterval( () => sensor.read(11, 4, function(err, temperature, humidity) {
  if (!err) {
    console.log(`Temperatura prostorije: ${temperature}°C, Vlažnost prostorije: ${humidity}%`);
    vlaznost = humidity;
    temperatura = temperature;

  }else{
    console.log(err);
  }
}), 15000)

app.get("/senzor", (req, res, next) => {
    res.json({temperature:  `${temperatura}°C`, humidity: `${vlaznost}%`, pressure: `${pritisak} hPa`, temperaturabmp280: `${temperaturaBMP280} °C` })
});