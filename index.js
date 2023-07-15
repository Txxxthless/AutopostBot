const TelegramApi = require("node-telegram-bot-api");
const ScheduledMessage = require("./models/scheduledMessage");
const token = require("./secret");
const processScheduledMessages = require("./processScheduledMessages");

const bot = new TelegramApi(token, { polling: true });
let scheduledMessages = [];

bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (msg.text.startsWith("/post")) {
    const [command, date, time, post] = text.split(" ");
    const postDate = new Date(`${date}T${time}`);

    if (postDate.toDateString() === "Invalid Date") {
      bot.sendMessage(
        chatId,
        "You've entered invalid date. Required date format is YY-MM-DD and time format is HH-MM-SS"
      );
      return;
    }

    scheduledMessages.push(new ScheduledMessage(postDate, post, chatId));
  }
});

setInterval(() => {
  scheduledMessages = processScheduledMessages(scheduledMessages, bot);
  console.log(scheduledMessages);
}, 10000);
