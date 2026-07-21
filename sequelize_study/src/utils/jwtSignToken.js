import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const accessToken = (user) => {
  try {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES_IN }
    );
  } catch (error) {
    console.log("token creating error" + error.message);
  }
};
export const refressToken = (user) => {
  try {
    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_EXPIRES_IN,
    });
  } catch (error) {
    console.log("token creating error" + error.message);
  }
};
