const entitiesConfig = require("./entitiesConfig");

const styleText = (text, entities) => {
  let result = `${text}`;
  let offset = 0;

  for (const entity of entities) {
    entity.offset += offset;

    const styler = entitiesConfig[entity.type];

    const substring = result.substring(
      entity.offset,
      entity.offset + entity.length
    );

    const pre = result.slice(0, entity.offset);

    const post = result.slice(entity.offset + entity.length);

    offset += 2 * styler.length;

    result = `${pre}${styler}${substring}${styler}${post}`;
  }

  console.log(result.replace(/\./g, "\\."));

  return result.replace(/\./g, "\\.");
};

module.exports = styleText;
