const { sendCalendarFile, calendarApi: callCalendarApi } = require("./api.js");
const { COMMANDS_CONSTANTS: commands } = require("../utilities/constants.js");
const schedule = require("node-schedule");

function startBot(bot) {
  bot.start((ctx) => {
    console.log("Bot started - Welcome from CLI");
    ctx.reply("Welcome to weather in calendar bot!");
    calendarTimer(ctx);
  });

  bot.launch();
}

function setupBotCommands(bot) {
  let cityName = "bari";

  // weather command
  bot.command(commands.weather, async (ctx) => {
    const response = await callCalendarApi(cityName);
    sendCalendarFile(response.data, cityName, ctx);
  });
  // city command
  bot.command(commands.city, (ctx) => {
    ctx.reply("Write your city name ");
    bot.on("text", (ctx) => {
      const city = ctx.message.text.toLowerCase();
      const checkCityRegex = new RegExp("^[a-zØ-öø-ÿs]+$", "g");
      if (checkCityRegex.test(city)) {
        cityName = city;
        ctx.reply(`Selected city: ${cityName}`);
      } else {
        ctx.reply("Invalid characters - Please try again!");
      }
    });
  });
  // all command
  bot.command(commands.all, (ctx) => {
    ctx.telegram.getMyCommands().then((res) => {
      ctx.reply(res.map((r) => `/${r.command} - ${r.description}\n`).join(""));
    });
  });
}

function calendarTimer(ctx) {
  console.log("Started Timer");
  schedule.scheduleJob("0 0 * * 0", async () => {
    const response = await callCalendarApi(cityName);
    sendCalendarFile(response.data, cityName, ctx);
  });
}

module.exports = { startBot, setupBotCommands, calendarTimer };
