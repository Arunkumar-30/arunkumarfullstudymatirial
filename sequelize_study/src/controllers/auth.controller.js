import authModel from "../models/auth.model.js";
import userDetailsModel from "../models/userDetails.model.js";
import { hashPassword, decodedPassword } from "../utils/hashPassword.js";
import Sequelize from "sequelize";

import { Op } from "sequelize";

export const getAgeDetails = async (req, res) => {
  try {
    // const user = await authModel.findAll({
    //   include: { model: userDetailsModel },
    // });
    // const { age } = req.body;

    // if (!age) {
    //   return res.status(400).json({ message: "Age is required" });
    // }
    // const userId = req.params.id;

    // await userDetailsModel.update(
    //   { age: Sequelize.literal("age+1") },
    //   { where: { city: "chennai" } }
    // );
    // const today = new Date("2025-12-04");
    // today.setHours(0, 0, 0, 0);
    // console.log(today);
    // console.log("today", today.toLocaleTimeString());
    // const yesterdaty = new Date(today);

    // yesterdaty.setDate(today.getDate() - 1);
    // console.log("yser", yesterdaty);
    // console.log("yesterday", yesterdaty.toLocaleTimeString());
    // const users = await userDetailsModel.findAll({
    //   where: {
    //     updatedAt: {
    //       [Op.between]: [yesterdaty, today],
    //     },
    //   },
    // });
    const users = await userDetailsModel.findAll({
      // where: { gender: { [Op.ne]: ["male"] } },
      // where: { [Op.or]: [{ city: "chennai" }, { age: { [Op.lt]: 34 } }] }
      // where: { city: "covai", age: { [Op.gt]: 20 } },
      // order: [["city", "ASC"]],
      where: {
        age: { [Op.gt]: 20 },
      },
      include: [
        {
          model: authModel,
          attributes: ["city"],
        },
      ],
    });
    if (users.length === 0) {
      return res.status(400).json({ message: "user is not found" });
    }
    // const users = await Sequelize.query(
    //   `SELECT * FROM auths RIGHT JOIN userdetails ON auths.id = userdetails.userId`,
    //   { type: Sequelize.QueryTypes.SELECT }
    // );
    return res
      .status(200)
      .json({ message: "age user detalis succssfully", data: users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const getAllAuth = async (req, res) => {
//   try {
//     const allUsers = await authModel.findAll({
//       include: { model: userDetailsModel },
//     });
//     return res
//       .status(201)
//       .json({ message: "all users get successfully", data: allUsers });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const getOneAuth = async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (isNaN(id)) {
//       return res.status(404).json({ message: "id was invalid" });
//     }
//     const user = await authModel.findOne({
//       where: { id: id },
//       include: { model: userDetailsModel },
//     });
//     if (!user) {
//       return res.status(404).json({ message: "user data is not found" });
//     }
//     return res
//       .status(200)
//       .json({ message: "one user details fetch successfully", data: user });
//   } catch (error) {
//     console.log(error);
//   }
// };
export const postAuth = async (req, res) => {
  try {
    const { email, password, age, city, gender } = req.body;
    const isEmail = await authModel.findOne({ where: { email: email } });
    if (isEmail) {
      return res.status(404).json({ message: "email id already is used" });
    }
    const salt_password = await hashPassword(password);
    // auth create
    const user = await authModel.create({ email, password: salt_password });
    // userdetails create
    const userDetail = await userDetailsModel.create({
      userId: user.id,
      age,
      city,
      gender,
    });
    return res
      .status(200)
      .json({ message: "user created successfully", user, userDetail });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const putAuth = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, password, age, city, gender } = req.body;
    if (isNaN(id)) {
      return res.status(404).json({ message: "invalid user id" });
    }
    const user = await authModel.findByPk(id, {
      include: { model: userDetailsModel },
    });
    if (!user) {
      return res.status(404).json({ message: "user is not found" });
    }

    let finalPassword = user.password;
    const isSamePassword = await decodedPassword(password, finalPassword);
    if (!isSamePassword) {
      finalPassword = await hashPassword(password);
    }

    await user.update({ email, password: finalPassword });
    if (user.UserDetail) {
      await user.UserDetail.update({ age, city, gender });
    }
    // Fetch updated data
    const updatedUser = await authModel.findByPk(id, {
      include: userDetailsModel,
    });
    return res.status(201).json({
      message: "updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// export const getCitys = async (req, res) => {
//   try {
//     const user = await authModel.findAll({
//       include: { model: userDetailsModel, required: true },
//     });
//     // const { age } = req.body;

//     // if (!age) {
//     //   return res.status(400).json({ message: "Age is required" });
//     // }
//     // const userId = req.params.id;

//     // await userDetailsModel.update(
//     //   { age: Sequelize.literal("age+1") },
//     //   { where: { city: "chennai" } }
//     // );
//     // const users = await userDetailsModel.findAll({
//     //   where: { city: "chennai" },
//     // });
//     if (user.length === 0) {
//       return res.status(400).json({ message: "user is not found" });
//     }
//     return res.status(200).json({ message: "all users geting", data: user });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
export const patchAuth = async (req, res) => {
  try {
    // const id = req.params.id;
    const { age, gender } = req.body;
    if (isNaN(id)) {
      return res.status(404).json({ message: "user id is not found" });
    }
    const user = await authModel.findByPk(id, {
      include: { model: userDetailsModel },
    });
    await user.UserDetail.update({ age }, { where: {} });
    const updatedDetails = await authModel.findAll({
      include: { model: userDetailsModel },
    });
    return res
      .status(201)
      .json({ message: "partial update successfully", data: updatedDetails });
  } catch (error) {
    console.log(error);
  }
};

export const deleteAuth = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ message: "user id is not found" });
    }
    await authModel.destroy({ where: { id } });
    return res.status(200).json({ message: "delete user successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const profileUser = async (req, res) => {
  try {
    const user = await userDetailsModel.findAll();
    if (user.length === 0) {
      return res.status(400).json({ message: "user is not found" });
    }
    return res
      .status(200)
      .json({ message: "all users Details getting", data: req.user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
