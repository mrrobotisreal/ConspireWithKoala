const cors = require("cors");
const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const PORT = 443;
const options = {
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/conspirewithkoala.com/fullchain.pem"
  ),
  key: fs.readFileSync(
    "/etc/letsencrypt/live/conspirewithkoala.com/privkey.pem"
  ),
};
const corsOptions = {
  origin: "https://conspirewithkoala.com",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
const app = express();

app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

https.createServer(options, app).listen(PORT, () => {
  console.log(
    `Server is running securely on https://conspirewithkoala.com:${PORT}`
  );
});

http
  .createServer((req, res) => {
    console.log(`Redirecting to https://${req.headers.host}${req.url}`);
    res.writeHead(301, {
      Location: `https://${req.headers.host}${req.url}`,
    });
    res.end();
  })
  .listen(80);
