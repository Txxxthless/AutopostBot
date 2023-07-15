const processScheduledMessages = (scheduledMessages, bot) => {
  const indexesToRemove = [];

  scheduledMessages.forEach(async (msg, index) => {
    if (msg.date < Date.now()) {
      indexesToRemove.push(index);
      await bot.sendMessage(msg.chatId, msg.post);
    }
  });

  if (indexesToRemove.length > 0) {
    scheduledMessages = scheduledMessages.filter((msg, index) => {
      if (!indexesToRemove.includes(index)) {
        return msg;
      }
    });
  }

  return scheduledMessages;
};

module.exports = processScheduledMessages;
