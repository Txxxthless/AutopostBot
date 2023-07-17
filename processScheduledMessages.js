const path = require("path");
const fsExtra = require("fs-extra");

const processScheduledMessages = async (bot, Message) => {
  try {
    const messages = await Message.findAll();

    messages.forEach(async (msg) => {
      if (new Date(msg.date) < Date.now()) {
        const media = JSON.parse(msg.media);
        console.log(
          "=============================MEDIA===============================",
          media
        );

        for (let index = 0; index < media.length; index++) {
          const element = media[index];
          const filePath = await bot.downloadFile(
            element.media,
            path.resolve(__dirname, `temp`)
          );
          element.media = filePath;

          if (index === media.length - 1) {

            await bot.sendMediaGroup(msg.channelId, media);

            await Message.destroy({ where: { id: msg.id } });
            await fsExtra.emptyDirSync(path.resolve(__dirname, "temp"));
            return;
          }
        }
      }
    });
  } catch (error) {
    console.log("error");
  }
};

module.exports = processScheduledMessages;
