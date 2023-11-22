const axios = require("axios");
const fs = require("fs");
const { Input } = require("telegraf");
const { URL_CONSTANT, FILE_CONSTANTS } = require("../utilities/constants.js");

const calendarApi = async function (cityName) {
  return await axios({
    method: "get",
    url: composeUrl(cityName),
    responseType: "stream",
  });
};
const composeUrl = function (city) {
  function composeCityParam() {
    const url = new URL(URL_CONSTANT);
    url.searchParams.set("city", city);
    return url.href;
  }
  return composeCityParam();
};
const sendCalendarFile = function (data, cityName, ctx) {
  console.log(`called url: ${data.responseUrl}`);
  ctx.reply(`Weather requested for city: ${cityName}`);
  const dataStream = data.pipe(fs.createWriteStream(FILE_CONSTANTS.path));
  dataStream.on("finish", () => {
    ctx.sendDocument(
      Input.fromReadableStream(
        fs.createReadStream(FILE_CONSTANTS.path),
        FILE_CONSTANTS.name
      )
    );
    fs.rm(FILE_CONSTANTS.path, () => {});
  });
};

module.exports = { calendarApi, sendCalendarFile };
