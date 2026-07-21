// const express = require("express");
// // const path = require("path");
// // const { fileURLToPath } = require("url");

// // Create __dirname manually (ESM fix)
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// const app = express();
// app.listen(4000, () => {
//   console.log("Server is running on port 4000");
// });
// // middleware
// app.use((req, res, next) => {
//   console.log("middleware 1");
//   next();
// });

// app.get("/", (req, res) => {
//   res.sendFile("./docs/home.html", { root: __dirname });
//   //   res.sendFile(path.join(__dirname, "docs", "home.html"));
// });
// app.get("/home", (req, res) => {
//   //   res.redirect("/");
//   res.status(200).sendFile("./docs/home.html", { root: __dirname });
// });
// app.get("/demo", (req, res) => {
//   res.status(200).sendFile("./docs/demo.html", { root: __dirname });
// });
// app.use((req, res, next) => {
//   console.log("middleware 2");
//   next();
// });
// app.get("/about", (req, res) => {
//   res.sendFile("./docs/about.html", { root: __dirname });
// });
// app.use((req, res) => {
//   res.status(404).sendFile("./docs/404.html", { root: __dirname });
// });
