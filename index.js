const TelegramApi = require("node-telegram-bot-api");
const ScheduledMessage = require("./models/scheduledMessage");
const { token } = require("./secret");
const processScheduledMessages = require("./processScheduledMessages");
const configureDb = require("./configureDb");

const bot = new TelegramApi(token, { polling: true });
const { sequelize, Message } = configureDb();

bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  console.log(msg);

  if (msg.text.startsWith("/post")) {
    const [date, time, post] = text.replace("/post ", "").split(" $ ");
    const postDate = `${date}T${time}`;

    if (new Date(postDate).toDateString() === "Invalid Date") {
      bot.sendMessage(
        chatId,
        "You've entered invalid date. Required date format is YY-MM-DD and time format is HH-MM-SS"
      );
      return;
    }

    Message.create(new ScheduledMessage(postDate, post, chatId));
  }
});

setInterval(() => {
  processScheduledMessages(bot, Message);
}, 10000);
