import { Auth } from "../models/index.js";
import { decodedPassword } from "../utils/hashPassword.js";
import { accessToken, refressToken } from "../utils/jwtSignToken.js";
export const registerUser = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const passwordCompare = await decodedPassword(password, user.password);
    if (!passwordCompare) {
      return res.status(401).json({ message: "password is wrong" });
    }
    const accessTokenCreate = await accessToken(user);
    const refreshTokenCreate = await refressToken(user);
    await user.update(
      { refreshToken: refreshTokenCreate },
      { where: { id: user.id } }
    );
    return res.status(200).json({
      message: "login success",
      accessTokenCreate,
      refreshTokenCreate,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res.status(401).json({ message: "Refresh token required" });

    const user = await Auth.findOne({ where: { refreshToken: token } });
    if (!user) return res.status(400).json({ message: "Token is Expired" });

    const accessToken = createAccessToken(user);
    return res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
