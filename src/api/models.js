const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Video = sequelize.define("Video", {
  name: DataTypes.STRING,
  path: DataTypes.STRING,
  size: DataTypes.INTEGER,
  duration: DataTypes.FLOAT,
  status: DataTypes.STRING,
  trimmedPath: DataTypes.STRING,
  subtitlePath: DataTypes.STRING,
  finalPath: DataTypes.STRING,
});

module.exports = { Video };
