import express from "express";
import {
  registerUser,
  loginUser,
  refreshTokenController,
} from "../controllers/login.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshTokenController);
export default router;
