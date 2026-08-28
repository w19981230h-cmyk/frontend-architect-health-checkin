const fs = require("node:fs");
const assert = require("node:assert/strict");

const read = (path) => fs.readFileSync(path, "utf8");
const sourceScript = read("js/interface-annotations-v3.js");
const publicScript = read("sites-deploy/public/js/interface-annotations-v3.js");
const sourceCss = read("css/interface-annotations-v3.css");
const publicCss = read("sites-deploy/public/css/interface-annotations-v3.css");
const sourceHtml = read("index.html");
const publicHtml = read("sites-deploy/public/prototype.html");
const sourceSnapshot = read("js/interface-notes-snapshot.js");
const publicSnapshot = read("sites-deploy/public/js/interface-notes-snapshot.js");
const notes = JSON.parse(read("data/interface-notes.json"));
const publicNotes = JSON.parse(read("sites-deploy/public/data/interface-notes.json"));

assert.equal(sourceScript, publicScript, "发布包的批注脚本必须与项目版本一致");
assert.equal(sourceCss, publicCss, "发布包的批注样式必须与项目版本一致");
assert.deepEqual(publicNotes, notes, "发布包必须包含项目中的全部备注");
assert.equal(sourceSnapshot, publicSnapshot, "发布包的内嵌备注快照必须与项目版本一致");
assert.match(sourceSnapshot, /window\.__INTERFACE_NOTES_SNAPSHOT__\s*=/);
assert.match(sourceHtml, /interface-notes-snapshot\.js\?v=20260828-v3-6[\s\S]*interface-annotations-v3\.js\?v=20260828-v3-6/);
assert.match(publicHtml, /interface-notes-snapshot\.js\?v=20260828-v3-6[\s\S]*interface-annotations-v3\.js\?v=20260828-v3-6/);
assert.match(sourceScript, /loadSource:\s*"pending"/);
assert.match(sourceScript, /window\.__INTERFACE_NOTES_SNAPSHOT__/);
assert.match(sourceScript, /uiNotesMode["']\)\s*===\s*["']readonly["']/);
assert.match(sourceScript, /collapsed:\s*false/);
assert.match(sourceScript, /data-ui-note-action="place"/);
assert.match(sourceScript, /data-ui-note-action="toggle"/);
assert.match(sourceScript, /data-ui-note-action="summary"/);
assert.match(sourceScript, /data-ui-note-action="expand"[^>]*>批注<\/button>/);
assert.match(sourceScript, /ensureShell\(\);\s*const next = resolveContext\(\);/);
assert.match(sourceCss, /\.ui-note-toolbar\s*{[\s\S]*?position:\s*fixed/);
assert.match(sourceCss, /--ui-note-z:\s*2147482000/);
assert.match(sourceCss, /\.ui-note-toolbar\.is-collapsed\s*{[\s\S]*?bottom:\s*88px/);

const active = notes.filter((note) => note.status !== "deleted");
const patientPageId = "index.html|#|page:listPage/view:patientListView|page:base";
const patientNotes = active.filter((note) => note.pageId === patientPageId);
assert.equal(patientNotes.length, 4, "全部患者页面应显示 4 个有效备注点");

const identities = new Map();
for (const note of active) {
  const key = `${note.projectId}::${note.pageId}::${note.noteNumber || note.number}`;
  assert.equal(identities.has(key), false, `同一界面存在重复备注编号：${key}`);
  identities.set(key, note.noteId || note.id);
}

console.log(JSON.stringify({
  toolbar: "visible-by-default",
  recovery: "enabled",
  totalNotes: notes.length,
  activeNotes: active.length,
  patientPageNotes: patientNotes.length,
  isolatedInterfaces: new Set(active.map((note) => note.pageId)).size
}, null, 2));
