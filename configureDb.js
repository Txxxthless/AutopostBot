const { Sequelize, DataTypes } = require("sequelize");
const { Database } = require("sqlite3");

const configureDb = () => {
  const db = new Database("botdb.sqlite");

  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS ScheduledMessages (id INTEGER PRIMARY KEY, post TEXT, date TEXT, chatId INTEGER, createdAt TEXT, updatedAt TEXT)"
    );
  });

  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "botdb.sqlite",
  });

  const Message = sequelize.define("ScheduledMessage", {
    post: DataTypes.TEXT,
    date: DataTypes.TEXT,
    chatId: DataTypes.INTEGER,
  });
  
  return { sequelize, Message };
};

module.exports = configureDb;
