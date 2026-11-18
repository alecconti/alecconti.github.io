// The pages of an open book: laid out to fit, and turned one leaf at a time.
import { esc } from './books.js';

const FLIP_MS = 720;

export class Reader {
  constructor(root, { onClose }) {
    this.root = root;
    this.onClose = onClose;
    this.spread = root.querySelector('.spread');
    this.left = root.querySelector('.page.left');
    this.right = root.querySelector('.page.right');
    this.leaf = root.querySelector('.leaf');
    this.leafFront = this.leaf.querySelector('.front');
    this.leafBack = this.leaf.querySelector('.back');
    this.counter = root.querySelector('.counter');
    this.measure = root.querySelector('.measure');
    this.pages = [];
    this.at = 0;
    this.busy = false;
    this.single = false;

    root.querySelector('.next').addEventListener('click', () => this.next());
    root.querySelector('.prev').addEventListener('click', () => this.prev());
    root.querySelector('.close').addEventListener('click', () => this.onClose());
    this.right.addEventListener('click', (e) => !e.target.closest('a') && this.next());
    this.left.addEventListener('click', (e) => !e.target.closest('a') && this.prev());
    let sx = null;
    this.spread.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    this.spread.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 40) dx < 0 ? this.next() : this.prev();
    });
  }

  get isOpen() {
    return !this.root.hidden;
  }

  /** rect is where the open book sits on screen: both pages, or one page on a phone. */
  open(book, rect, single) {
    this.book = book;
    this.single = single;
    this.root.hidden = false;
    this.place(rect);
    this.pages = this.paginate(book);
    this.at = single ? 1 : 0;
    this.render();
    requestAnimationFrame(() => this.root.classList.add('shown'));
    this.root.querySelector('.next').focus({ preventScroll: true });
  }

  /** Lays the pages out again after a resize, keeping roughly the same place. */
  relayout(rect, single) {
    if (!this.isOpen) return;
    const ratio = this.at / Math.max(1, this.pages.length);
    this.single = single;
    this.place(rect);
    this.pages = this.paginate(this.book);
    let at = Math.round(ratio * this.pages.length);
    if (!single) at -= at % 2;
    this.at = Math.max(0, Math.min(at, this.pages.length - 1));
    this.render();
  }

  close() {
    this.root.classList.remove('shown');
    this.root.hidden = true;
  }

  place(rect) {
    const pageW = this.single ? rect.width : rect.width / 2;
    Object.assign(this.spread.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
    this.root.style.setProperty('--pw', `${pageW}px`);
    this.root.style.setProperty('--ph', `${rect.height}px`);
    this.root.classList.toggle('single', this.single);
    this.measure.style.width = `${pageW}px`;
    this.measure.style.height = `${rect.height}px`;
  }

  paginate(book) {
    const pages = [];
    pages.push({ cls: 'spec', html: specPage(book) });
    pages.push({ cls: 'title', html: titlePage(book) });

    const body = this.measure.querySelector('.body');
    let current = [];
    const flush = () => {
      if (current.length) pages.push({ cls: 'text', html: current.join('') });
      current = [];
      body.innerHTML = '';
    };
    body.innerHTML = '';
    for (const block of book.blocks()) {
      if (block.breakBefore && current.length) flush();
      body.insertAdjacentHTML('beforeend', block.html);
      if (body.scrollHeight > body.clientHeight + 1 && current.length) {
        body.lastElementChild?.remove();
        flush();
        body.insertAdjacentHTML('beforeend', block.html);
      }
      current.push(block.html);
    }
    flush();
    pages.push({ cls: 'end', html: `<div class="fin"><span>❧</span><p>Fin.</p><p class="meta">Close the book to put it back on the shelf.</p></div>` });
    if (pages.length % 2) pages.push({ cls: 'blank', html: '' });
    return pages;
  }

  pageHtml(index) {
    const page = this.pages[index];
    if (!page) return '';
    const folio = index >= 2 && page.cls === 'text' ? `<span class="folio">${index - 1}</span>` : '';
    return `<div class="body ${page.cls}">${page.html}</div>${folio}`;
  }

  render() {
    if (this.single) {
      this.right.innerHTML = this.pageHtml(this.at);
      this.left.innerHTML = '';
    } else {
      this.left.innerHTML = this.pageHtml(this.at);
      this.right.innerHTML = this.pageHtml(this.at + 1);
    }
    const step = this.single ? 1 : 2;
    const last = this.single ? this.pages.length - 1 : this.pages.length - 2;
    this.root.querySelector('.prev').disabled = this.at <= 0;
    this.root.querySelector('.next').disabled = this.at >= last;
    const shown = this.single ? `${this.at + 1}` : `${this.at + 1}–${this.at + 2}`;
    this.counter.textContent = `${shown} of ${this.pages.length}`;
    this.step = step;
  }

  async flip(dir) {
    if (this.busy) return;
    const step = this.single ? 1 : 2;
    const last = this.single ? this.pages.length - 1 : this.pages.length - 2;
    const to = this.at + dir * step;
    if (to < 0 || to > last) return;
    this.busy = true;
    const leaf = this.leaf;
    leaf.className = 'leaf';
    if (this.single) {
      if (dir > 0) {
        this.leafFront.innerHTML = this.pageHtml(this.at);
        this.leafBack.innerHTML = '';
        this.right.innerHTML = this.pageHtml(to);
        leaf.classList.add('on-right', 'turn-forward');
      } else {
        this.leafFront.innerHTML = this.pageHtml(to);
        this.leafBack.innerHTML = '';
        leaf.classList.add('on-right', 'turn-back-single');
      }
    } else if (dir > 0) {
      this.leafFront.innerHTML = this.pageHtml(this.at + 1);
      this.leafBack.innerHTML = this.pageHtml(this.at + 2);
      this.right.innerHTML = this.pageHtml(this.at + 3);
      leaf.classList.add('on-right', 'turn-forward');
    } else {
      this.leafFront.innerHTML = this.pageHtml(this.at);
      this.leafBack.innerHTML = this.pageHtml(this.at - 1);
      this.left.innerHTML = this.pageHtml(this.at - 2);
      leaf.classList.add('on-left', 'turn-backward');
    }
    leaf.hidden = false;
    // force the start pose before animating
    void leaf.offsetWidth;
    leaf.classList.add('go');
    await new Promise((r) => setTimeout(r, FLIP_MS));
    this.at = to;
    this.render();
    leaf.hidden = true;
    leaf.className = 'leaf';
    this.busy = false;
  }

  next() {
    return this.flip(1);
  }

  prev() {
    return this.flip(-1);
  }
}

function specPage(book) {
  const rows = Object.entries(book.spec ?? {})
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join('');
  return `
    <p class="kicker">Specifications</p>
    <dl class="spec-list">${rows}</dl>
    <p class="imprint">${book.live ? 'Printed live from Lexicon each time the book is opened.' : 'From the shelf of J. Alec Conti.'}</p>`;
}

function titlePage(book) {
  return `
    <div class="title-block">
      <h1>${esc(book.title)}</h1>
      ${book.subtitle ? `<p class="subtitle">${esc(book.subtitle)}</p>` : ''}
      <p class="by">${esc(book.byline ? `${book.byline}` : 'J. Alec Conti')}</p>
    </div>
    <p class="press">${book.byline ? 'Notes by J. Alec Conti' : 'alecconti.github.io'}</p>`;
}
