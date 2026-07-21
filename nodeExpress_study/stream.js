const fs = require("fs");
const { Transform } = require("stream");

const readbleStream = fs.createReadStream("./docs/file.txt", {
  encoding: "utf-8",
});
const writebleStream = fs.createWriteStream("./docs/file2.txt");

// readbleStream.on("data", (chunk) => {
//   writebleStream.write("new chunk in file3");
//   writebleStream.write(chunk);
// });

// readbleStream.pipe(writebleStream);

 const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});

fs.createReadStream("./docs/file.txt")
  .pipe(upperCase)
  .pipe(fs.createWriteStream("./docs/file2.txt"));
