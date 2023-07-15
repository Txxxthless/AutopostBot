const { Sequelize } = require("sequelize");

const processScheduledMessages = async (bot, Message) => {
  try {
    const messages = await Message.findAll();

    messages.forEach(async (msg) => {
      if (new Date(msg.date) < Date.now()) {
        bot.sendMessage(msg.chatId, msg.post);
        Message.destroy({ where: { id: msg.id } });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = processScheduledMessages;
