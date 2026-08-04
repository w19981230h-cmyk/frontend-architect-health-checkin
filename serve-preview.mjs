import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const root = "D:\\projectnew\\Frontend Architect";
const port = 5173;
const archiveLogicStoreFile = join(root, "data", "archive-logic-store.json");
const manualRemarkStoreFile = join(root, "data", "manual-remarks-store.json");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function fileFor(url) {
  const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const requested = normalize(join(root, pathname));
  if (requested.startsWith(root) && existsSync(requested) && statSync(requested).isFile()) {
    return requested;
  }
  return join(root, "index.html");
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function readJsonStore(file) {
  try {
    if (!existsSync(file)) return {};
    const value = JSON.parse(readFileSync(file, "utf8") || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function writeJsonStore(file, store) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(store || {}, null, 2), "utf8");
}

function readArchiveLogicStore() {
  return readJsonStore(archiveLogicStoreFile);
}

function writeArchiveLogicStore(store) {
  writeJsonStore(archiveLogicStoreFile, store);
}

async function handleArchiveLogicApi(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  const url = new URL(req.url || "/", "http://localhost");
  if (url.pathname !== "/api/archive-logic") return false;
  if (req.method === "GET") {
    sendJson(res, 200, { ok: true, data: readArchiveLogicStore() });
    return true;
  }
  if (req.method === "PUT") {
    const payload = JSON.parse(await readRequestBody(req) || "{}");
    const contextKey = String(payload.contextKey || "").trim();
    if (!contextKey) {
      sendJson(res, 400, { ok: false, message: "contextKey is required" });
      return true;
    }
    const store = readArchiveLogicStore();
    store[contextKey] = {
      ...(payload.config || { bodyHtml: "", points: {} }),
      updatedAt: new Date().toISOString()
    };
    writeArchiveLogicStore(store);
    sendJson(res, 200, { ok: true, data: store[contextKey] });
    return true;
  }
  if (req.method === "DELETE") {
    const contextKey = String(url.searchParams.get("contextKey") || "").trim();
    const store = readArchiveLogicStore();
    if (contextKey) delete store[contextKey];
    writeArchiveLogicStore(store);
    sendJson(res, 200, { ok: true });
    return true;
  }
  sendJson(res, 405, { ok: false, message: "method not allowed" });
  return true;
}

async function handleManualRemarksApi(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Accept");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  const url = new URL(req.url || "/", "http://localhost");
  if (url.pathname !== "/api/manual-remarks") return false;
  const store = readJsonStore(manualRemarkStoreFile);
  const projectId = url.searchParams.get("projectId") || "frontend-architect-health-checkin";
  if (req.method === "GET") {
    sendJson(res, 200, store[projectId] || { remarks: [] });
    return true;
  }
  if (req.method === "POST") {
    const payload = JSON.parse(await readRequestBody(req) || "{}");
    const targetProjectId = String(payload.projectId || projectId);
    store[targetProjectId] = {
      remarks: Array.isArray(payload.remarks) ? payload.remarks : [],
      updatedAt: new Date().toISOString()
    };
    writeJsonStore(manualRemarkStoreFile, store);
    sendJson(res, 200, { ok: true, ...store[targetProjectId] });
    return true;
  }
  sendJson(res, 405, { ok: false, message: "method not allowed" });
  return true;
}

createServer(async (req, res) => {
  try {
    if (await handleArchiveLogicApi(req, res)) return;
    if (await handleManualRemarksApi(req, res)) return;
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error?.message || "server error" });
    return;
  }
  const file = fileFor(req.url || "/");
  res.setHeader("Content-Type", contentTypes[extname(file)] || "application/octet-stream");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1");
