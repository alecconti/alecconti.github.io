import * as THREE from './vendor/three.module.min.js';
import { LEXICON_FEED, SECTIONS, STATIC_BOOKS, liveBooks } from './books.js';
import { Reader } from './reader.js';
import { makeBookTextures, pageEdgeTextures } from './textures.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SPEED = reduceMotion ? 0.35 : 1;
const CAM = { y: 1.2, z: 9, fov: 28 };
const COVER = 0.035;
const GAP = 0.035;
const SECTION_GAP = 0.55;
const SPINE_Z = 0.85;

const $ = (sel) => document.querySelector(sel);
const stage = $('#stage');
const caption = $('#caption');
const status = $('#live-status');

/* ---------- Data ---------- */

async function loadFeed() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(LEXICON_FEED, { signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function ago(ms) {
  const m = Math.round((Date.now() - ms) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h} h ago` : `${Math.round(h / 24)} d ago`;
}

function orderBooks(books) {
  const order = ['about', 'work', 'notebooks', 'reading', 'read'];
  return books.slice().sort((a, b) => order.indexOf(a.section) - order.indexOf(b.section));
}

/* ---------- Accessible list (also the fallback without WebGL) ---------- */

function buildList(books, openById) {
  const nav = $('#book-list');
  nav.innerHTML = '';
  let section = null;
  for (const book of books) {
    if (book.section !== section) {
      section = book.section;
      const h = document.createElement('h2');
      h.textContent = SECTIONS[section];
      nav.append(h);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'list-spine';
    btn.style.setProperty('--cloth', book.cloth);
    btn.style.setProperty('--foil', book.foil);
    btn.innerHTML = `<span>${book.title}</span><small>${book.subtitle ?? ''}</small>`;
    btn.addEventListener('click', () => openById(book.id));
    nav.append(btn);
  }
}

/* ---------- Scene ---------- */

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const lerp = (a, b, t) => a + (b - a) * t;

async function main() {
  await Promise.race([
    Promise.all([
      document.fonts.load('500 40px "Newsreader"'),
      document.fonts.load('italic 400 40px "Newsreader"'),
      document.fonts.load('500 20px "IBM Plex Mono"'),
    ]),
    new Promise((r) => setTimeout(r, 2500)),
  ]).catch(() => {});

  status.textContent = 'Fetching notebooks from Lexicon…';
  const feed = await loadFeed();
  if (feed) {
    status.innerHTML = `<span class="dot"></span>Live from Lexicon · updated ${ago(feed.updatedAt)}`;
    status.classList.add('live');
  } else {
    status.textContent = 'Lexicon is offline, so the notebooks are blank for now';
  }

  const books = orderBooks([...STATIC_BOOKS, ...liveBooks(feed)]);
  const byId = new Map(books.map((b) => [b.id, b]));

  const reader = new Reader($('#reader'), { onClose: () => closeBook() });
  let openBook = () => {};
  buildList(books, (id) => openBook(id));

  if (!webglAvailable()) {
    document.body.classList.add('no-webgl');
    openBook = (id) => {
      const vw = innerWidth;
      const vh = innerHeight;
      const single = vw < 760;
      const h = Math.min(vh * 0.78, single ? vw * 1.4 : vw * 0.62);
      const w = single ? h / 1.42 : (h / 1.42) * 2;
      reader.open(byId.get(id), { left: (vw - w) / 2, top: (vh - h) / 2 - 20, width: w, height: h }, single);
    };
    closeBook = () => reader.close();
    return;
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  stage.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAM.fov, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x8d8272, 1.5));
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
  sun.position.set(-3, 7, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -8;
  sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 6;
  sun.shadow.camera.bottom = -3;
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0005;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight(0xdfe6ff, 0.5);
  fill.position.set(5, 3, 6);
  scene.add(fill);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 40), new THREE.ShadowMaterial({ opacity: 0.16 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 100),
    new THREE.MeshBasicMaterial({ color: getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#efebe3', transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
  );
  backdrop.position.set(0, 0, 1.5);
  backdrop.visible = false;
  scene.add(backdrop);

  /* Books */
  const paper = pageEdgeTextures(renderer);
  const states = [];
  let x = 0;
  let section = null;
  const sectionStarts = [];
  for (const book of books) {
    if (book.section !== section) {
      if (section !== null) x += SECTION_GAP;
      section = book.section;
      sectionStarts.push({ section, x });
    }
    const T = book.thickness;
    const W = book.width;
    const H = book.height;
    const t = makeBookTextures(book, renderer);
    const cloth = (map) =>
      new THREE.MeshStandardMaterial({ map, bumpMap: t.bump, bumpScale: 1.2, roughness: 0.92, metalness: 0 });
    const edge = new THREE.MeshStandardMaterial({ color: book.cloth, roughness: 0.9 });
    const endp = new THREE.MeshStandardMaterial({ map: t.endpaper, roughness: 0.95 });
    const frontMat = cloth(t.front);
    const backMat = cloth(t.back);
    const spineMat = cloth(t.spine);
    const pageFace = new THREE.MeshStandardMaterial({ map: paper.face, roughness: 1 });
    const fore = new THREE.MeshStandardMaterial({ map: paper.fore, roughness: 1 });
    const top = new THREE.MeshStandardMaterial({ map: paper.top, roughness: 1 });

    const group = new THREE.Group();
    const parts = [];
    const add = (mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parts.push(mesh);
      return mesh;
    };

    const back = add(new THREE.Mesh(new THREE.BoxGeometry(W, H, COVER), [edge, edge, edge, edge, endp, backMat]));
    back.position.z = -T / 2 + COVER / 2;
    const spine = add(new THREE.Mesh(new THREE.BoxGeometry(COVER, H, T), [edge, spineMat, edge, edge, edge, edge]));
    spine.position.x = -W / 2 - COVER / 2;
    const pw = W - 0.04;
    const ph = H - 0.06;
    const pages = add(new THREE.Mesh(new THREE.BoxGeometry(pw, ph, T - COVER * 2), [fore, pageFace, top, top, pageFace, pageFace]));
    pages.position.x = -W / 2 + pw / 2 + 0.005;
    const hinge = new THREE.Group();
    hinge.position.set(-W / 2, 0, T / 2 - COVER / 2);
    const cover = add(new THREE.Mesh(new THREE.BoxGeometry(W, H, COVER), [edge, edge, edge, edge, frontMat, endp]));
    cover.position.x = W / 2;
    hinge.add(cover);
    group.add(back, spine, pages, hinge);

    if (book.ribbon) {
      const ribbon = add(
        new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.3, 0.075), new THREE.MeshStandardMaterial({ color: '#9b1d20', roughness: 0.6 })),
      );
      // a bookmark ribbon peeking out of the top, so books in progress read at a glance
      ribbon.position.set(-W / 2 + 0.12, H / 2 + 0.1, T * 0.1);
      ribbon.rotation.x = 0.12;
      group.add(ribbon);
    }

    x += T / 2;
    const home = { x, y: H / 2, z: SPINE_Z - W / 2, ry: Math.PI / 2 };
    group.position.set(home.x, home.y, home.z);
    group.rotation.y = home.ry;
    x += T / 2 + GAP;
    scene.add(group);

    const state = { book, group, hinge, home, lift: 0, W, H, T };
    for (const p of parts) p.userData.state = state;
    states.push(state);
  }
  const shelfEnd = x - GAP;
  const pickables = states.flatMap((s) => s.group.children.flatMap((c) => (c.isMesh ? [c] : c.children)));

  /* Section labels, placed in HTML under each run of books */
  const labels = sectionStarts.map(({ section, x }) => {
    const el = document.createElement('div');
    el.className = 'shelf-label';
    el.textContent = SECTIONS[section];
    $('#labels').append(el);
    return { el, x };
  });

  /* Camera and scrolling */
  let camX = 0;
  let targetX = 0;
  let bounds = [0, 0];
  let camZ = CAM.z;
  const halfWidthAt = (z) => (camZ - z) * Math.tan(THREE.MathUtils.degToRad(CAM.fov / 2)) * camera.aspect;

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Far enough back to see the shelf whole in height, and a handful of spines on a phone.
    const tan = Math.tan(THREE.MathUtils.degToRad(CAM.fov / 2));
    camZ = SPINE_Z + Math.max(8.4, 3.3 / (2 * tan * camera.aspect));
    const half = halfWidthAt(SPINE_Z);
    const pad = Math.min(0.7, half * 0.3);
    if (shelfEnd + 2 * pad < half * 2) bounds = [shelfEnd / 2, shelfEnd / 2];
    else bounds = [half - pad, shelfEnd - half + pad];
    targetX = THREE.MathUtils.clamp(targetX, ...bounds);
    if (current) reader.relayout(...readerRect(current));
  }

  const unitsPerPixel = () => (2 * halfWidthAt(SPINE_Z)) / stage.clientWidth;

  /* Tweens */
  const tweens = [];
  const tween = (ms, fn) =>
    new Promise((resolve) => tweens.push({ start: performance.now(), ms: ms * SPEED, fn, resolve }));

  function pose(group, from, to, k) {
    group.position.set(lerp(from.x, to.x, k), lerp(from.y, to.y, k), lerp(from.z, to.z, k));
    group.rotation.y = lerp(from.ry, to.ry, k);
    group.rotation.x = lerp(from.rx ?? 0, to.rx ?? 0, k);
  }

  const single = () => stage.clientWidth < 760 || stage.clientWidth / stage.clientHeight < 1.05;

  function openPose(s) {
    const tan = Math.tan(THREE.MathUtils.degToRad(CAM.fov / 2));
    const spreadW = single() ? s.W : s.W * 2;
    const fh = single() ? 0.74 : 0.78;
    const fw = single() ? 0.9 : 0.9;
    const d = Math.max(s.H / (fh * 2 * tan), spreadW / (fw * 2 * tan * camera.aspect));
    return { x: camX + (single() ? 0 : s.W / 2), y: CAM.y + 0.04 * d * tan, z: camZ - d, ry: 0 };
  }

  const v = new THREE.Vector3();
  function readerRect(s) {
    const { W, H, T } = s;
    const isSingle = single();
    const x0 = isSingle ? -W / 2 : -1.5 * W;
    const pts = [
      [x0, -H / 2], [W / 2, -H / 2], [x0, H / 2], [W / 2, H / 2],
    ].map(([px, py]) => {
      v.set(px, py, T / 2).applyMatrix4(s.group.matrixWorld).project(camera);
      return [((v.x + 1) / 2) * stage.clientWidth, ((1 - v.y) / 2) * stage.clientHeight];
    });
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    // inset a hair so the cloth shows around the paper
    const insetX = (Math.max(...xs) - left) * (isSingle ? 0.015 : 0.008);
    const insetY = (Math.max(...ys) - top) * 0.012;
    return [
      { left: left + insetX, top: top + insetY, width: Math.max(...xs) - left - insetX * 2, height: Math.max(...ys) - top - insetY * 2 },
      isSingle,
    ];
  }

  /* Opening and closing */
  let current = null;
  let busy = false;
  let hovered = null;

  async function open(s) {
    if (busy || current) return;
    busy = true;
    current = s;
    setHover(null);
    document.body.classList.add('reading');
    history.replaceState(null, '', `#${s.book.id}`);
    const pulled = { x: s.home.x, y: s.home.y + 0.3, z: s.home.z + 0.9, ry: s.home.ry };
    const target = openPose(s);
    backdrop.position.z = THREE.MathUtils.clamp(target.z - 0.6, SPINE_Z + 0.15, 1.6);
    backdrop.position.x = camX;
    backdrop.visible = true;
    const start = { x: s.group.position.x, y: s.group.position.y, z: s.group.position.z, ry: s.group.rotation.y };
    await tween(380, (k) => pose(s.group, start, pulled, k));
    await tween(760, (k) => {
      pose(s.group, pulled, { ...target, rx: 0 }, k);
      s.group.rotation.x = Math.sin(k * Math.PI) * -0.12;
      backdrop.material.opacity = 0.9 * k;
    });
    await tween(700, (k) => {
      s.hinge.rotation.y = -Math.PI * k;
    });
    s.group.updateMatrixWorld(true);
    reader.open(s.book, ...readerRect(s));
    busy = false;
  }

  async function close() {
    if (busy || !current) return;
    busy = true;
    const s = current;
    reader.close();
    document.body.classList.remove('reading');
    history.replaceState(null, '', location.pathname + location.search);
    await tween(520, (k) => {
      s.hinge.rotation.y = -Math.PI * (1 - k);
    });
    const from = { x: s.group.position.x, y: s.group.position.y, z: s.group.position.z, ry: s.group.rotation.y };
    const pulled = { x: s.home.x, y: s.home.y + 0.3, z: s.home.z + 0.9, ry: s.home.ry };
    await tween(700, (k) => {
      pose(s.group, from, pulled, k);
      backdrop.material.opacity = 0.9 * (1 - k);
    });
    backdrop.visible = false;
    await tween(360, (k) => pose(s.group, pulled, s.home, k));
    s.lift = 0;
    current = null;
    busy = false;
  }

  closeBook = close;
  openBook = (id) => {
    const s = states.find((st) => st.book.id === id);
    if (!s) return;
    targetX = THREE.MathUtils.clamp(s.home.x, ...bounds);
    camX = targetX;
    open(s);
  };

  /* Pointer: drag to scroll, hover to lift, click to open */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pickables, false)[0];
    return hit?.object.userData.state ?? null;
  }

  function setHover(s) {
    if (hovered === s) return;
    hovered = s;
    stage.style.cursor = s ? 'pointer' : drag ? 'grabbing' : 'grab';
    if (s) {
      caption.innerHTML = `<strong>${s.book.title}</strong>${s.book.subtitle ? `<span>${s.book.subtitle}</span>` : ''}`;
      caption.classList.add('shown');
    } else caption.classList.remove('shown');
  }

  let drag = null;
  stage.addEventListener('pointerdown', (e) => {
    if (current || busy) return;
    drag = { x: e.clientX, startTarget: targetX, moved: false, id: e.pointerId, type: e.pointerType };
  });
  addEventListener('pointermove', (e) => {
    if (current || busy) return;
    if (drag && drag.id === e.pointerId) {
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 6) {
        drag.moved = true;
        stage.setPointerCapture?.(e.pointerId);
        setHover(null);
        stage.style.cursor = 'grabbing';
      }
      if (drag.moved) targetX = THREE.MathUtils.clamp(drag.startTarget - dx * unitsPerPixel(), ...bounds);
    } else if (e.pointerType === 'mouse' && e.target === renderer.domElement) {
      setHover(pick(e));
    }
  });
  addEventListener('pointerup', (e) => {
    if (!drag || drag.id !== e.pointerId) return;
    const wasDrag = drag.moved;
    drag = null;
    stage.style.cursor = hovered ? 'pointer' : 'grab';
    if (wasDrag || current || busy) return;
    const s = pick(e);
    if (s) open(s);
  });
  addEventListener('pointercancel', () => (drag = null));
  stage.addEventListener(
    'wheel',
    (e) => {
      if (current) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      targetX = THREE.MathUtils.clamp(targetX + delta * unitsPerPixel() * 0.9, ...bounds);
    },
    { passive: false },
  );
  stage.addEventListener('pointerleave', () => setHover(null));

  addEventListener('keydown', (e) => {
    if (reader.isOpen) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') reader.next();
      else if (e.key === 'ArrowLeft') reader.prev();
      return;
    }
    if (current) return;
    const step = halfWidthAt(SPINE_Z) * 0.6;
    if (e.key === 'ArrowRight') targetX = THREE.MathUtils.clamp(targetX + step, ...bounds);
    if (e.key === 'ArrowLeft') targetX = THREE.MathUtils.clamp(targetX - step, ...bounds);
  });

  $('#scroll-left').addEventListener('click', () => (targetX = THREE.MathUtils.clamp(targetX - halfWidthAt(SPINE_Z), ...bounds)));
  $('#scroll-right').addEventListener('click', () => (targetX = THREE.MathUtils.clamp(targetX + halfWidthAt(SPINE_Z), ...bounds)));

  /* Loop */
  const proj = new THREE.Vector3();
  function tick(now) {
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i];
      const k = Math.min(1, (now - tw.start) / tw.ms);
      tw.fn(ease(k));
      if (k >= 1) {
        tweens.splice(i, 1);
        tw.resolve();
      }
    }
    if (!current) camX += (targetX - camX) * 0.12;
    camera.position.set(camX, CAM.y, camZ);
    camera.lookAt(camX, CAM.y, 0);
    sun.position.set(camX - 3, 7, 7);
    sun.target.position.set(camX, 0, 0);

    for (const s of states) {
      if (s === current) continue;
      const goal = s === hovered ? 1 : 0;
      s.lift += (goal - s.lift) * 0.18;
      s.group.position.y = s.home.y + s.lift * 0.14;
      s.group.position.z = s.home.z + s.lift * 0.12;
    }

    const w = stage.clientWidth;
    const h = stage.clientHeight;
    for (const label of labels) {
      proj.set(label.x, 0, SPINE_Z).project(camera);
      const lx = ((proj.x + 1) / 2) * w;
      const ly = ((1 - proj.y) / 2) * h;
      label.el.style.transform = `translate(${lx.toFixed(1)}px, ${(ly + 14).toFixed(1)}px)`;
      label.el.style.opacity = current ? 0 : 1;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  new ResizeObserver(resize).observe(stage);
  resize();
  targetX = camX = bounds[0];
  requestAnimationFrame(tick);
  document.body.classList.add('ready');

  const fromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && byId.has(id) && !current) openBook(id);
  };
  addEventListener('hashchange', fromHash);
  setTimeout(fromHash, 400);
}

let closeBook = () => {};
main();
