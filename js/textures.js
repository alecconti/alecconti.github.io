// Cloth, foil and paper drawn on canvases, so every cover is made here and
// nothing is a stock photo.
import * as THREE from './vendor/three.module.min.js';

const PX = 300; // canvas pixels per world unit

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(4, Math.round(w));
  c.height = Math.max(4, Math.round(h));
  return c;
}

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function shade(hex, f) {
  const [r, g, b] = rgb(hex);
  const m = (v) => Math.max(0, Math.min(255, Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f))));
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}

let seed = 1;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

/** Woven cloth: a fine warp and weft, uneven fibres, and darker worn edges. */
function paintCloth(ctx, w, h, hex, bump) {
  const [r, g, b] = bump ? [128, 128, 128] : rgb(hex);
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    const weft = (y % 3 === 0 ? -1 : y % 3 === 1 ? 0.6 : 0.2) * (bump ? 40 : 7);
    for (let x = 0; x < w; x++) {
      const warp = (x % 3 === 0 ? -1 : x % 3 === 1 ? 0.5 : 0.3) * (bump ? 40 : 7);
      const over = ((x / 3) | 0) + ((y / 3) | 0);
      const twill = over % 2 ? weft : warp;
      const fibre = (rand() - 0.5) * (bump ? 50 : 16);
      const v = twill + fibre;
      const i = (y * w + x) * 4;
      d[i] = r + v;
      d[i + 1] = g + v;
      d[i + 2] = b + v;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  if (bump) return;
  // slubs: longer, slightly lighter threads
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < (w * h) / 900; i++) {
    ctx.fillStyle = rand() > 0.5 ? '#fff' : '#000';
    ctx.fillRect(rand() * w, rand() * h, 6 + rand() * 30, 1);
  }
  ctx.globalAlpha = 1;
  // worn edges and soft vignette
  const edge = ctx.createLinearGradient(0, 0, w, 0);
  edge.addColorStop(0, 'rgba(0,0,0,0.22)');
  edge.addColorStop(0.06, 'rgba(0,0,0,0)');
  edge.addColorStop(0.94, 'rgba(0,0,0,0)');
  edge.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, w, h);
  const top = ctx.createLinearGradient(0, 0, 0, h);
  top.addColorStop(0, 'rgba(0,0,0,0.18)');
  top.addColorStop(0.04, 'rgba(0,0,0,0)');
  top.addColorStop(0.96, 'rgba(0,0,0,0)');
  top.addColorStop(1, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, w, h);
}

/** Foil that has been pressed into cloth: a metallic gradient with a few gaps. */
function foilStyle(ctx, hex, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, shade(hex, -0.18));
  g.addColorStop(0.35, shade(hex, 0.25));
  g.addColorStop(0.5, shade(hex, -0.05));
  g.addColorStop(0.75, shade(hex, 0.18));
  g.addColorStop(1, shade(hex, -0.2));
  return g;
}

function pressFoil(ctx, w, h) {
  // knock out specks so the foil reads as pressed, not printed
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < (w * h) / 1500; i++) {
    ctx.globalAlpha = rand() * 0.5;
    ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1 + rand() * 2);
  }
  ctx.restore();
}

function fitFont(ctx, text, weight, family, size, maxWidth) {
  let s = size;
  do {
    ctx.font = `${weight} ${s}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    s -= 2;
  } while (s > 10);
  return s;
}

function wrap(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

const SERIF = '"Newsreader", "Iowan Old Style", Georgia, serif';
const MONO = '"IBM Plex Mono", ui-monospace, Menlo, monospace';

function tex(c, renderer) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}

function foilLayer(w, h, draw, hex) {
  const c = canvas(w, h);
  const ctx = c.getContext('2d');
  ctx.fillStyle = foilStyle(ctx, hex, 0, 0, w, h);
  ctx.strokeStyle = ctx.fillStyle;
  draw(ctx);
  pressFoil(ctx, w, h);
  return c;
}

export function makeBookTextures(book, renderer) {
  seed = 1 + (book.id.length * 7919 + book.title.length * 104729) % 2147483646;
  const W = Math.round(book.width * PX);
  const H = Math.round(book.height * PX);
  const T = Math.max(48, Math.round(book.thickness * PX));

  // Plain cloth (back cover, cover edges)
  const plain = canvas(W, H);
  paintCloth(plain.getContext('2d'), W, H, book.cloth);

  const bump = canvas(256, 256);
  paintCloth(bump.getContext('2d'), 256, 256, '#808080', true);

  // Front cover
  const front = canvas(W, H);
  const fctx = front.getContext('2d');
  fctx.drawImage(plain, 0, 0);
  const foilFront = foilLayer(W, H, (ctx) => {
    ctx.lineWidth = 3;
    ctx.strokeRect(W * 0.08, H * 0.05, W * 0.84, H * 0.9);
    ctx.lineWidth = 1;
    ctx.strokeRect(W * 0.095, H * 0.058, W * 0.81, H * 0.884);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const title = book.title;
    let size = fitFont(ctx, title, 500, SERIF, Math.round(W * 0.13), W * 0.72);
    ctx.font = `500 ${size}px ${SERIF}`;
    const lines = size < W * 0.09 ? wrap(ctx, title, W * 0.7).slice(0, 3) : [title];
    if (lines.length > 1) {
      size = Math.round(W * 0.1);
      ctx.font = `500 ${size}px ${SERIF}`;
    }
    lines.forEach((line, i) => ctx.fillText(line, W / 2, H * 0.3 + i * size * 1.1));
    ctx.beginPath();
    ctx.moveTo(W * 0.42, H * 0.3 + lines.length * size * 1.1);
    ctx.lineTo(W * 0.58, H * 0.3 + lines.length * size * 1.1);
    ctx.lineWidth = 2;
    ctx.stroke();
    if (book.subtitle) {
      ctx.font = `italic 400 ${Math.round(W * 0.055)}px ${SERIF}`;
      ctx.fillText(book.subtitle, W / 2, H * 0.3 + lines.length * size * 1.1 + W * 0.12);
    }
    ctx.font = `500 ${Math.round(W * 0.034)}px ${MONO}`;
    ctx.fillText((book.byline || 'J. ALEC CONTI').toUpperCase(), W / 2, H * 0.88);
    // a small mark
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.74, W * 0.04, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.74, W * 0.012, 0, Math.PI * 2);
    ctx.fill();
  }, book.foil);
  fctx.drawImage(foilFront, 0, 0);

  // Spine: text runs top to bottom, as on English books
  const spine = canvas(T, H);
  const sctx = spine.getContext('2d');
  paintCloth(sctx, T, H, shade(book.cloth, -0.06).replace(/rgb\((\d+),(\d+),(\d+)\)/, (_, r, g, b) => '#' + [r, g, b].map((v) => (+v).toString(16).padStart(2, '0')).join('')));
  const foilSpine = foilLayer(T, H, (ctx) => {
    ctx.fillRect(T * 0.12, H * 0.06, T * 0.76, 2);
    ctx.fillRect(T * 0.12, H * 0.065, T * 0.76, 1);
    ctx.fillRect(T * 0.12, H * 0.935, T * 0.76, 1);
    ctx.fillRect(T * 0.12, H * 0.94, T * 0.76, 2);
    ctx.save();
    ctx.translate(T / 2, H * 0.11);
    ctx.rotate(Math.PI / 2);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    const title = (book.spineTitle || book.title).toUpperCase();
    const size = fitFont(ctx, title, 500, SERIF, Math.min(Math.round(T * 0.36), 64), H * 0.58);
    ctx.font = `500 ${size}px ${SERIF}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${Math.round(size * 0.08)}px`;
    ctx.fillText(title, 0, 0);
    if (book.subtitle && T > 110) {
      ctx.font = `italic 400 ${Math.round(size * 0.5)}px ${SERIF}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      ctx.globalAlpha = 0.85;
      ctx.fillText(book.subtitle, 0, size * 0.85);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    ctx.save();
    ctx.translate(T / 2, H * 0.9);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = `500 ${Math.round(Math.min(T * 0.2, 26))}px ${MONO}`;
    ctx.fillText(book.live ? 'LEXICON' : 'A.C.', 0, 0);
    ctx.restore();
  }, book.foil);
  sctx.drawImage(foilSpine, 0, 0);
  // rounded spine shading
  const round = sctx.createLinearGradient(0, 0, T, 0);
  round.addColorStop(0, 'rgba(0,0,0,0.35)');
  round.addColorStop(0.25, 'rgba(255,255,255,0.05)');
  round.addColorStop(0.5, 'rgba(255,255,255,0.08)');
  round.addColorStop(1, 'rgba(0,0,0,0.35)');
  sctx.fillStyle = round;
  sctx.fillRect(0, 0, T, H);

  // Endpaper (inside of the covers)
  const endp = canvas(W / 2, H / 2);
  const ectx = endp.getContext('2d');
  ectx.fillStyle = shade(book.cloth, 0.78);
  ectx.fillRect(0, 0, endp.width, endp.height);
  ectx.strokeStyle = shade(book.cloth, 0.55);
  ectx.lineWidth = 1;
  for (let i = -endp.height; i < endp.width; i += 9) {
    ectx.beginPath();
    ectx.moveTo(i, 0);
    ectx.lineTo(i + endp.height, endp.height);
    ectx.stroke();
  }

  return {
    front: tex(front, renderer),
    back: tex(plain, renderer),
    spine: tex(spine, renderer),
    endpaper: tex(endp, renderer),
    bump: (() => {
      const t = new THREE.CanvasTexture(bump);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(book.width * 2.5, book.height * 2.5);
      return t;
    })(),
  };
}

let paperCache = null;
/** Page edges: cream paper with the fine lines of stacked leaves. */
export function pageEdgeTextures(renderer) {
  if (paperCache) return paperCache;
  const make = (vertical) => {
    const c = canvas(256, 256);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#efe7d6';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 2) {
      ctx.fillStyle = `rgba(90,70,40,${0.05 + rand() * 0.08})`;
      if (vertical) ctx.fillRect(i, 0, 1, 256);
      else ctx.fillRect(0, i, 256, 1);
    }
    return tex(c, renderer);
  };
  const face = canvas(64, 64);
  const fctx = face.getContext('2d');
  fctx.fillStyle = '#f4eee1';
  fctx.fillRect(0, 0, 64, 64);
  paperCache = { fore: make(true), top: make(false), face: tex(face, renderer) };
  return paperCache;
}

export function labelTexture(text, renderer, color = '#6f6658') {
  const c = canvas(1024, 96);
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.font = `500 34px ${MONO}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '6px';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), 8, 48);
  const width = Math.min(1024, ctx.measureText(text.toUpperCase()).width + 24);
  return { texture: tex(c, renderer), aspect: 1024 / 96, used: width / 1024 };
}
