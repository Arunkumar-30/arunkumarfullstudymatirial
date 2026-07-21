const fs = require("fs");

// if (!fs.existsSync("./docs")) {
//   fs.mkdir("./docs", (err) => {
//     if (err) throw err;
//     console.log("Directory created");
//   });
// } else {
//   console.log("Directory already exists");
// }

// fs.writeFile("./docs/file.txt", "how are you", (err) => {
//   if (err) throw err;
//   console.log("file created");
// });

// if (fs.existsSync("./docs/file.txt")) {
//   fs.readFile("./docs/file.txt", (err, data) => {
//     if (err) throw err;
//     console.log(data.toString());
//   });
// } else {
//   console.log("file does not exist");
// }

// fs.unlink("./docs/file.txt", (err) => {
//   if (err) throw err;
//   console.log("file deleted");
// });
fs.rmdir("./docs", (err) => {
  if (err) throw err;
  console.log("directory deleted");
});
