import http from "http";
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const PORT = 7878;
const REPO_ROOT = resolve(fileURLToPath(import.meta.url), "../..");
const TOKENS_ROOT = resolve(REPO_ROOT, "src/tokens");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age":       "86400",
};

function safeWritePath(relPath) {
  const abs = resolve(REPO_ROOT, relPath);
  if (!abs.startsWith(TOKENS_ROOT + "/") && abs !== TOKENS_ROOT) {
    throw new Error(`Refusing to write outside src/tokens/: ${relPath}`);
  }
  return abs;
}

const server = http.createServer((req, res) => {
  console.log(`  ${req.method} ${req.url}  origin:${req.headers.origin ?? "none"}`);
  const host = req.headers.host;
  if (host !== `localhost:${PORT}` && host !== `127.0.0.1:${PORT}`) {
    res.writeHead(400); res.end("Bad Host");
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/tokens") {
    res.writeHead(404); res.end();
    return;
  }

  let body = "";
  req.on("data", chunk => { body += chunk; });
  req.on("end", () => {
    try {
      const { files } = JSON.parse(body);
      if (!Array.isArray(files)) throw new Error("Missing files array");

      for (const { path, content } of files) {
        const abs = safeWritePath(path);
        mkdirSync(dirname(abs), { recursive: true });
        writeFileSync(abs, content, "utf8");
        console.log(`  wrote  ${path}`);
      }

      const sync = spawnSync("node", ["scripts/sync-token-imports.mjs"], {
        cwd: REPO_ROOT,
        stdio: "inherit",
      });
      if (sync.status !== 0) throw new Error("sync-token-imports failed");

      res.writeHead(200, { "Content-Type": "application/json", ...CORS_HEADERS });
      res.end(JSON.stringify({ ok: true, written: files.length }));
    } catch (err) {
      console.error(`  error  ${err.message}`);
      res.writeHead(400, { "Content-Type": "application/json", ...CORS_HEADERS });
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[token-receiver] http://127.0.0.1:${PORT}/tokens — waiting for push`);
  console.log(`[token-receiver] Ctrl-C to stop`);
});

process.on("SIGINT", () => { server.close(); process.exit(0); });
