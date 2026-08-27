import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const input = resolve(process.argv[2] || "data/interface-notes.json");
const output = resolve(process.argv[3] || input);
const notes = JSON.parse(readFileSync(input, "utf8"));

if (!Array.isArray(notes)) throw new Error("interface notes must be an array");

function compactIdentity(value) {
  const text = String(value || "screen:legacy");
  if (text.length <= 460) return text;
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${text.slice(0, 180)}|identity:${(hash >>> 0).toString(36)}`;
}

function normalizedCoordinate(value, dimension) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0.5;
  if (number >= 0 && number <= 1) return number;
  return Math.max(0, Math.min(1, number / Math.max(1, Number(dimension) || 1)));
}

const migrated = notes.map((source, index) => {
  const id = String(source.noteId || source.id || `note_migrated_${index + 1}`);
  const noteNumber = Math.max(1, Math.floor(Number(source.noteNumber || source.number || index + 1)));
  const sourceWidth = Number(source.surfaceWidth || source.pageWidth || source.targetSnapshot?.annotationSurfaceWidth || 1);
  const sourceHeight = Number(source.surfaceHeight || source.pageHeight || source.targetSnapshot?.annotationSurfaceHeight || 1);
  const existingSnapshot = source.targetSnapshot && typeof source.targetSnapshot === "object"
    ? source.targetSnapshot
    : {};
  const targetSnapshot = {
    ...existingSnapshot,
    section: existingSnapshot.section || source.pageTitle || "",
    label: existingSnapshot.label || source.title || "",
    role: existingSnapshot.role || "",
    annotationSurfaceHeight: Math.max(1, Number(existingSnapshot.annotationSurfaceHeight || sourceHeight)),
    annotationSurfaceWidth: Math.max(1, Number(existingSnapshot.annotationSurfaceWidth || sourceWidth)),
    attachments: Array.isArray(existingSnapshot.attachments) ? existingSnapshot.attachments : [],
    interactionContent: String(existingSnapshot.interactionContent || source.interactionContent || ""),
    interactionAttachments: Array.isArray(existingSnapshot.interactionAttachments)
      ? existingSnapshot.interactionAttachments
      : [],
    interfaceManifest: {
      ...(existingSnapshot.interfaceManifest && typeof existingSnapshot.interfaceManifest === "object"
        ? existingSnapshot.interfaceManifest
        : {}),
      pageTitle: existingSnapshot.interfaceManifest?.pageTitle || source.pageTitle || "",
      activeText: existingSnapshot.interfaceManifest?.activeText || source.activeText || "",
      viewKey: existingSnapshot.interfaceManifest?.viewKey || source.viewKey || "",
      contextType: existingSnapshot.interfaceManifest?.contextType || source.contextType || "page",
      contextId: existingSnapshot.interfaceManifest?.contextId || source.contextId || "base",
      contextTitle: existingSnapshot.interfaceManifest?.contextTitle || source.contextTitle || "",
      routePath: existingSnapshot.interfaceManifest?.routePath || source.routePath || "index.html",
      routeHash: existingSnapshot.interfaceManifest?.routeHash || source.routeHash || "#",
      legacyPageId: existingSnapshot.interfaceManifest?.legacyPageId || source.pageId || ""
    }
  };
  return {
    ...source,
    id,
    noteId: id,
    projectId: source.projectId || "frontend-architect-health-checkin",
    pageId: compactIdentity(source.scopeKey || source.pageId),
    number: noteNumber,
    noteNumber,
    title: String(source.title || `批注 ${noteNumber}`),
    content: String(source.content || ""),
    x: normalizedCoordinate(source.x, sourceWidth),
    y: normalizedCoordinate(source.y, sourceHeight),
    targetKey: String(source.targetKey || source.anchorSelector || "surface"),
    targetSnapshot,
    featureInference: source.featureInference && typeof source.featureInference === "object"
      ? source.featureInference
      : {},
    generatedRules: source.generatedRules || null,
    createdBy: source.createdBy || "reviewer",
    updatedBy: source.updatedBy || source.createdBy || "reviewer",
    createdAt: source.createdAt || new Date(0).toISOString(),
    updatedAt: source.updatedAt || source.createdAt || new Date(0).toISOString(),
    status: source.status === "deleted" ? "deleted" : "active"
  };
});

const activeNumbers = new Map();
migrated.forEach((note) => {
  if (note.status === "deleted") return;
  const groupKey = `${note.projectId}::${note.pageId}`;
  if (!activeNumbers.has(groupKey)) activeNumbers.set(groupKey, new Set());
  const used = activeNumbers.get(groupKey);
  let number = note.noteNumber;
  while (used.has(number)) number += 1;
  note.noteNumber = number;
  note.number = number;
  used.add(number);
});

writeFileSync(output, `${JSON.stringify(migrated, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ total: migrated.length, output }, null, 2));
