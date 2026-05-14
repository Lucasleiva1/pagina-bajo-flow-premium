const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 4173;
const host = "127.0.0.1";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".mp4": "video/mp4",
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${host}:${port}`);
    let filePath = decodeURIComponent(url.pathname);

    if (filePath === "/") {
      filePath = "/index.html";
    }

    const fullPath = path.join(root, filePath);

    if (!fullPath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.readFile(fullPath, (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      res.writeHead(200, {
        "Content-Type": types[path.extname(fullPath)] || "application/octet-stream",
      });
      res.end(data);
    });
  })
  .listen(port, host, () => {
    console.log(`Bajo Flow preview: http://${host}:${port}`);
  });
