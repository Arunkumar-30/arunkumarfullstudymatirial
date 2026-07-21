import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    return hashPassword;
  } catch (error) {
    throw new Error("error hashing password");
  }
};

export const decodedPassword = async (password, userPassword) => {
  try {
    const decodedPassword = await bcrypt.compare(password, userPassword);
    return decodedPassword;
  } catch (error) {
    throw new Error("password is mismatch");
  }
};
