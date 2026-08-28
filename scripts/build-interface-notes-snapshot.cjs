const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "data", "interface-notes.json");
const outputPaths = [
  path.join(root, "js", "interface-notes-snapshot.js"),
  path.join(root, "sites-deploy", "public", "js", "interface-notes-snapshot.js")
];

const notes = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
if (!Array.isArray(notes)) throw new Error("interface-notes.json 必须是备注数组");

const content = [
  "/* Generated from data/interface-notes.json. Do not edit by hand. */",
  "window.__INTERFACE_NOTES_SNAPSHOT__ = " + JSON.stringify(notes) + ";",
  ""
].join("\n");

for (const outputPath of outputPaths) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, "utf8");
}

console.log(`Built ${notes.length} interface notes into the published snapshot.`);
