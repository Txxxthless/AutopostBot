class ScheduledMessage {
  constructor(date, chatId, channelId, media) {
    this.date = date;
    this.chatId = chatId;
    this.channelId = channelId;
    this.media = JSON.stringify(media);
  }
}

module.exports = ScheduledMessage;
