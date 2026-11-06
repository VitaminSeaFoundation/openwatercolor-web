#!/usr/bin/env node
/* Serves a built target for local testing: node scripts/serve.mjs [dir=dist/web] [port=8080] */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(process.argv[2] || "dist/web");
const port = Number(process.argv[3] || process.env.PORT || 8080);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};

if (!existsSync(root)) {
  console.error(`${root} does not exist. Run "node scripts/build.mjs web" first.`);
  process.exit(1);
}

createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  let file = normalize(join(root, path));
  if (file !== root && !file.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(response);
}).listen(port, () => console.log(`serving ${root} at http://localhost:${port}/`));
