const http = require("http"),
  querystring = require("querystring"),
  fs = require("fs"),
  EventEmitter = require("events"),
  express = require("express");

const app = express();

const PORT = process.env.PORT || 7000;

const chatEmitter = new EventEmitter();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/", respondJson);
app.get("/static/*", respondStatic);
app.get("/chat", responseChat);

function responseChat(req, res) {
  const { message } = req.body;

  chatEmitter.emit("message", message);
  chatEmitter.on("message", console.log(message));

  res.end();
}

app.get("/sse", responseSse);
function responseSse(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });

  const onMessage = (msg) => res.write(`data: ${msg}\n\n`);
  chatEmitter.on("message", onMessage);

  res.on("close", function () {
    chatEmitter.off("message", onMessage);
  });
}

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server run on port: http://localhost:${PORT}`);
});
