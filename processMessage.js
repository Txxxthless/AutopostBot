const processMessage = async (msg) => {
  if (msg.caption || msg.photo) {
    const caption = msg.caption ? msg.caption : null;

    const element = msg.photo.pop();

    const result = {
      type: "photo",
      media: element.file_id,
    };

    if (caption) {
      result.caption = caption;
    }

    return result;
  }
};

module.exports = processMessage;
