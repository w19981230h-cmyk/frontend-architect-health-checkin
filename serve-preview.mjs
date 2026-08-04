import { createReadStream, existsSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PREVIEW_PORT || 5173);
const annotationFile = join(root, ".ui-annotations.json");
const annotationTempFile = join(root, ".ui-annotations.tmp.json");
const publicAnnotationFile = join(root, "ui-annotations.json");
const publicAnnotationTempFile = join(root, "ui-annotations.tmp.json");
const annotationEndpoint = "/__ui_annotations";

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

function readAnnotations() {
  try {
    const parsed = JSON.parse(readFileSync(annotationFile, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    try {
      const parsed = JSON.parse(readFileSync(publicAnnotationFile, "utf8"));
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
}

function writeAnnotations(data) {
  const payload = JSON.stringify(data);
  writeFileSync(annotationTempFile, payload, "utf8");
  renameSync(annotationTempFile, annotationFile);
  writeFileSync(publicAnnotationTempFile, payload, "utf8");
  renameSync(publicAnnotationTempFile, publicAnnotationFile);
}

function mergeAnnotations(current, incoming) {
  const currentMeta = current?.__annotationMetaV1 && typeof current.__annotationMetaV1 === "object"
    ? current.__annotationMetaV1
    : {};
  const incomingMeta = incoming?.__annotationMetaV1 && typeof incoming.__annotationMetaV1 === "object"
    ? incoming.__annotationMetaV1
    : {};
  const deletedPoints = {
    ...(currentMeta.deletedPoints || {}),
    ...(incomingMeta.deletedPoints || {})
  };
  const merged = {
    ...(current || {}),
    ...(incoming || {}),
    __annotationMetaV1: {
      ...currentMeta,
      ...incomingMeta,
      migratedContexts: {
        ...(currentMeta.migratedContexts || {}),
        ...(incomingMeta.migratedContexts || {})
      },
      deletedPoints
    }
  };

  const contextKeys = new Set([...Object.keys(current || {}), ...Object.keys(incoming || {})]);
  contextKeys.delete("__annotationMetaV1");
  for (const contextKey of contextKeys) {
    const currentValue = current?.[contextKey];
    const incomingValue = incoming?.[contextKey];
    if (!Array.isArray(currentValue) && !Array.isArray(incomingValue)) continue;
    const pointMap = new Map();
    for (const point of [...(Array.isArray(currentValue) ? currentValue : []), ...(Array.isArray(incomingValue) ? incomingValue : [])]) {
      if (!point?.id || deletedPoints[point.id]) continue;
      const previous = pointMap.get(point.id);
      if (!previous) {
        pointMap.set(point.id, point);
        continue;
      }
      const previousAnchorVersion = Number(previous.anchorVersion || 0);
      const nextAnchorVersion = Number(point.anchorVersion || 0);
      const previousTime = Date.parse(previous.updatedAt || previous.createdAt || 0) || 0;
      const nextTime = Date.parse(point.updatedAt || point.createdAt || 0) || 0;
      if (nextAnchorVersion > previousAnchorVersion || (nextAnchorVersion === previousAnchorVersion && nextTime >= previousTime)) {
        pointMap.set(point.id, point);
      }
    }
    merged[contextKey] = [...pointMap.values()];
  }
  return merged;
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data));
}

createServer((req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  if (url.pathname === annotationEndpoint && req.method === "GET") {
    sendJson(res, 200, readAnnotations());
    return;
  }
  if (url.pathname === annotationEndpoint && req.method === "PUT") {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 2_000_000) req.destroy();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("invalid payload");
        writeAnnotations(mergeAnnotations(readAnnotations(), data));
        sendJson(res, 200, { ok: true });
      } catch {
        sendJson(res, 400, { ok: false, message: "Invalid annotation data" });
      }
    });
    return;
  }
  if (url.pathname === annotationEndpoint) {
    sendJson(res, 405, { ok: false });
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
