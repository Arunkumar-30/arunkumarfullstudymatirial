import { DataTypes } from "sequelize";
import Sequelize from "../config/db.js";

const authModel = Sequelize.define(
  "Auth",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refressToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { timeStamps: true }
);

export default authModel;
