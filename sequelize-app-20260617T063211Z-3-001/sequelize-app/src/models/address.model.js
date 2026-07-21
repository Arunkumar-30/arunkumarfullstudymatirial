const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Address", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    contactId: DataTypes.INTEGER,
  });
};