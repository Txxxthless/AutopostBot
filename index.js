const TelegramApi = require("node-telegram-bot-api");
const ScheduledMessage = require("./models/scheduledMessage");
const { token, chat } = require("./secret");
const processScheduledMessages = require("./processScheduledMessages");
const configureDb = require("./configureDb");
const processMessage = require("./processMessage");

const bot = new TelegramApi(token, { polling: true });
let inMemoryPosts = [];
const { sequelize, Message } = configureDb();

const isInMemoryPost = (chatId) => {
  for (const element of inMemoryPosts) {
    if (element.chatId === chatId) {
      return element;
    }
  }
  return null;
};

bot.on("message", async (msg) => {
  const text = msg.text ? msg.text : null;
  const chatId = msg.chat.id;

  const channel = await bot.getChat(chat);
  const channelId = channel.id;

  if (text && text.startsWith("/create")) {
    const [date, time] = text.replace("/create ", "").split(" ");

    if (!date || !time) {
      bot.sendMessage(
        chatId,
        "❌ You need to specify date and time [ /create DATE TIME ]"
      );
      return;
    }

    const postDate = `${date}T${time}`;

    if (new Date(postDate).toDateString() === "Invalid Date") {
      bot.sendMessage(
        chatId,
        "❌ You've entered invalid date. Required date format is YY-MM-DD and time format is HH:MM:SS"
      );
      return;
    }

    inMemoryPosts.push({
      chatId: chatId,
      channelId: channelId,
      postDate: postDate,
      media: [],
    });
    bot.sendMessage(chatId, "👍 Everything is correct. Send your post now.");
    return;
  }

  if (text && text.startsWith("/end")) {
    const post = isInMemoryPost(chatId);

    if (post) {
      post.media.sort((a, b) => (b.caption ? 1 : -1));
      Message.create(
        new ScheduledMessage(
          post.postDate,
          post.chatId,
          post.channelId,
          post.media
        )
      );
    } else {
      bot.sendMessage(
        chatId,
        "❌ You first need to call [ /create DATE TIME ]"
      );
    }
    return;
  }

  const post = isInMemoryPost(chatId);

  if (post) {
    const processedMessage = await processMessage(msg, bot);
    post.media.push(processedMessage);
  } else {
    bot.sendMessage(chatId, "❌ You first need to call [ /create DATE TIME ]");
  }
});

setInterval(() => {
  processScheduledMessages(bot, Message);
}, 10000);
