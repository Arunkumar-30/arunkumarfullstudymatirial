const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Contact", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    phone: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
  });
};