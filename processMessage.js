const axios = require("axios");

const processMessage = async (msg, bot) => {
  if (msg.caption || msg.photo) {
    const caption = msg.caption ? msg.caption : null;

    const element = msg.photo.pop();

    const url = await bot.getFileLink(element.file_id);

    const result = {
      type: "photo",
      media: url,
    };

    if (caption) {
      result.caption = caption;
    }

    return result;
  }
};

module.exports = processMessage;
