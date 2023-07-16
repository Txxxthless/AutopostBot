const fs = require("fs");
const request = require("request");
const path = require("path");
const fsExtra = require("fs-extra");

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

const processScheduledMessages = async (bot, Message) => {
  try {
    const messages = await Message.findAll();

    messages.forEach(async (msg) => {
      if (new Date(msg.date) < Date.now()) {
        const media = JSON.parse(msg.media);
        console.log("=============================MEDIA===============================", media);

        media.forEach((element, index) => {
          download(
            element.media,
            path.join(__dirname, `temp/${msg.chatId}${index}.jpg`),
            async () => {
              if (index === media.length - 1) {
                media.forEach((element, index) => {
                  element.media = path.resolve(
                    __dirname,
                    `temp/${msg.chatId}${index}.jpg`
                  );
                });

                await bot.sendMediaGroup(msg.channelId, media);

                await Message.destroy({ where: { id: msg.id } });
                await fsExtra.emptyDirSync(path.resolve(__dirname, "temp"));
              }
            }
          );
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = processScheduledMessages;
