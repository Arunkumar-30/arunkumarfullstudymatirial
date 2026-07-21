import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import sequelize from "../src/config/db.js";
import { Auth, UserDetails } from "../src/models/index.js";

import authRouter from "../src/routers/auth.router.js";
import loginRouter from "../src/routers/login.router.js";

const app = express();

app.use(cors());
app
  .use(bodyParser.json({ limit: "30mb", extended: true }))
  .use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

dotenv.config();

app.get("/", (req, res) => {
  res.send("root is success");
});

// routes
app.use("/api/user", authRouter);
app.use("/api", loginRouter);
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("tables is created successfully");
    console.log(`server is running on ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
