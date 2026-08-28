(function initUnifiedInterfaceAnnotationsV3() {
  "use strict";

  if (window.__UNIFIED_INTERFACE_ANNOTATIONS_V3__) return;
  window.__UNIFIED_INTERFACE_ANNOTATIONS_V3__ = true;

  const PROJECT_ID = "frontend-architect-health-checkin";
  const API_PATH = "/api/ui-notes";
  const LEGACY_LOCAL_KEY = PROJECT_ID + ":interface-notes:v1";
  const STATIC_DATA_URL = "/data/interface-notes.json";
  const STATIC_DATA_VERSION = "20260828-v3-6";
  const TOOL_STATE_KEY = PROJECT_ID + ":ui-note-tool:v3";
  const MAX_ATTACHMENTS_PER_FIELD = 5;
  const MAX_SOURCE_IMAGE_BYTES = 8 * 1024 * 1024;
  const MAX_STORED_IMAGE_CHARACTERS = 1600000;
  const MAX_TEXT_LENGTH = 12000;
  const localHost = location.hostname === "127.0.0.1" || location.hostname === "localhost";
  const forcedReadOnlyPreview = localHost && new URLSearchParams(location.search).get("uiNotesMode") === "readonly";
  const publishedReadOnly = (location.protocol !== "file:" && !localHost) || forcedReadOnlyPreview;
  const apiBase = location.protocol === "file:" ? "http://127.0.0.1:5173" : "";
  const config = {
    projectId: PROJECT_ID,
    apiBaseUrl: apiBase,
    viewerMode: publishedReadOnly ? "read-only" : "edit",
    actor: "current-user"
  };

  const state = {
    notes: [],
    context: null,
    visible: false,
    placing: false,
    selectedId: "",
    drawerMode: "",
    draft: null,
    editorOriginal: "",
    writeAvailable: !publishedReadOnly,
    loading: false,
    loadSource: "pending",
    loadError: "",
    requestToken: 0,
    pendingContext: null,
    // Always expose the complete toolbar after a reload. A previously saved
    // collapsed state could leave only the small expand control behind other
    // fixed widgets, making the annotation feature appear to be missing.
    collapsed: false,
    drag: null,
    suppressPointClick: false,
    refreshTimer: 0,
    positionFrame: 0
  };

  function readToolState() {
    try {
      const value = JSON.parse(localStorage.getItem(TOOL_STATE_KEY) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch (error) {
      return {};
    }
  }

  function saveToolState() {
    try {
      localStorage.setItem(TOOL_STATE_KEY, JSON.stringify({ collapsed: state.collapsed }));
    } catch (error) {
      // Tool preferences are non-critical.
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function replaceCharacter(character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") return window.CSS.escape(String(value));
    return String(value).replace(/[^a-zA-Z0-9_-]/g, function escapeCharacter(character) {
      return "\\" + character.codePointAt(0).toString(16) + " ";
    });
  }

  function normalizeText(value) {
    return String(value == null ? "" : value).trim().replace(/\s+/g, " ");
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function uid(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return (prefix || "note") + "_" + window.crypto.randomUUID();
    }
    return (prefix || "note") + "_" + Date.now() + "_" + Math.random().toString(16).slice(2);
  }

  function compactIdentity(value) {
    const text = String(value || "screen:unknown");
    if (text.length <= 460) return text;
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return text.slice(0, 180) + "|identity:" + (hash >>> 0).toString(36);
  }

  function isVisible(node) {
    if (!(node instanceof Element)) return false;
    if (node.closest("[hidden],[aria-hidden='true']")) return false;
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function shortText(node, maxLength) {
    const text = normalizeText(node && node.textContent);
    const limit = maxLength || 80;
    return text && text.length <= limit ? text : "";
  }

  function activePageElement() {
    const pages = Array.from(document.querySelectorAll(".page.active")).filter(isVisible);
    if (!pages.length) return null;
    const foreground = pages.filter(function notListPage(page) { return page.id !== "listPage"; });
    return foreground[foreground.length - 1] || pages[pages.length - 1];
  }

  function stableNodeToken(node) {
    if (!(node instanceof Element)) return "";
    const keys = [
      "archiveTab", "patientTab", "planTab", "serviceTab", "serviceView",
      "historyTabFilter", "historyFile", "checkinRange", "archivePanel",
      "healthTaskTab", "checkinEvalTab", "listView"
    ];
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      if (node.dataset && node.dataset[key]) return key + ":" + node.dataset[key];
    }
    if (node.id) return "id:" + node.id;
    const controlled = node.getAttribute("aria-controls")
      || node.getAttribute("data-target")
      || node.getAttribute("href")
      || node.getAttribute("name")
      || node.getAttribute("value")
      || "";
    if (controlled) return "target:" + controlled;
    const stableClasses = Array.from(node.classList || [])
      .filter(function stableClass(name) {
        return !["active", "selected", "is-active", "open", "current"].includes(name);
      })
      .sort()
      .slice(0, 4)
      .join(".");
    const siblingIndex = node.parentElement ? Array.from(node.parentElement.children).indexOf(node) : 0;
    return stableClasses ? node.tagName.toLowerCase() + "." + stableClasses + ":" + siblingIndex : "";
  }

  function activeViewKey() {
    const values = [];
    const page = activePageElement();
    values.push("page:" + (page && page.id ? page.id : "document"));

    if (page && page.id === "patientArchivePage") {
      const patientName = normalizeText(page.querySelector("[data-archive-text='name']")?.textContent);
      const patientPhone = normalizeText(page.querySelector("[data-archive-text='phone']")?.textContent);
      if (patientName || patientPhone) values.push("patient:" + patientName + ":" + patientPhone);
    } else if (page && page.id === "patientPage") {
      const patientName = normalizeText(page.querySelector("[data-patient-text='name']")?.textContent);
      const visitNo = normalizeText(page.querySelector("[data-patient-text='visitNo']")?.textContent);
      if (patientName || visitNo) values.push("patient:" + patientName + ":" + visitNo);
    }

    if (page && page.id === "listPage") {
      const listViews = Array.from(page.querySelectorAll(".list-view.active")).filter(isVisible);
      const listView = listViews[listViews.length - 1];
      if (listView && listView.id) values.push("view:" + listView.id);
      const serviceView = page.querySelector("[data-service-view].active");
      const serviceToken = stableNodeToken(serviceView);
      if (serviceToken) values.push(serviceToken);
    }

    const selectors = [
      "[data-archive-tab].active",
      ".patient-nav-item.active",
      "[data-patient-tab].active",
      "[data-plan-tab].active",
      "[data-service-tab].active",
      "[data-history-tab-filter].active",
      "[data-history-file].active",
      "[data-checkin-range].active",
      "[data-health-task-tab].active",
      "[data-checkin-eval-tab].active",
      "[data-archive-panel]:not([hidden])",
      "[role='tab'][aria-selected='true']"
    ];
    const root = page || document;
    root.querySelectorAll(selectors.join(",")).forEach(function addActiveToken(node) {
      if (!isVisible(node)) return;
      const token = stableNodeToken(node);
      if (token && !values.includes(token)) values.push(token);
    });
    return values.join("/") || "page:document";
  }

  function activeNavigationText() {
    const selectors = [
      ".sidebar .active", ".sidebar .is-active", ".sidebar .selected",
      ".side-nav .active", ".side-nav .is-active", ".side-nav .selected",
      ".nav .active", ".menu .active", ".archive-side-nav [data-archive-tab].active",
      ".patient-nav-item.active", ".plan-config-tab.active",
      "[role='tab'][aria-selected='true']", "[data-page].active",
      "[data-nav].active", "[aria-current='page']"
    ];
    const values = [];
    document.querySelectorAll(selectors.join(",")).forEach(function addNavigationText(node) {
      if (!isVisible(node)) return;
      const text = shortText(node, 60);
      if (text && !values.includes(text)) values.push(text);
    });
    return values.slice(0, 8).join("/");
  }

  function pageTitle() {
    const selectors = [".page-title", ".content-title", ".main-title", "main h1", "main h2", ".workspace-title", "h1", "h2"];
    for (let index = 0; index < selectors.length; index += 1) {
      const nodes = Array.from(document.querySelectorAll(selectors[index])).filter(isVisible);
      const node = nodes[nodes.length - 1];
      const text = shortText(node, 100);
      if (text) return text;
    }
    return document.title || "页面";
  }

  function openOverlayContext() {
    const selectors = [
      "[data-note-scope]", "#packageEditorOverlay", "#archiveParseDrawer",
      "#archiveUploadModal", "[role='dialog']", "[role='alertdialog']",
      ".ant-modal", ".ant-drawer", ".modal", ".drawer", ".dialog",
      ".medical-upload-modal", ".archive-parse-drawer", ".meal-detail-drawer",
      ".checkin-review-modal", ".task-detail-drawer",
      "[class*='modal']", "[class*='drawer']", "[class*='dialog']"
    ];
    const candidates = Array.from(new Set(Array.from(document.querySelectorAll(selectors.join(",")))))
      .filter(function excludeAnnotationUi(node) { return !node.closest("[data-ui-note-ui]"); })
      .filter(function excludeNestedDialogShell(node) {
        return node.hasAttribute("data-note-scope")
          || node.matches("[role='dialog'],[role='alertdialog']")
          || !node.querySelector("[role='dialog'],[role='alertdialog']");
      })
      .filter(isVisible)
      .filter(function intersectsViewport(node) {
        const rect = node.getBoundingClientRect();
        if (rect.right <= 0 || rect.bottom <= 0 || rect.left >= innerWidth || rect.top >= innerHeight) return false;
        if (node.matches(".archive-parse-drawer") && !node.classList.contains("open")) return false;
        if (node.matches(".order-detail-drawer") && !node.classList.contains("active")) return false;
        return true;
      });
    if (!candidates.length) return null;
    const target = candidates.map(function describe(node, index) {
      return { node: node, index: index, z: Number.parseInt(getComputedStyle(node).zIndex, 10) || 0 };
    }).sort(function byLayer(left, right) {
      return (left.z - right.z) || (left.index - right.index);
    }).pop().node;

    const declaredScope = normalizeText(target.dataset.noteScope);
    const declaredMode = normalizeText(target.dataset.noteMode);
    const declaredEntity = normalizeText(target.dataset.noteEntity);
    const entityKeys = ["entityId", "recordId", "orderId", "orderNo", "transactionNo", "patientId", "packageCode", "reviewRowId", "editingCardId", "detailId"];
    let genericEntity = "";
    for (let index = 0; index < entityKeys.length; index += 1) {
      if (target.dataset && target.dataset[entityKeys[index]]) {
        genericEntity = normalizeText(target.dataset[entityKeys[index]]);
        break;
      }
    }
    const kind = declaredScope ? "screen" : /drawer/i.test(String(target.className || "")) ? "drawer" : "dialog";
    const contextId = (declaredScope
      ? [declaredScope, declaredMode, declaredEntity].filter(Boolean).join(":")
      : [target.id || stableNodeToken(target) || kind, genericEntity].filter(Boolean).join(":")
    ).slice(0, 160);
    const titleSelectors = [".ant-modal-title", ".ant-drawer-title", ".modal-title", ".drawer-title", ".dialog-title", ".panel-title", ".title", "h1", "h2", "h3"];
    let title = "";
    for (let index = 0; index < titleSelectors.length; index += 1) {
      title = shortText(target.querySelector(titleSelectors[index]), 80);
      if (title) break;
    }
    title = title || normalizeText(target.getAttribute("aria-label") || target.dataset.title) || contextId || "弹窗";
    return { type: kind, id: contextId, title: title, element: target };
  }

  function resolveContext() {
    const requested = (location.pathname || "/").split("/").filter(Boolean).pop() || "index.html";
    const routePath = requested === "prototype.html" ? "index.html" : requested;
    const viewKey = activeViewKey();
    const overlay = openOverlayContext();
    const contextType = overlay ? overlay.type : "page";
    const contextId = overlay ? overlay.id : "base";
    const rawBaseScope = [routePath, location.hash || "#", viewKey].join("|");
    const rawScopeKey = rawBaseScope + "|" + contextType + ":" + contextId;
    const surface = overlay?.element || activePageElement() || document.body;
    return {
      projectId: PROJECT_ID,
      pageId: compactIdentity(rawScopeKey),
      rawScopeKey: rawScopeKey,
      baseScope: compactIdentity(rawBaseScope),
      pageTitle: pageTitle(),
      activeText: activeNavigationText(),
      viewKey: viewKey,
      contextType: contextType,
      contextId: contextId,
      contextTitle: overlay ? overlay.title : "",
      routePath: routePath,
      routeHash: location.hash || "#",
      surfaceElement: surface
    };
  }

  function normalizeCoordinate(value, dimension) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0.5;
    if (number >= 0 && number <= 1) return number;
    return Math.max(0, Math.min(1, number / Math.max(1, Number(dimension) || 1)));
  }

  function normalizeNote(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const targetSnapshot = source.targetSnapshot && typeof source.targetSnapshot === "object"
      ? clone(source.targetSnapshot)
      : {};
    const sourceWidth = Number(source.surfaceWidth || source.pageWidth || targetSnapshot.annotationSurfaceWidth || innerWidth || 1);
    const sourceHeight = Number(source.surfaceHeight || source.pageHeight || targetSnapshot.annotationSurfaceHeight || innerHeight || 1);
    const identity = source.scopeKey || source.pageId || "screen:legacy";
    const id = String(source.noteId || source.id || uid("note"));
    const number = Number(source.noteNumber || source.number || 1);
    targetSnapshot.annotationSurfaceHeight = Math.max(1, Number(targetSnapshot.annotationSurfaceHeight || sourceHeight));
    targetSnapshot.annotationSurfaceWidth = Math.max(1, Number(targetSnapshot.annotationSurfaceWidth || sourceWidth));
    targetSnapshot.attachments = Array.isArray(targetSnapshot.attachments) ? targetSnapshot.attachments : [];
    targetSnapshot.interactionAttachments = Array.isArray(targetSnapshot.interactionAttachments) ? targetSnapshot.interactionAttachments : [];
    targetSnapshot.interactionContent = String(targetSnapshot.interactionContent || source.interactionContent || "");
    targetSnapshot.interfaceManifest = targetSnapshot.interfaceManifest && typeof targetSnapshot.interfaceManifest === "object"
      ? targetSnapshot.interfaceManifest
      : {
        pageTitle: source.pageTitle || "",
        activeText: source.activeText || "",
        viewKey: source.viewKey || "",
        contextType: source.contextType || "page",
        contextId: source.contextId || "base",
        contextTitle: source.contextTitle || "",
        routePath: source.routePath || "index.html",
        routeHash: source.routeHash || "#",
        legacyPageId: source.pageId || ""
      };
    return Object.assign({}, source, {
      id: id,
      noteId: id,
      projectId: source.projectId || PROJECT_ID,
      pageId: compactIdentity(identity),
      noteNumber: Number.isFinite(number) && number > 0 ? Math.floor(number) : 1,
      number: Number.isFinite(number) && number > 0 ? Math.floor(number) : 1,
      title: String(source.title || "未命名批注"),
      content: String(source.content || ""),
      x: normalizeCoordinate(source.x, sourceWidth),
      y: normalizeCoordinate(source.y, sourceHeight),
      targetKey: String(source.targetKey || source.anchorSelector || "surface"),
      targetSnapshot: targetSnapshot,
      featureInference: source.featureInference && typeof source.featureInference === "object" ? source.featureInference : {},
      generatedRules: source.generatedRules || null,
      createdBy: source.createdBy || "reviewer",
      updatedBy: source.updatedBy || source.createdBy || "reviewer",
      createdAt: source.createdAt || new Date().toISOString(),
      updatedAt: source.updatedAt || source.createdAt || new Date().toISOString(),
      status: source.status === "deleted" ? "deleted" : "active"
    });
  }

  function mergeNotes(items) {
    const byId = new Map();
    (Array.isArray(items) ? items : []).map(normalizeNote).forEach(function keepNewest(note) {
      const previous = byId.get(note.id);
      const currentTime = Date.parse(note.updatedAt || note.createdAt || 0) || 0;
      const previousTime = Date.parse(previous?.updatedAt || previous?.createdAt || 0) || 0;
      if (!previous || currentTime >= previousTime) byId.set(note.id, note);
    });
    return Array.from(byId.values());
  }

  function matchesCurrentContext(note, context) {
    if (!note || note.projectId !== PROJECT_ID || note.status === "deleted") return false;
    if (note.pageId === context.pageId || compactIdentity(note.scopeKey || "") === context.pageId) return true;

    const manifest = note.targetSnapshot?.interfaceManifest || {};
    const noteContextType = note.contextType || manifest.contextType || "page";
    const noteContextId = note.contextId || manifest.contextId || "base";
    const noteRoute = note.routePath || manifest.routePath || "index.html";
    const sameRoute = noteRoute === context.routePath || !noteRoute;
    const sameContext = noteContextType === context.contextType && noteContextId === context.contextId;
    const identityText = normalizeText([
      note.pageTitle, note.activeText, note.viewKey, note.pageId,
      manifest.pageTitle, manifest.activeText, manifest.viewKey
    ].join(" "));

    const serviceViews = [
      ["服务包管理", "servicePackageView"],
      ["订单管理", "orderManagementView"],
      ["交易记录", "transactionRecordView"]
    ];
    for (let index = 0; index < serviceViews.length; index += 1) {
      if (identityText.includes(serviceViews[index][0])) {
        return context.contextType === "page"
          && noteContextType === "page"
          && sameRoute
          && context.viewKey.includes("view:" + serviceViews[index][1]);
      }
    }

    if (note.pageId === "medical-records-archive") {
      return context.contextType === "page"
        && context.viewKey.includes("page:patientArchivePage")
        && context.viewKey.includes("archiveTab:history");
    }

    const legacyEntityScopes = {
      "note_1786026615978_84618d008aa458": "order-detail:SO202407030001",
      "note_1786025181471_45e921a81d0c88": "service-package-record:120101"
    };
    if (legacyEntityScopes[note.id]) return context.contextId === legacyEntityScopes[note.id];

    const isHistory = identityText.includes("病历");
    if (sameRoute && sameContext && isHistory
      && context.viewKey.includes("page:patientArchivePage")
      && context.viewKey.includes("archiveTab:history")) return true;

    const noteActive = normalizeText(note.activeText || manifest.activeText);
    const contextActive = normalizeText(context.activeText);
    if (sameRoute && sameContext && noteActive && noteActive === contextActive) return true;
    return false;
  }

  function currentNotes() {
    if (!state.context) return [];
    const selected = new Map();
    state.notes.filter(function current(note) {
      return matchesCurrentContext(note, state.context);
    }).forEach(function onePerNumber(note) {
      const key = String(note.noteNumber);
      const previous = selected.get(key);
      const currentTime = Date.parse(note.updatedAt || note.createdAt || 0) || 0;
      const previousTime = Date.parse(previous?.updatedAt || previous?.createdAt || 0) || 0;
      if (!previous || currentTime >= previousTime) selected.set(key, note);
    });
    return Array.from(selected.values()).sort(function byNumber(left, right) {
      return left.noteNumber - right.noteNumber;
    });
  }

  function nextNoteNumber() {
    const used = new Set(currentNotes().map(function number(note) { return Number(note.noteNumber); }));
    let number = 1;
    while (used.has(number)) number += 1;
    return number;
  }

  function apiUrl(path) {
    return config.apiBaseUrl + path;
  }

  async function requestJson(url, options) {
    const controller = new AbortController();
    const timeout = setTimeout(function abortRequest() { controller.abort(); }, 7000);
    try {
      const response = await fetch(url, Object.assign({
        cache: "no-store",
        credentials: "same-origin",
        headers: { "Accept": "application/json" },
        signal: controller.signal
      }, options || {}));
      const body = await response.text();
      let payload;
      try {
        payload = JSON.parse(body);
      } catch (error) {
        throw new Error("线上批注快照返回格式不正确");
      }
      if (!response.ok) throw new Error(payload.message || "批注服务请求失败");
      return payload;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function loadStaticNotes() {
    const embedded = window.__INTERFACE_NOTES_SNAPSHOT__;
    if (Array.isArray(embedded)) {
      state.loadSource = "project-snapshot";
      state.loadError = "";
      return clone(embedded);
    }
    const urls = [
      STATIC_DATA_URL + "?v=" + encodeURIComponent(STATIC_DATA_VERSION),
      new URL("data/interface-notes.json?v=" + encodeURIComponent(STATIC_DATA_VERSION), document.baseURI).href
    ];
    let lastError;
    for (let index = 0; index < urls.length; index += 1) {
      try {
        const payload = await requestJson(urls[index], {});
        const notes = Array.isArray(payload) ? payload : payload.data || payload.notes;
        if (!Array.isArray(notes)) throw new Error("线上批注快照缺少备注列表");
        state.loadSource = "json";
        state.loadError = "";
        return notes;
      } catch (error) {
        lastError = error;
      }
    }
    state.loadSource = "failed";
    state.loadError = String(lastError?.message || "线上批注快照读取失败");
    throw lastError || new Error("线上批注快照读取失败");
  }

  async function loadNotes(context) {
    const token = ++state.requestToken;
    state.loading = true;
    renderToolbar();
    let loaded = [];
    let writable = config.viewerMode !== "read-only";
    try {
      if (config.viewerMode === "read-only") {
        loaded = await loadStaticNotes();
        writable = false;
      } else {
        const payload = await requestJson(apiUrl(API_PATH) + "?projectId=" + encodeURIComponent(PROJECT_ID) + "&scope=all", {});
        loaded = payload.notes || payload.data || [];
        writable = true;
      }
    } catch (error) {
      writable = false;
      try {
        loaded = await loadStaticNotes();
      } catch (staticError) {
        loaded = [];
      }
    }

    if (config.viewerMode !== "read-only") {
      try {
        const legacy = JSON.parse(localStorage.getItem(LEGACY_LOCAL_KEY) || "[]");
        if (Array.isArray(legacy)) loaded = loaded.concat(legacy);
      } catch (error) {
        // Legacy browser data is optional migration input.
      }
    }

    if (token !== state.requestToken) return;
    state.notes = mergeNotes(loaded);
    state.writeAvailable = writable;
    state.loading = false;
    if (context && (!state.context || context.pageId !== state.context.pageId)) enterContext(context);
    renderAll();
  }

  async function persistNote(note, isNew) {
    if (config.viewerMode === "read-only") throw new Error("线上预览为只读，不能新增或修改批注");
    if (!state.writeAvailable) throw new Error("批注服务未连接，请通过 http://127.0.0.1:5173/index.html 打开后再保存");
    const method = isNew ? "POST" : "PATCH";
    const path = isNew ? API_PATH : API_PATH + "/" + encodeURIComponent(note.id);
    const payload = await requestJson(apiUrl(path), {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note)
    });
    return normalizeNote(payload.note || payload.data || note);
  }

  async function removeNote(note) {
    if (config.viewerMode === "read-only") throw new Error("线上预览为只读，不能删除批注");
    if (!state.writeAvailable) throw new Error("批注服务未连接，删除操作未执行");
    await requestJson(apiUrl(API_PATH) + "/" + encodeURIComponent(note.id), { method: "DELETE" });
    return Object.assign({}, note, {
      status: "deleted",
      updatedAt: new Date().toISOString(),
      updatedBy: config.actor
    });
  }

  function ensureShell() {
    if (document.getElementById("uiNoteToolbar")) return;
    const toolbar = document.createElement("section");
    toolbar.id = "uiNoteToolbar";
    toolbar.className = "ui-note-toolbar";
    toolbar.setAttribute("data-ui-note-ui", "");
    toolbar.setAttribute("aria-label", "界面批注工具");
    document.body.appendChild(toolbar);

    const drawer = document.createElement("aside");
    drawer.id = "uiNoteDrawer";
    drawer.className = "ui-note-drawer";
    drawer.setAttribute("data-ui-note-ui", "");
    drawer.setAttribute("aria-hidden", "true");
    drawer.setAttribute("aria-label", "界面批注");
    document.body.appendChild(drawer);

    const viewer = document.createElement("div");
    viewer.id = "uiNoteImageViewer";
    viewer.className = "ui-note-image-viewer";
    viewer.setAttribute("data-ui-note-ui", "");
    viewer.hidden = true;
    viewer.innerHTML = '<button type="button" class="ui-note-image-viewer-close" data-ui-note-action="close-image" aria-label="关闭图片预览">×</button><img alt="批注截图预览">';
    document.body.appendChild(viewer);
    renderToolbar();
  }

  function renderToolbar() {
    let toolbar = document.getElementById("uiNoteToolbar");
    if (!toolbar) {
      ensureShell();
      toolbar = document.getElementById("uiNoteToolbar");
    }
    if (!toolbar) return;
    if (!toolbar.querySelector("[data-ui-note-action='place']")) {
      toolbar.innerHTML = [
        '<span class="ui-note-toolbar-status"></span>',
        '<button type="button" class="ui-note-btn primary" data-ui-note-action="place"></button>',
        '<button type="button" class="ui-note-btn" data-ui-note-action="toggle"></button>',
        '<button type="button" class="ui-note-btn" data-ui-note-action="summary">批注汇总</button>',
        '<button type="button" class="ui-note-btn ui-note-icon-btn" data-ui-note-action="collapse" aria-label="收起批注工具" title="收起批注工具">−</button>',
        '<button type="button" class="ui-note-btn primary ui-note-expand-btn" data-ui-note-action="expand" aria-label="展开批注工具" title="展开批注工具">批注</button>'
      ].join("");
    }
    const notes = currentNotes();
    const readonly = config.viewerMode === "read-only";
    const offline = !readonly && !state.writeAvailable;
    toolbar.classList.toggle("is-collapsed", state.collapsed);
    const statusClass = readonly ? "is-readonly" : offline ? "is-offline" : "";
    const statusTitle = readonly ? "线上只读预览" : offline ? "批注服务未连接" : "批注已连接项目";
    const status = toolbar.querySelector(".ui-note-toolbar-status");
    status.className = "ui-note-toolbar-status" + (statusClass ? " " + statusClass : "");
    status.title = statusTitle;
    toolbar.dataset.uiNotePageId = state.context?.pageId || "";
    toolbar.dataset.uiNoteViewKey = state.context?.viewKey || "";
    toolbar.dataset.uiNoteLoadSource = state.loadSource;
    toolbar.dataset.uiNoteLoadedCount = String(state.notes.filter(function activeNote(note) { return note.status !== "deleted"; }).length);
    toolbar.dataset.uiNoteCurrentCount = String(notes.length);
    if (state.loadError) toolbar.dataset.uiNoteLoadError = state.loadError;
    else delete toolbar.dataset.uiNoteLoadError;
    const place = toolbar.querySelector("[data-ui-note-action='place']");
    place.disabled = readonly || offline;
    place.textContent = state.placing ? "请点击页面位置" : "添加批注";
    toolbar.querySelector("[data-ui-note-action='toggle']").textContent = (state.visible ? "隐藏批注" : "显示批注") + "（" + notes.length + "）";
  }

  function currentSurfaceMetrics() {
    const surface = state.context?.surfaceElement || document.body;
    const rect = surface.getBoundingClientRect();
    const width = Math.max(1, surface.scrollWidth, surface.clientWidth, rect.width);
    const height = Math.max(1, surface.scrollHeight, surface.clientHeight, rect.height);
    return { surface: surface, rect: rect, width: width, height: height };
  }

  function ensureLayer() {
    let layer = document.getElementById("uiNoteLayer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "uiNoteLayer";
      layer.className = "ui-note-layer";
      layer.setAttribute("data-ui-note-ui", "");
    }
    const surface = state.context?.surfaceElement || document.body;
    document.querySelectorAll(".ui-note-surface-active").forEach(function clearSurface(node) {
      if (node !== surface) node.classList.remove("ui-note-surface-active");
    });
    surface.classList.add("ui-note-surface-active");
    if (layer.parentElement !== surface) surface.appendChild(layer);
    return layer;
  }

  function renderPoints() {
    if (!state.context) return;
    const layer = ensureLayer();
    const notes = currentNotes();
    const metrics = currentSurfaceMetrics();
    const maxAnchor = notes.reduce(function largest(result, note) {
      const savedHeight = Number(note.targetSnapshot?.annotationSurfaceHeight || metrics.height);
      return Math.max(result, note.y * savedHeight + 36);
    }, metrics.height);
    layer.style.height = Math.max(metrics.height, maxAnchor) + "px";
    layer.hidden = !state.visible;
    layer.innerHTML = notes.map(function pointMarkup(note) {
      const savedHeight = Math.max(1, Number(note.targetSnapshot?.annotationSurfaceHeight || metrics.height));
      const left = Math.max(13, Math.min(metrics.width - 13, note.x * metrics.width));
      const top = Math.max(13, note.y * savedHeight);
      const selected = note.id === state.selectedId ? " is-selected" : "";
      return '<button type="button" class="ui-note-point' + selected + '" data-ui-note-ui data-ui-note-id="' + escapeHtml(note.id) + '" style="left:' + left + 'px;top:' + top + 'px" aria-label="批注 ' + note.noteNumber + '：' + escapeHtml(note.title) + '" title="' + escapeHtml(note.title) + '">' + note.noteNumber + '</button>';
    }).join("");
  }

  function renderAll() {
    renderToolbar();
    renderPoints();
    if (state.drawerMode === "summary") renderSummary();
  }

  function setPointVisibility(visible) {
    state.visible = Boolean(visible);
    if (!state.visible) state.selectedId = "";
    renderAll();
  }

  function startPlacement() {
    if (config.viewerMode === "read-only" || !state.writeAvailable) {
      toast(config.viewerMode === "read-only" ? "线上预览只能查看已发布批注" : "批注服务未连接，暂时不能添加批注");
      return;
    }
    closeDrawer(false);
    state.placing = !state.placing;
    if (state.placing) {
      setPointVisibility(true);
      document.documentElement.classList.add("ui-note-placing");
      toast("请点击当前界面中需要补充说明的位置");
    } else {
      document.documentElement.classList.remove("ui-note-placing");
    }
    renderToolbar();
  }

  function surfacePointFromEvent(event) {
    const metrics = currentSurfaceMetrics();
    const surface = metrics.surface;
    const xPixel = event.clientX - metrics.rect.left + (surface.scrollLeft || 0);
    const yPixel = event.clientY - metrics.rect.top + (surface.scrollTop || 0);
    return {
      x: Math.max(0, Math.min(1, xPixel / metrics.width)),
      y: Math.max(0, Math.min(1, yPixel / metrics.height)),
      width: metrics.width,
      height: metrics.height
    };
  }

  function stableTargetKey(target) {
    if (!(target instanceof Element)) return "surface";
    const dataKeys = ["action", "page", "nav", "archiveTab", "patientTab", "serviceView", "serviceTab", "noteScope"];
    for (let index = 0; index < dataKeys.length; index += 1) {
      const key = dataKeys[index];
      if (target.dataset && target.dataset[key]) return "data-" + key + ":" + target.dataset[key];
    }
    if (target.id) return "#" + target.id;
    const aria = normalizeText(target.getAttribute("aria-label"));
    if (aria) return target.tagName.toLowerCase() + "[aria-label='" + aria.slice(0, 80) + "']";
    return stableNodeToken(target) || target.tagName.toLowerCase();
  }

  function nearestSection(target) {
    const section = target instanceof Element ? target.closest("section,article,main,[class*='section'],[class*='panel'],[class*='card']") : null;
    if (!section) return state.context?.pageTitle || "";
    const heading = section.querySelector("h1,h2,h3,h4,.title,[class*='title']");
    return shortText(heading, 80) || state.context?.pageTitle || "";
  }

  function targetLabel(target) {
    if (!(target instanceof Element)) return "";
    return normalizeText(
      target.getAttribute("aria-label")
      || target.getAttribute("title")
      || shortText(target, 100)
      || target.getAttribute("name")
      || target.getAttribute("value")
      || ""
    ).slice(0, 120);
  }

  function createDraftAt(event) {
    const point = surfacePointFromEvent(event);
    const target = event.target instanceof Element ? event.target : state.context.surfaceElement;
    const now = new Date().toISOString();
    const id = uid("note");
    const context = state.context;
    const draft = normalizeNote({
      id: id,
      noteId: id,
      projectId: PROJECT_ID,
      pageId: context.pageId,
      scopeKey: context.pageId,
      noteNumber: nextNoteNumber(),
      number: nextNoteNumber(),
      title: "",
      content: "",
      x: point.x,
      y: point.y,
      targetKey: stableTargetKey(target),
      targetSnapshot: {
        section: nearestSection(target),
        label: targetLabel(target),
        role: target.getAttribute?.("role") || target.tagName?.toLowerCase() || "",
        annotationSurfaceHeight: point.height,
        annotationSurfaceWidth: point.width,
        attachments: [],
        interactionContent: "",
        interactionAttachments: [],
        interfaceManifest: {
          pageTitle: context.pageTitle,
          activeText: context.activeText,
          viewKey: context.viewKey,
          contextType: context.contextType,
          contextId: context.contextId,
          contextTitle: context.contextTitle,
          routePath: context.routePath,
          routeHash: context.routeHash
        }
      },
      pageTitle: context.pageTitle,
      activeText: context.activeText,
      viewKey: context.viewKey,
      contextType: context.contextType,
      contextId: context.contextId,
      contextTitle: context.contextTitle,
      routePath: context.routePath,
      routeHash: context.routeHash,
      createdBy: config.actor,
      updatedBy: config.actor,
      createdAt: now,
      updatedAt: now,
      status: "active"
    });
    draft.title = "";
    return draft;
  }

  function draftSnapshot(note) {
    if (!note) return "";
    return JSON.stringify({
      noteNumber: Number(note.noteNumber),
      title: String(note.title || ""),
      content: String(note.content || ""),
      interactionContent: String(note.targetSnapshot?.interactionContent || ""),
      attachments: note.targetSnapshot?.attachments || [],
      interactionAttachments: note.targetSnapshot?.interactionAttachments || []
    });
  }

  function editorDirty() {
    captureEditorValues();
    return Boolean(state.draft && draftSnapshot(state.draft) !== state.editorOriginal);
  }

  function openEditor(note, isNew) {
    state.drawerMode = "editor";
    state.draft = clone(normalizeNote(note));
    if (isNew && !String(note.title || "").trim()) state.draft.title = "";
    state.draft.__isNew = Boolean(isNew);
    state.editorOriginal = draftSnapshot(state.draft);
    state.selectedId = isNew ? "" : state.draft.id;
    renderEditor();
    openDrawer();
    renderPoints();
  }

  function attachmentMarkup(items, field, readonly) {
    return (Array.isArray(items) ? items : []).map(function attachment(item) {
      return [
        '<figure class="ui-note-attachment">',
        '<button type="button" data-ui-note-image-open="' + escapeHtml(item.id) + '" data-ui-note-image-field="' + field + '" aria-label="放大查看截图"><img src="' + escapeHtml(item.dataUrl || item.url || "") + '" alt="' + escapeHtml(item.name || "批注截图") + '"></button>',
        readonly ? "" : '<button type="button" class="ui-note-attachment-remove" data-ui-note-image-remove="' + escapeHtml(item.id) + '" data-ui-note-image-field="' + field + '" aria-label="移除截图">×</button>',
        '</figure>'
      ].join("");
    }).join("");
  }

  function renderEditorAttachments() {
    if (!state.draft) return;
    const readonly = config.viewerMode === "read-only";
    const logic = document.querySelector("[data-ui-note-attachments='logic']");
    const interaction = document.querySelector("[data-ui-note-attachments='interaction']");
    if (logic) logic.innerHTML = attachmentMarkup(state.draft.targetSnapshot.attachments, "logic", readonly);
    if (interaction) interaction.innerHTML = attachmentMarkup(state.draft.targetSnapshot.interactionAttachments, "interaction", readonly);
  }

  function renderEditor() {
    const drawer = document.getElementById("uiNoteDrawer");
    if (!drawer || !state.draft) return;
    const note = state.draft;
    const readonly = config.viewerMode === "read-only";
    const offline = !readonly && !state.writeAvailable;
    const modeTitle = readonly ? "查看批注" : note.__isNew ? "添加批注" : "编辑批注";
    drawer.innerHTML = [
      '<header class="ui-note-drawer-head">',
      '<div class="ui-note-drawer-title"><strong>' + modeTitle + '</strong><span>' + escapeHtml(state.context?.contextTitle || state.context?.pageTitle || "当前界面") + '</span></div>',
      '<button type="button" class="ui-note-btn ui-note-icon-btn" data-ui-note-action="close-drawer" aria-label="关闭批注">×</button>',
      '</header>',
      '<div class="ui-note-drawer-body">',
      readonly ? '<div class="ui-note-readonly-banner">当前是线上只读预览，可查看已发布批注，但不能新增、修改、拖动或删除。</div>' : "",
      offline ? '<div class="ui-note-offline-banner">批注服务未连接。请通过本地预览服务打开项目，避免内容只保存在浏览器中。</div>' : "",
      '<div class="ui-note-meta-grid">',
      '<div class="ui-note-field"><label for="uiNoteNumber">批注编号</label><input id="uiNoteNumber" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6" value="' + escapeHtml(note.noteNumber) + '" ' + (readonly ? "readonly" : "") + '></div>',
      '<div class="ui-note-field"><label for="uiNoteTitle">批注标题</label><input id="uiNoteTitle" type="text" maxlength="120" value="' + escapeHtml(note.title) + '" placeholder="用标题明确指出功能点" ' + (readonly ? "readonly" : "") + '></div>',
      '</div>',
      '<section class="ui-note-editor" data-ui-note-editor="logic">',
      '<div class="ui-note-editor-label"><span>逻辑补充</span><button type="button" class="ui-note-ai-btn" data-ui-note-action="ai-append" data-ui-note-field="logic" ' + (readonly ? "disabled" : "") + '>AI 补充一条</button></div>',
      '<textarea id="uiNoteLogic" maxlength="' + MAX_TEXT_LENGTH + '" data-ui-note-textarea="logic" placeholder="填写业务规则、数据条件、展示条件和结果范围" ' + (readonly ? "readonly" : "") + '>' + escapeHtml(note.content) + '</textarea>',
      '<p class="ui-note-editor-hint">可直接粘贴截图；按编号输入后回车会自动续号。</p>',
      '<div class="ui-note-attachments" data-ui-note-attachments="logic">' + attachmentMarkup(note.targetSnapshot.attachments, "logic", readonly) + '</div>',
      '</section>',
      '<section class="ui-note-editor" data-ui-note-editor="interaction">',
      '<div class="ui-note-editor-label"><span>交互逻辑补充</span><button type="button" class="ui-note-ai-btn" data-ui-note-action="ai-append" data-ui-note-field="interaction" ' + (readonly ? "disabled" : "") + '>AI 补充一条</button></div>',
      '<textarea id="uiNoteInteraction" maxlength="' + MAX_TEXT_LENGTH + '" data-ui-note-textarea="interaction" placeholder="填写操作、状态、反馈、跳转、加载、空状态和异常处理" ' + (readonly ? "readonly" : "") + '>' + escapeHtml(note.targetSnapshot.interactionContent) + '</textarea>',
      '<p class="ui-note-editor-hint">截图会保存在当前字段中，并支持移除和点击放大。</p>',
      '<div class="ui-note-attachments" data-ui-note-attachments="interaction">' + attachmentMarkup(note.targetSnapshot.interactionAttachments, "interaction", readonly) + '</div>',
      '</section>',
      '</div>',
      '<footer class="ui-note-drawer-foot">',
      !readonly && !note.__isNew ? '<button type="button" class="ui-note-btn danger" data-ui-note-action="delete">删除</button>' : '<span></span>',
      '<div class="ui-note-foot-actions">',
      '<button type="button" class="ui-note-btn" data-ui-note-action="close-drawer">' + (readonly ? "关闭" : "取消") + '</button>',
      readonly ? "" : '<button type="button" class="ui-note-btn primary" data-ui-note-action="save">保存</button>',
      '</div>',
      '</footer>'
    ].join("");
  }

  function captureEditorValues() {
    if (!state.draft || state.drawerMode !== "editor") return;
    const numberInput = document.getElementById("uiNoteNumber");
    const titleInput = document.getElementById("uiNoteTitle");
    const logicInput = document.getElementById("uiNoteLogic");
    const interactionInput = document.getElementById("uiNoteInteraction");
    if (numberInput) state.draft.noteNumber = Number(String(numberInput.value).replace(/\D/g, "")) || 0;
    state.draft.number = state.draft.noteNumber;
    if (titleInput) state.draft.title = titleInput.value;
    if (logicInput) state.draft.content = logicInput.value;
    if (interactionInput) state.draft.targetSnapshot.interactionContent = interactionInput.value;
  }

  function openDrawer() {
    const drawer = document.getElementById("uiNoteDrawer");
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("ui-note-drawer-open");
    renderToolbar();
    schedulePositionRefresh();
  }

  function closeDrawer(force) {
    if (!force && state.drawerMode === "editor" && editorDirty()) {
      if (!window.confirm("当前批注还有未保存修改，确定放弃吗？")) return false;
    }
    const drawer = document.getElementById("uiNoteDrawer");
    drawer?.classList.remove("is-open");
    drawer?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("ui-note-drawer-open");
    state.drawerMode = "";
    state.draft = null;
    state.editorOriginal = "";
    state.selectedId = "";
    renderAll();
    if (state.pendingContext) {
      const pending = state.pendingContext;
      state.pendingContext = null;
      enterContext(pending);
      loadNotes(pending);
    }
    return true;
  }

  async function saveEditor() {
    if (!state.draft) return;
    captureEditorValues();
    const note = state.draft;
    const number = Number(note.noteNumber);
    const title = String(note.title || "").trim();
    const logic = String(note.content || "").trim();
    const interaction = String(note.targetSnapshot.interactionContent || "").trim();
    if (!Number.isInteger(number) || number < 1) return toast("批注编号请输入大于 0 的整数");
    if (!title) return toast("请填写批注标题");
    if (!logic && !interaction) return toast("逻辑补充和交互逻辑补充至少填写一项");
    const duplicate = currentNotes().find(function sameNumber(item) {
      return item.id !== note.id && item.noteNumber === number;
    });
    if (duplicate) return toast("当前界面已存在相同批注编号");

    note.title = title;
    note.content = logic;
    note.targetSnapshot.interactionContent = interaction;
    note.number = number;
    note.noteNumber = number;
    note.updatedAt = new Date().toISOString();
    note.updatedBy = config.actor;
    note.status = "active";
    try {
      const saved = await persistNote(note, note.__isNew);
      const index = state.notes.findIndex(function sameId(item) { return item.id === saved.id; });
      if (index >= 0) state.notes[index] = saved;
      else state.notes.push(saved);
      state.draft = null;
      state.editorOriginal = "";
      closeDrawer(true);
      setPointVisibility(true);
      toast("批注已保存到项目");
    } catch (error) {
      toast(error.message || "批注保存失败");
    }
  }

  async function deleteEditor() {
    if (!state.draft || state.draft.__isNew) return;
    if (!window.confirm("确定删除这条批注吗？删除后该编号将保留历史记录。")) return;
    try {
      const deleted = await removeNote(state.draft);
      const index = state.notes.findIndex(function sameId(item) { return item.id === deleted.id; });
      if (index >= 0) state.notes[index] = deleted;
      closeDrawer(true);
      toast("批注已删除");
    } catch (error) {
      toast(error.message || "批注删除失败");
    }
  }

  function nextNumberedMarker(text) {
    const lines = String(text || "").split(/\r?\n/).filter(function nonempty(line) { return line.trim(); });
    const last = lines[lines.length - 1] || "";
    const match = last.match(/^\s*(\d+)(、|\.|\)|．)\s?/);
    return { number: match ? Number(match[1]) + 1 : 1, separator: match ? match[2] : "、" };
  }

  function insertTextAtCursor(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = textarea.value.slice(0, start) + text + textarea.value.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function handleNumberedEnter(event) {
    const textarea = event.target.closest("[data-ui-note-textarea]");
    if (!textarea || event.key !== "Enter" || event.shiftKey || textarea.readOnly) return;
    const before = textarea.value.slice(0, textarea.selectionStart);
    const lineStart = before.lastIndexOf("\n") + 1;
    const currentLine = before.slice(lineStart);
    const match = currentLine.match(/^(\s*)(\d+)(、|\.|\)|．)\s?(.*)$/);
    if (!match) return;
    event.preventDefault();
    if (!match[4].trim()) {
      textarea.setRangeText("", lineStart, textarea.selectionStart, "end");
      insertTextAtCursor(textarea, "\n");
      return;
    }
    insertTextAtCursor(textarea, "\n" + match[1] + (Number(match[2]) + 1) + match[3]);
  }

  function sourceEvidence() {
    const note = state.draft;
    const snapshot = note?.targetSnapshot || {};
    return {
      title: normalizeText(note?.title),
      targetKey: normalizeText(note?.targetKey),
      section: normalizeText(snapshot.section),
      label: normalizeText(snapshot.label),
      role: normalizeText(snapshot.role),
      page: normalizeText(state.context?.pageTitle),
      context: normalizeText(state.context?.contextTitle)
    };
  }

  function chooseRule(field, currentText, evidence) {
    const signal = normalizeText([
      evidence.title, evidence.label, evidence.section,
      evidence.targetKey, evidence.page, evidence.context
    ].join(" "));
    const logicCandidates = [];
    const interactionCandidates = [];

    if (/筛选|查询|搜索/.test(signal)) {
      logicCandidates.push("无符合条件的数据时展示空状态，并保留当前已填写的查询条件。");
      interactionCandidates.push("查询过程中显示加载状态并防止重复提交，失败时保留查询条件并支持重试。");
    }
    if (/删除|移除/.test(signal)) {
      logicCandidates.push("仅对当前选中的业务数据执行删除，不影响其他页面或其他记录。");
      interactionCandidates.push("删除前进行二次确认；取消后保持原数据，成功后刷新当前区域并提示结果。");
    }
    if (/保存|提交|确认/.test(signal)) {
      logicCandidates.push("必填项或业务校验不通过时阻止提交，并保留用户已填写内容。");
      interactionCandidates.push("提交期间按钮进入加载状态并防止重复点击；失败时保留内容并给出重试提示。");
    }
    if (/切换|分类|标签|TAB|tab/.test(signal)) {
      logicCandidates.push("切换只影响当前界面的展示范围，不改变其他页面已经保存的数据。");
      interactionCandidates.push("切换后重新加载对应界面数据，并将该界面的批注默认保持隐藏。");
    }
    if (/弹窗|抽屉|详情|查看/.test(signal)) {
      logicCandidates.push("详情内容按当前选中记录展示，不与其他记录的内容混用。");
      interactionCandidates.push("打开详情时显示加载状态；关闭后返回原列表位置，并保留原筛选条件。");
    }
    if (/上传|图片|附件/.test(signal)) {
      logicCandidates.push("仅接收页面已声明支持的文件类型和数量，超限文件不进入待提交列表。");
      interactionCandidates.push("上传中显示进度，失败文件保留错误状态并支持单独重试或移除。");
    }
    if (/列表|记录|数据/.test(signal)) {
      logicCandidates.push("列表内容按当前页面条件展示，空数据时提供明确的空状态说明。");
    }
    if (/button|按钮/.test(evidence.role + " " + signal)) {
      interactionCandidates.push("点击后立即反馈处理中状态，并在处理完成前阻止重复触发。");
    }
    logicCandidates.push("该规则仅作用于当前界面身份，不与其他页面、标签或弹窗的数据合并。");
    interactionCandidates.push("操作失败时保留当前输入和界面位置，并提供明确错误提示与重试入口。");
    const candidates = field === "logic" ? logicCandidates : interactionCandidates;
    return candidates.find(function missing(candidate) {
      const key = candidate.replace(/[，。；]/g, "").slice(0, 16);
      return !String(currentText || "").replace(/\s/g, "").includes(key);
    }) || "";
  }

  function appendAiRule(field) {
    if (!state.draft || config.viewerMode === "read-only") return;
    captureEditorValues();
    const title = String(state.draft.title || "").trim();
    const currentText = field === "logic"
      ? String(state.draft.content || "")
      : String(state.draft.targetSnapshot.interactionContent || "");
    if (!title) return toast("请先填写批注标题，标题是规则补充的主要依据");
    if (!currentText.trim()) return toast("请先填写一条人工说明，再让 AI 补充缺失规则");
    const evidence = sourceEvidence();
    const rule = chooseRule(field, currentText, evidence);
    if (!rule) return toast("当前说明已经较完整，未发现需要追加的规则");
    const marker = nextNumberedMarker(currentText);
    const addition = (currentText.endsWith("\n") ? "" : "\n") + marker.number + marker.separator + rule;
    if (field === "logic") state.draft.content = currentText + addition;
    else state.draft.targetSnapshot.interactionContent = currentText + addition;
    state.draft.featureInference = {
      primarySignal: title,
      targetKey: evidence.targetKey,
      section: evidence.section,
      label: evidence.label,
      role: evidence.role,
      interface: state.context?.pageId,
      source: "title-led-dom-evidence"
    };
    state.draft.generatedRules = {
      field: field,
      appended: rule,
      generatedAt: new Date().toISOString(),
      mode: "title-led-additive"
    };
    const textarea = document.querySelector("[data-ui-note-textarea='" + field + "']");
    if (textarea) {
      textarea.value = field === "logic" ? state.draft.content : state.draft.targetSnapshot.interactionContent;
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
      textarea.style.height = "auto";
      textarea.style.height = Math.min(420, Math.max(132, textarea.scrollHeight)) + "px";
    }
    toast("已追加 1 条可编辑规则，原内容保持不变");
  }

  function loadImageElement(file) {
    return new Promise(function load(resolve, reject) {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.onload = function loaded() {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = function failed() {
        URL.revokeObjectURL(url);
        reject(new Error("截图读取失败"));
      };
      image.src = url;
    });
  }

  async function compressScreenshot(file) {
    if (!file || !/^image\/(png|jpeg|jpg|webp)$/i.test(file.type)) throw new Error("仅支持 PNG、JPG、JPEG 或 WebP 截图");
    if (file.size > MAX_SOURCE_IMAGE_BYTES) throw new Error("单张截图不能超过 8MB");
    const image = await loadImageElement(file);
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    let dataUrl = canvas.toDataURL("image/jpeg", .82);
    if (dataUrl.length > MAX_STORED_IMAGE_CHARACTERS) dataUrl = canvas.toDataURL("image/jpeg", .65);
    if (dataUrl.length > MAX_STORED_IMAGE_CHARACTERS) throw new Error("截图压缩后仍过大，请缩小截图范围后重试");
    return {
      id: uid("image"),
      name: file.name || "clipboard-" + Date.now() + ".jpg",
      mimeType: "image/jpeg",
      dataUrl: dataUrl,
      createdAt: new Date().toISOString()
    };
  }

  async function handleScreenshotPaste(event) {
    const textarea = event.target.closest("[data-ui-note-textarea]");
    if (!textarea || config.viewerMode === "read-only" || !state.draft) return;
    const files = Array.from(event.clipboardData?.items || [])
      .filter(function imageItem(item) { return item.kind === "file" && item.type.startsWith("image/"); })
      .map(function itemFile(item) { return item.getAsFile(); })
      .filter(Boolean);
    if (!files.length) return;
    event.preventDefault();
    captureEditorValues();
    const field = textarea.dataset.uiNoteTextarea;
    const key = field === "logic" ? "attachments" : "interactionAttachments";
    const existing = state.draft.targetSnapshot[key];
    if (existing.length + files.length > MAX_ATTACHMENTS_PER_FIELD) {
      return toast("每个补充字段最多保留 " + MAX_ATTACHMENTS_PER_FIELD + " 张截图");
    }
    try {
      for (let index = 0; index < files.length; index += 1) {
        existing.push(await compressScreenshot(files[index]));
      }
      renderEditorAttachments();
      toast("截图已粘贴到" + (field === "logic" ? "逻辑补充" : "交互逻辑补充"));
    } catch (error) {
      toast(error.message || "截图处理失败");
    }
  }

  function findAttachment(field, id) {
    if (!state.draft) return null;
    const key = field === "logic" ? "attachments" : "interactionAttachments";
    return state.draft.targetSnapshot[key].find(function byId(item) { return item.id === id; }) || null;
  }

  function removeAttachment(field, id) {
    if (!state.draft || config.viewerMode === "read-only") return;
    captureEditorValues();
    const key = field === "logic" ? "attachments" : "interactionAttachments";
    state.draft.targetSnapshot[key] = state.draft.targetSnapshot[key].filter(function keep(item) { return item.id !== id; });
    renderEditorAttachments();
  }

  function openImageViewer(item) {
    if (!item) return;
    const viewer = document.getElementById("uiNoteImageViewer");
    const image = viewer?.querySelector("img");
    if (!viewer || !image) return;
    image.src = item.dataUrl || item.url || "";
    image.alt = item.name || "批注截图预览";
    viewer.hidden = false;
  }

  function closeImageViewer() {
    const viewer = document.getElementById("uiNoteImageViewer");
    if (!viewer) return;
    viewer.hidden = true;
    const image = viewer.querySelector("img");
    if (image) image.removeAttribute("src");
  }

  function summaryScreenshots(items) {
    if (!Array.isArray(items) || !items.length) return "";
    return '<div class="ui-note-attachments">' + attachmentMarkup(items, "summary", true) + '</div>';
  }

  function renderSummary() {
    const drawer = document.getElementById("uiNoteDrawer");
    if (!drawer || state.drawerMode !== "summary") return;
    const active = state.notes.filter(function activeNote(note) {
      return note.projectId === PROJECT_ID && note.status !== "deleted";
    });
    const groups = new Map();
    active.forEach(function groupNote(note) {
      if (!groups.has(note.pageId)) groups.set(note.pageId, []);
      groups.get(note.pageId).push(note);
    });
    const contextId = state.context?.pageId || "";
    const groupMarkup = Array.from(groups.entries()).sort(function currentFirst(left, right) {
      return Number(right[0] === contextId) - Number(left[0] === contextId);
    }).map(function group(entry) {
      const pageId = entry[0];
      const notes = entry[1].sort(function byNumber(left, right) { return left.noteNumber - right.noteNumber; });
      const first = notes[0];
      const manifest = first.targetSnapshot?.interfaceManifest || {};
      const label = first.contextTitle || manifest.contextTitle || first.pageTitle || manifest.pageTitle || pageId;
      return [
        '<section class="ui-note-summary-group">',
        '<header class="ui-note-summary-group-head"><strong title="' + escapeHtml(pageId) + '">' + escapeHtml(label) + '</strong>' + (pageId === contextId ? '<span class="ui-note-current-badge">当前界面</span>' : "") + '</header>',
        notes.map(function summaryItem(note) {
          const interaction = note.targetSnapshot?.interactionContent || "";
          const allImages = [].concat(note.targetSnapshot?.attachments || [], note.targetSnapshot?.interactionAttachments || []);
          return [
            '<article class="ui-note-summary-item">',
            '<div class="ui-note-summary-item-head"><span class="ui-note-summary-number">' + note.noteNumber + '</span><button type="button" data-ui-note-summary-id="' + escapeHtml(note.id) + '">' + escapeHtml(note.title) + '</button></div>',
            '<div class="ui-note-summary-section"><b>逻辑补充</b>' + escapeHtml(note.content || "暂无") + '</div>',
            '<div class="ui-note-summary-section"><b>交互逻辑补充</b>' + escapeHtml(interaction || "暂无") + '</div>',
            summaryScreenshots(allImages),
            '</article>'
          ].join("");
        }).join(""),
        '</section>'
      ].join("");
    }).join("");
    drawer.innerHTML = [
      '<header class="ui-note-drawer-head">',
      '<div class="ui-note-drawer-title"><strong>批注汇总</strong><span>共 ' + active.length + ' 条，按界面精确分组</span></div>',
      '<button type="button" class="ui-note-btn ui-note-icon-btn" data-ui-note-action="close-drawer" aria-label="关闭批注汇总">×</button>',
      '</header>',
      '<div class="ui-note-drawer-body">' + (groupMarkup || '<div class="ui-note-empty">项目中暂无批注</div>') + '</div>',
      '<footer class="ui-note-drawer-foot"><span></span><button type="button" class="ui-note-btn" data-ui-note-action="close-drawer">关闭</button></footer>'
    ].join("");
  }

  function openSummary() {
    if (state.drawerMode === "editor" && !closeDrawer(false)) return;
    state.drawerMode = "summary";
    state.draft = null;
    state.selectedId = "";
    renderSummary();
    openDrawer();
  }

  function openSummaryNote(id) {
    const note = state.notes.find(function sameId(item) { return item.id === id; });
    if (!note) return;
    if (matchesCurrentContext(note, state.context)) {
      setPointVisibility(true);
      openEditor(note, false);
    } else {
      toast("该批注属于其他界面，可在汇总中查看；切换到对应界面后可定位和编辑");
    }
  }

  function toast(message) {
    document.querySelector(".ui-note-toast")?.remove();
    const node = document.createElement("div");
    node.className = "ui-note-toast";
    node.setAttribute("data-ui-note-ui", "");
    node.setAttribute("role", "status");
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(function removeToast() { node.remove(); }, 2800);
  }

  function enterContext(context) {
    if (!context) return;
    state.context = context;
    state.visible = false;
    state.placing = false;
    state.selectedId = "";
    document.documentElement.classList.remove("ui-note-placing");
    renderAll();
  }

  function requestContextRefresh() {
    clearTimeout(state.refreshTimer);
    state.refreshTimer = setTimeout(function refreshContext() {
      ensureShell();
      const next = resolveContext();
      if (!state.context) {
        enterContext(next);
        loadNotes(next);
        return;
      }
      if (next.pageId === state.context.pageId) {
        if (state.context.surfaceElement !== next.surfaceElement) {
          state.context.surfaceElement = next.surfaceElement;
          schedulePositionRefresh();
        }
        return;
      }
      if (state.drawerMode === "editor" && editorDirty()) {
        state.pendingContext = next;
        document.getElementById("uiNoteLayer")?.setAttribute("hidden", "");
        toast("界面已切换，请先保存或取消当前批注");
        return;
      }
      closeDrawer(true);
      enterContext(next);
      loadNotes(next);
    }, 120);
  }

  function schedulePositionRefresh() {
    if (state.positionFrame) return;
    state.positionFrame = requestAnimationFrame(function positionRefresh() {
      state.positionFrame = 0;
      renderPoints();
    });
  }

  function beginPointDrag(event, note, point) {
    if (config.viewerMode === "read-only" || !state.writeAvailable) return;
    const metrics = currentSurfaceMetrics();
    state.drag = {
      pointerId: event.pointerId,
      note: clone(note),
      point: point,
      startClientX: event.clientX,
      startClientY: event.clientY,
      moved: false,
      metrics: metrics
    };
    point.setPointerCapture?.(event.pointerId);
    point.classList.add("is-dragging");
    event.preventDefault();
    event.stopPropagation();
  }

  function movePointDrag(event) {
    const drag = state.drag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - drag.startClientX, event.clientY - drag.startClientY);
    if (distance > 3) drag.moved = true;
    if (!drag.moved) return;
    const position = surfacePointFromEvent(event);
    drag.note.x = position.x;
    drag.note.y = position.y;
    drag.note.targetSnapshot.annotationSurfaceHeight = position.height;
    drag.note.targetSnapshot.annotationSurfaceWidth = position.width;
    drag.point.style.left = Math.max(13, Math.min(position.width - 13, position.x * position.width)) + "px";
    drag.point.style.top = Math.max(13, position.y * position.height) + "px";
    event.preventDefault();
  }

  async function endPointDrag(event) {
    const drag = state.drag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    state.drag = null;
    drag.point.classList.remove("is-dragging");
    drag.point.releasePointerCapture?.(event.pointerId);
    if (!drag.moved) return;
    state.suppressPointClick = true;
    setTimeout(function allowPointClick() { state.suppressPointClick = false; }, 0);
    drag.note.updatedAt = new Date().toISOString();
    drag.note.updatedBy = config.actor;
    try {
      const saved = await persistNote(drag.note, false);
      const index = state.notes.findIndex(function sameId(note) { return note.id === saved.id; });
      if (index >= 0) state.notes[index] = saved;
      renderPoints();
      toast("批注位置已保存");
    } catch (error) {
      renderPoints();
      toast(error.message || "批注位置保存失败");
    }
  }

  function handlePointerDown(event) {
    const point = event.target.closest(".ui-note-point[data-ui-note-id]");
    if (!point) return;
    const note = state.notes.find(function sameId(item) { return item.id === point.dataset.uiNoteId; });
    if (note) beginPointDrag(event, note, point);
  }

  function handlePlacementClick(event) {
    if (!state.placing) return false;
    if (event.target.closest("[data-ui-note-ui]")) return false;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const draft = createDraftAt(event);
    state.placing = false;
    document.documentElement.classList.remove("ui-note-placing");
    renderToolbar();
    openEditor(draft, true);
    return true;
  }

  function handleClick(event) {
    if (handlePlacementClick(event)) return;
    const point = event.target.closest(".ui-note-point[data-ui-note-id]");
    if (point) {
      event.preventDefault();
      event.stopPropagation();
      if (state.suppressPointClick) return;
      const note = state.notes.find(function sameId(item) { return item.id === point.dataset.uiNoteId; });
      if (note) openEditor(note, false);
      return;
    }

    const actionNode = event.target.closest("[data-ui-note-action]");
    if (actionNode) {
      const action = actionNode.dataset.uiNoteAction;
      if (action === "place") startPlacement();
      if (action === "toggle") setPointVisibility(!state.visible);
      if (action === "summary") openSummary();
      if (action === "collapse") {
        state.collapsed = true;
        saveToolState();
        renderToolbar();
      }
      if (action === "expand") {
        state.collapsed = false;
        saveToolState();
        renderToolbar();
      }
      if (action === "close-drawer") closeDrawer(false);
      if (action === "save") saveEditor();
      if (action === "delete") deleteEditor();
      if (action === "ai-append") appendAiRule(actionNode.dataset.uiNoteField);
      if (action === "close-image") closeImageViewer();
      return;
    }

    const removeImage = event.target.closest("[data-ui-note-image-remove]");
    if (removeImage) {
      removeAttachment(removeImage.dataset.uiNoteImageField, removeImage.dataset.uiNoteImageRemove);
      return;
    }
    const openImage = event.target.closest("[data-ui-note-image-open]");
    if (openImage) {
      let item = findAttachment(openImage.dataset.uiNoteImageField, openImage.dataset.uiNoteImageOpen);
      if (!item) {
        item = state.notes.flatMap(function allAttachments(note) {
          return [].concat(note.targetSnapshot?.attachments || [], note.targetSnapshot?.interactionAttachments || []);
        }).find(function byId(attachment) { return attachment.id === openImage.dataset.uiNoteImageOpen; });
      }
      openImageViewer(item);
      return;
    }
    const summaryItem = event.target.closest("[data-ui-note-summary-id]");
    if (summaryItem) openSummaryNote(summaryItem.dataset.uiNoteSummaryId);
  }

  function handleInput(event) {
    if (!event.target.matches("#uiNoteNumber,#uiNoteTitle,[data-ui-note-textarea]")) return;
    captureEditorValues();
  }

  function ownedMutation(record) {
    const target = record.target instanceof Element ? record.target : record.target.parentElement;
    if (target?.closest("[data-ui-note-ui]")) return true;
    const changed = [].concat(Array.from(record.addedNodes || []), Array.from(record.removedNodes || []));
    return changed.length > 0 && changed.every(function owned(node) {
      const element = node instanceof Element ? node : node.parentElement;
      return Boolean(element?.closest("[data-ui-note-ui]") || element?.matches?.("[data-ui-note-ui]"));
    });
  }

  function start() {
    ensureShell();
    enterContext(resolveContext());
    document.addEventListener("click", handleClick, true);
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("pointermove", movePointDrag, true);
    document.addEventListener("pointerup", endPointDrag, true);
    document.addEventListener("pointercancel", endPointDrag, true);
    document.addEventListener("keydown", handleNumberedEnter, true);
    document.addEventListener("paste", handleScreenshotPaste, true);
    document.addEventListener("input", handleInput, true);
    document.addEventListener("scroll", schedulePositionRefresh, true);
    window.addEventListener("resize", schedulePositionRefresh);
    window.addEventListener("popstate", requestContextRefresh);
    window.addEventListener("hashchange", requestContextRefresh);
    window.addEventListener("beforeunload", function protectUnsaved(event) {
      if (state.drawerMode === "editor" && editorDirty()) {
        event.preventDefault();
        event.returnValue = "";
      }
    });
    new MutationObserver(function pageChanged(records) {
      if (records.some(function businessMutation(record) { return !ownedMutation(record); })) requestContextRefresh();
    }).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "aria-current", "aria-selected", "aria-hidden", "hidden", "style", "data-note-entity", "data-note-mode"]
    });
    setInterval(requestContextRefresh, 500);
    loadNotes(state.context);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
