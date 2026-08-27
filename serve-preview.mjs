import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PREVIEW_PORT || 5173);
const notesFile = process.env.INTERFACE_NOTES_FILE
  ? resolve(root, process.env.INTERFACE_NOTES_FILE)
  : join(root, "data", "interface-notes.json");

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
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Private-Network": "true"
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 6 * 1024 * 1024) {
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
  return [note.projectId || "default", note.pageId || "default", String(note.noteNumber || note.number || "")].join("::");
}

function noteId(note) {
  return String(note.noteId || note.id || "");
}

function validateAttachmentList(value, fieldName) {
  const attachments = Array.isArray(value) ? value : [];
  if (attachments.length > 5) throw new Error(`${fieldName}最多保留 5 张截图`);
  attachments.forEach((item) => {
    const mimeType = String(item?.mimeType || "");
    const dataUrl = String(item?.dataUrl || "");
    const url = String(item?.url || "");
    if (mimeType && !/^image\/(png|jpeg|jpg|webp)$/i.test(mimeType)) throw new Error("截图格式不受支持");
    if (dataUrl && (!dataUrl.startsWith("data:image/") || dataUrl.length > 1600000)) throw new Error("截图内容过大或格式错误");
    if (url && !/^https:\/\//i.test(url)) throw new Error("截图地址必须使用 HTTPS");
  });
}

function validateNote(note) {
  const projectId = String(note.projectId || "");
  const pageId = String(note.pageId || "");
  const title = String(note.title || "");
  const content = String(note.content || "");
  const interactionContent = String(note.targetSnapshot?.interactionContent || "");
  const number = Number(note.noteNumber || note.number);
  const x = Number(note.x);
  const y = Number(note.y);
  if (!projectId || projectId.length > 160) throw new Error("projectId 无效");
  if (!pageId || pageId.length > 600) throw new Error("pageId 无效");
  if (!Number.isInteger(number) || number < 1 || number > 999999) throw new Error("批注编号无效");
  if (!title.trim() || title.length > 120) throw new Error("批注标题无效");
  if (content.length > 12000 || interactionContent.length > 12000) throw new Error("批注内容过长");
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 1 || y < 0 || y > 1) throw new Error("批注坐标无效");
  validateAttachmentList(note.targetSnapshot?.attachments, "逻辑补充");
  validateAttachmentList(note.targetSnapshot?.interactionAttachments, "交互逻辑补充");
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
    return sendJson(res, 200, { ok: true, notes: filtered, data: filtered });
  }

  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const now = new Date().toISOString();
    const generatedId = body.noteId || body.id || `note_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const incoming = {
      ...body,
      id: generatedId,
      noteId: generatedId,
      number: Number(body.noteNumber || body.number),
      noteNumber: Number(body.noteNumber || body.number),
      status: body.status || "active",
      createdAt: body.createdAt || now,
      updatedAt: now,
      createdBy: body.createdBy || "current-user",
      updatedBy: body.updatedBy || "current-user"
    };
    validateNote(incoming);
    const duplicate = notes.find((note) => (
      note.status !== "deleted" &&
      noteId(note) !== incoming.id &&
      noteKey(note) === noteKey(incoming)
    ));
    if (duplicate) {
      return sendJson(res, 409, { ok: false, message: "当前页面已存在相同备注编号" });
    }
    const index = notes.findIndex((note) => noteId(note) === incoming.id);
    if (index >= 0) {
      notes[index] = { ...notes[index], ...incoming, createdAt: notes[index].createdAt || incoming.createdAt };
    } else {
      notes.push(incoming);
    }
    saveNotes(notes);
    return sendJson(res, 200, { ok: true, note: incoming, data: incoming });
  }

  if (req.method === "PATCH") {
    const id = decodeURIComponent(url.pathname.split("/").pop() || "");
    const index = notes.findIndex((note) => noteId(note) === id && note.status !== "deleted");
    if (index < 0) return sendJson(res, 404, { ok: false, message: "批注不存在或已删除" });
    const body = await readJsonBody(req);
    const incoming = {
      ...notes[index],
      ...body,
      id,
      noteId: id,
      number: Number(body.noteNumber || body.number || notes[index].noteNumber || notes[index].number),
      noteNumber: Number(body.noteNumber || body.number || notes[index].noteNumber || notes[index].number),
      createdAt: notes[index].createdAt,
      updatedAt: new Date().toISOString(),
      updatedBy: body.updatedBy || "current-user",
      status: "active"
    };
    validateNote(incoming);
    const duplicate = notes.find((note) => (
      note.status !== "deleted" &&
      noteId(note) !== id &&
      noteKey(note) === noteKey(incoming)
    ));
    if (duplicate) return sendJson(res, 409, { ok: false, message: "当前界面已存在相同批注编号" });
    notes[index] = incoming;
    saveNotes(notes);
    return sendJson(res, 200, { ok: true, note: incoming, data: incoming });
  }

  if (req.method === "DELETE") {
    const id = decodeURIComponent(url.pathname.split("/").pop() || "");
    const index = notes.findIndex((note) => noteId(note) === id && note.status !== "deleted");
    if (index < 0) {
      return sendJson(res, 404, { ok: false, message: "备注不存在或已删除" });
    }
    notes[index] = { ...notes[index], status: "deleted", updatedAt: new Date().toISOString() };
    saveNotes(notes);
    return sendJson(res, 200, { ok: true, note: notes[index], data: notes[index] });
  }

  return sendJson(res, 405, { ok: false, message: "method not allowed" });
}

createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", "http://localhost");
  if (
    requestUrl.pathname === "/api/ui-notes"
    || requestUrl.pathname.startsWith("/api/ui-notes/")
    || requestUrl.pathname === "/api/interface-notes"
    || requestUrl.pathname.startsWith("/api/interface-notes/")
  ) {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Private-Network": "true"
      });
      res.end();
      return;
    }
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
