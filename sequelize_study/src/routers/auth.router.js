import express from "express";
import {
  // getAllAuth,
  // getOneAuth,
  postAuth,
  putAuth,
  patchAuth,
  deleteAuth,
  getAgeDetails,
  // getCitys,
  profileUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyJWT.js";
const router = express.Router();

router.get("/ages", getAgeDetails);
// router.get("/", getAllAuth);
// router.get("/:id", getOneAuth);
router.post("/", postAuth);
router.put("/:id", putAuth);
router.patch("/:id", patchAuth);
// router.get("/cities", getCitys);
router.delete("/:id", deleteAuth);

router.get("/profileUser", verifyToken, profileUser);
export default router;
