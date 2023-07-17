class ScheduledMessage {
  constructor(date, chatId, channelId, media) {
    this.date = date;
    this.chatId = chatId;
    this.channelId = channelId;
    this.media =
      typeof media[0] === "object" ? JSON.stringify(media) : media[0];
  }
}

module.exports = ScheduledMessage;
