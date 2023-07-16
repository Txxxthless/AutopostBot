const { Sequelize, DataTypes } = require("sequelize");
const { Database } = require("sqlite3");

const configureDb = () => {
  const db = new Database("botdb.sqlite");

  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS ScheduledMessages (id INTEGER PRIMARY KEY, date TEXT, chatId INTEGER, channelId INTEGER, media TEXT, createdAt TEXT, updatedAt TEXT)"
    );
  });

  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "botdb.sqlite",
  });

  const Message = sequelize.define("ScheduledMessage", {
    date: DataTypes.TEXT,
    chatId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER,
    media: DataTypes.TEXT,
  });

  return { sequelize, Message };
};

module.exports = configureDb;
