const TelegramApi = require("node-telegram-bot-api");
const token = require("./secret");

const bot = new TelegramApi(token, { polling: true });

bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, `You texted ${msg.text}`);
});

