const http = require("http"),
  querystring = require("querystring"),
  fs = require("fs");
// express = require("express");

// const app = express();

const PORT = process.env.PORT || 7000;

// app.get("/", respondJson);

function respondEcho(req, res) {
  const { input = "" } = querystring.parse(
    req.url.split("?").slice(1).join("")
  );

  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      normal: input,
      upperCase: input.toUpperCase(),
      characterCount: input.length,
      backwards: input.split("").reverse().join(""),
    })
  );
}

function respondStatic(req, res) {
  const filename = `${__dirname}/public${req.url.split("/static")[1]}`;
  fs.createReadStream(filename)
    .on("error", () => NotFound(req, res))
    .pipe(res);
}

function respondText(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.end("Hi text");
}
function respondJson(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ text: "hi", numbers: [1, 2, 3, 4] }));
}
function NotFound(req, res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
}
const Server = http.createServer((req, res) => {
  if (req.url === "/") return respondText(req, res);
  if (req.url === "/json") return respondJson(req, res);
  if (req.url.match(/^\/echo/)) return respondEcho(req, res);
  if (req.url.match(/^\/static/)) return respondStatic(req, res);

  NotFound(req, res);
});

Server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server run on port: http://localhost:${PORT}`);
});
