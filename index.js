const { Telegraf } = require("telegraf");
const { startBot, setupBotCommands } = require("./bot/commands.js");
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);
startBot(bot);
setupBotCommands(bot);
