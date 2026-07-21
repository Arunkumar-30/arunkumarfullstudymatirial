import http from "http";
import fs from "fs";

const server = http.createServer((req, res) => {
  res.setHeader("content-Type", "text/html");
  let path = "./docs/";
  switch (req.url) {
    case "/":
      path += "home.html";
      res.statusCode = 200;
      break;
    case "/home":
      res.setHeader("Location", "/");
      res.statusCode = 301;
      res.end();
      break;
    case "/about":
      path += "about.html";
      res.statusCode = 200;
      break;
    default:
      path += "404.html";
      res.statusCode = 404;
      break;
  }

  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      res.write(data);
      res.end();
    }
  });
});

server.listen(4000, "localhost", () => {
  console.log("server is listening on port 4000");
});
