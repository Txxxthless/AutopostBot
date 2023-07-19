const styleText = require("./text-styling/index");

const processMessage = async (msg) => {
  if (msg.caption || msg.photo) {
    const caption = msg.caption ? msg.caption : null;

    const element = msg.photo.pop();

    const result = {
      type: "photo",
      media: element.file_id,
    };

    if (caption) {
      result.caption = styleText(caption, msg.caption_entities);
      result.parse_mode = "MarkdownV2";
    }

    return result;
  }

  if (msg.text) {
    const result = styleText(msg.text, msg.entities);
    return result;
  }
};

module.exports = processMessage;
