import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PREVIEW_PORT || 5173);
const notesFile = join(root, "data", "interface-notes.json");

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
  const requested = resolve(root, `.${pathname}`);
  if (requested.startsWith(root) && existsSync(requested) && statSync(requested).isFile()) {
    return requested;
  }
  return join(root, "index.html");
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        rejectBody(new Error("body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolveBody(raw ? JSON.parse(raw) : {});
      } catch (error) {
        rejectBody(error);
      }
    });
    req.on("error", rejectBody);
  });
}

function loadNotes() {
  if (!existsSync(notesFile)) return [];
  try {
    const data = JSON.parse(readFileSync(notesFile, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  mkdirSync(dirname(notesFile), { recursive: true });
  writeFileSync(notesFile, `${JSON.stringify(notes, null, 2)}\n`, "utf8");
}

function noteKey(note) {
  return [note.projectId || "default", note.pageId || "default", String(note.number || "")].join("::");
}

async function handleNotesApi(req, res, url) {
  const notes = loadNotes();
  if (req.method === "GET") {
    const projectId = url.searchParams.get("projectId");
    const pageId = url.searchParams.get("pageId");
    const filtered = notes.filter((note) => {
      if (note.status === "deleted") return false;
      if (projectId && note.projectId !== projectId) return false;
      if (pageId && note.pageId !== pageId) return false;
      return true;
    });
    return sendJson(res, 200, { ok: true, data: filtered });
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const now = new Date().toISOString();
    const incoming = {
      ...body,
      id: body.id || `note_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      status: body.status || "active",
      createdAt: body.createdAt || now,
      updatedAt: now,
      createdBy: body.createdBy || "current-user",
      updatedBy: body.updatedBy || "current-user"
    };
    const duplicate = notes.find((note) => (
      note.status !== "deleted" &&
      note.id !== incoming.id &&
      noteKey(note) === noteKey(incoming)
    ));
    if (duplicate) {
      return sendJson(res, 409, { ok: false, message: "当前页面已存在相同备注编号" });
    }
    const index = notes.findIndex((note) => note.id === incoming.id);
    if (index >= 0) {
      notes[index] = { ...notes[index], ...incoming, createdAt: notes[index].createdAt || incoming.createdAt };
    } else {
      notes.push(incoming);
    }
    saveNotes(notes);
    return sendJson(res, 200, { ok: true, data: incoming });
  }

  if (req.method === "DELETE") {
    const id = url.pathname.split("/").pop();
    const index = notes.findIndex((note) => note.id === id);
    if (index >= 0) {
      notes[index] = { ...notes[index], status: "deleted", updatedAt: new Date().toISOString() };
      saveNotes(notes);
    }
    return sendJson(res, 200, { ok: true });
  }

  return sendJson(res, 405, { ok: false, message: "method not allowed" });
}

createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", "http://localhost");
  if (requestUrl.pathname === "/api/interface-notes" || requestUrl.pathname.startsWith("/api/interface-notes/")) {
    try {
      await handleNotesApi(req, res, requestUrl);
    } catch (error) {
      sendJson(res, 500, { ok: false, message: error.message });
    }
    return;
  }

  const file = fileFor(req.url || "/");
  res.setHeader("Content-Type", contentTypes[extname(file)] || "application/octet-stream");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`Preview server listening on http://127.0.0.1:${port}`);
});
