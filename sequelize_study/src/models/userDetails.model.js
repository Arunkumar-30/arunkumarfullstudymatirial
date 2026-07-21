import { DataTypes } from "sequelize";
import Sequelize from "../config/db.js";

const userDetailsModel = Sequelize.define(
  "UserDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "others", "not specified"),
      defaultValue: "not specified",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timeStamps: true }
);

export default userDetailsModel;
