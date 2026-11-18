// Every book on the shelf. The work books are written here by hand. The
// notebooks and the reading shelf are built from Lexicon's public feed, so
// they change as new ideas, quotes, words and books are saved there.

export const LEXICON_FEED = 'https://lexicon-dusky-kappa.vercel.app/api/public/shelf';
export const LEXICON_APP = 'https://lexicon-dusky-kappa.vercel.app';

export const SECTIONS = {
  about: 'Colophon',
  work: 'Work',
  notebooks: 'Notebooks · live from Lexicon',
  reading: 'Reading now',
  read: 'Finished',
};

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

const b = (html, opts = {}) => ({ html, ...opts });
const chapter = (title, meta) =>
  b(`<h2>${esc(title)}</h2>${meta ? `<p class="meta">${esc(meta)}</p>` : ''}`, { breakBefore: true });
const list = (items) => items.map((item) => b(`<p class="item">${item}</p>`));
const tags = (items) => b(`<p class="tags">${items.map((t) => `<span>${esc(t)}</span>`).join('')}</p>`);

function fmtDate(ms) {
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ---------- Written by hand ---------- */

const about = {
  id: 'about',
  section: 'about',
  title: 'J. Alec Conti',
  subtitle: 'A reader’s catalogue',
  cloth: '#26272b',
  foil: '#d9b871',
  height: 2.45,
  width: 1.62,
  thickness: 0.42,
  spec: {
    Binding: 'Charcoal cloth, gold foil',
    Format: '6 × 9 in, sewn',
    Theme: 'Who keeps this shelf',
    Contents: 'Bio, education, skills, contact',
  },
  blocks: () => [
    b(`<h2>Hello.</h2><p class="lede">I’m Alec Conti. I work with data, machine learning and finance, and I keep a running library of what I learn.</p>`),
    b(`<p>This shelf is that library. The books on the left are my work: internships and projects. The notebooks and the reading shelf are pulled live from <a href="${LEXICON_APP}" target="_blank" rel="noopener">Lexicon</a>, the app I built to learn things properly, so they show what I’m actually reading, quoting and studying this week.</p>`),
    chapter('Pennsylvania State University'),
    b(`<p class="meta">B.S. Computer Science · Minor in Mathematics · University Park, PA</p>`),
    b(`<h3>Coursework</h3>`),
    ...list(['Mathematics of Finance', 'Mathematics of Machine Learning', 'Statistical Inference', 'Data Structures &amp; Algorithms', 'Probability Theory', 'Game Theory']),
    chapter('Skills'),
    b(`<h3>Languages</h3>`), tags(['Python', 'Java', 'SQL', 'C']),
    b(`<h3>Libraries</h3>`), tags(['Pandas', 'NumPy', 'scikit-learn', 'Matplotlib']),
    b(`<h3>Frameworks &amp; tools</h3>`), tags(['Databricks', 'TensorFlow', 'Power BI', 'Streamlit']),
    b(`<h3>Data engineering &amp; cloud</h3>`), tags(['Apache Spark', 'Azure', 'Docker']),
    chapter('Get in touch'),
    b(`<p class="item"><a href="mailto:johnalecconti@gmail.com">johnalecconti@gmail.com</a></p>`),
    b(`<p class="item"><a href="https://linkedin.com/in/alecconti" target="_blank" rel="noopener">linkedin.com/in/alecconti</a></p>`),
    b(`<p class="item"><a href="https://github.com/alecconti" target="_blank" rel="noopener">github.com/alecconti</a></p>`),
  ],
};

function internship({ id, company, role, years, period, location, blurb, did, tools, cloth, foil, theme, thickness }) {
  return {
    id,
    section: 'work',
    title: company,
    subtitle: `${role}, ${years}`,
    cloth,
    foil,
    height: 2.3,
    width: 1.55,
    thickness,
    spec: { Binding: theme.binding, Format: '6 × 9 in, sewn', Theme: theme.theme, Period: period, Location: location },
    blocks: () => [
      b(`<h2>${esc(role)}</h2><p class="meta">${esc(period)} · ${esc(location)}</p><p class="lede">${esc(blurb)}</p>`),
      chapter('What I did'),
      ...list(did),
      chapter('Tools'),
      tags(tools),
    ],
  };
}

const avanade = internship({
  id: 'avanade',
  company: 'Avanade',
  role: 'Data Analytics Intern',
  years: '2024',
  period: 'May – Aug 2024',
  location: 'Philadelphia',
  blurb: 'A digital innovator specializing in technology solutions and consulting on Microsoft platforms and enterprise applications.',
  did: [
    'Built a service request classification system with prompt engineering on Azure OpenAI’s GPT models, using tokenization and fine-tuning to speed categorization. <strong>Processing time fell 15%</strong> and accuracy rose 10%.',
    'Designed a natural language support assistant with Python, retrieval-augmented generation and GPT-3. <strong>Response accuracy rose 70%</strong> and average handling time fell 25%.',
    'Worked with client executives and cross-functional teams through daily stand-ups and sprint planning, adjusting quickly to changing requirements, with 100% client satisfaction.',
  ],
  tools: ['Python', 'Azure OpenAI', 'GPT', 'RAG', 'Agile'],
  cloth: '#b4532a',
  foil: '#f1e3c6',
  theme: { binding: 'Burnt orange cloth, cream foil', theme: 'Language models in production' },
  thickness: 0.4,
});

const federated = internship({
  id: 'federated',
  company: 'Federated Hermes',
  role: 'Data Engineering Intern',
  years: '2023',
  period: 'May – Aug 2023',
  location: 'Pittsburgh',
  blurb: 'A global leader in active, responsible investment across equity, fixed income, multi-asset and liquidity management.',
  did: [
    'Led a multidisciplinary team to <strong>first place in the Intern Hackathon</strong> with a real-time sentiment analysis platform (90% accuracy) built on pre-trained Transformers and NewsAPI, and presented it to the CTO.',
    'Designed and optimized data pipelines in Python (Pandas, PySpark), SQL and Azure Databricks, making processing 20% faster and more accurate for five departments.',
    'Built and maintained data lakes and warehouses with Apache Spark, improving reporting efficiency by 30%.',
    'Shipped on time inside an Agile team, with short iterations and quick turns on feedback.',
  ],
  tools: ['Python', 'Pandas', 'PySpark', 'SQL', 'Azure Databricks', 'Apache Spark', 'Transformers', 'NewsAPI'],
  cloth: '#1d2d4f',
  foil: '#c9ced8',
  theme: { binding: 'Navy cloth, silver foil', theme: 'Pipelines and markets' },
  thickness: 0.46,
});

// The PNC book is still being written. Replace `blocks` with the real chapters.
const pnc = {
  id: 'pnc',
  section: 'work',
  title: 'PNC',
  subtitle: 'Forthcoming',
  cloth: '#3e5a66',
  foil: '#e39a5c',
  height: 2.3,
  width: 1.55,
  thickness: 0.36,
  spec: { Binding: 'Slate cloth, copper foil', Format: '6 × 9 in, sewn', Theme: 'Banking, data and retention', Status: 'In preparation' },
  blocks: () => [
    b(`<h2>This volume is still at the printer.</h2><p class="lede">Notes from my time at PNC are being written up and will be bound here soon.</p>`),
  ],
};

const projects = {
  id: 'projects',
  section: 'work',
  title: 'Projects',
  subtitle: 'Things I built',
  cloth: '#2f4a3a',
  foil: '#d9b871',
  height: 2.5,
  width: 1.65,
  thickness: 0.55,
  spec: { Binding: 'Forest cloth, gold foil', Format: '6.5 × 9.5 in, sewn', Theme: 'Machine learning, markets, tools for thinking' },
  blocks: () => [
    b(`<h2>Projects</h2><p class="lede">Things I built to understand something better.</p>`),
    chapter('Lexicon', '2026'),
    b(`<p>A personal knowledge base for learning by recall. Save an idea, a quote or a word, and review it by explaining it back in a few seconds a day. Ideas connect on a map, and a spoken capture files a book quote in one tap.</p>`),
    b(`<p>It’s the source of the notebooks on this shelf. <a href="${LEXICON_APP}" target="_blank" rel="noopener">Try the demo</a>.</p>`),
    tags(['Next.js', 'TypeScript', 'Turso', 'Gemini', 'Vercel']),
    chapter('Unsupervised stock trading strategy', 'August 2024'),
    b(`<p>A machine learning strategy that clusters S&amp;P 500 stocks with K-Means and builds portfolios for the maximum Sharpe ratio.</p>`),
    ...list([
      'Feature engineering on S&amp;P 500 prices: technical indicators and Fama-French factor exposures.',
      'Efficient Frontier optimization combining factor exposures with the clusters.',
    ]),
    tags(['Python', 'scikit-learn', 'Pandas', 'NumPy', 'PyPortfolioOpt', 'Matplotlib']),
    chapter('Stock sentiment analysis site', 'July 2023'),
    b(`<p>An end-to-end sentiment site built in the Federated Hermes Intern Hackathon, where it took first place.</p>`),
    ...list([
      'Fine-tuned pre-trained language models to 90% sentiment accuracy.',
      'Real-time news through NewsAPI and a Streamlit interface.',
    ]),
    tags(['Python', 'NLP', 'Streamlit', 'NewsAPI']),
    chapter('This bookshelf', '2026'),
    b(`<p>The site you’re reading. A Three.js shelf with cloth covers drawn in code, page turns, and notebooks fed live from Lexicon. It replaced a Windows 95 desktop that had Minesweeper.</p>`),
    tags(['Three.js', 'JavaScript', 'CSS']),
  ],
};

export const STATIC_BOOKS = [about, avanade, federated, pnc, projects];

/* ---------- Built from Lexicon ---------- */

const READ_CLOTHS = [
  ['#7a2e2e', '#e8cf95'], ['#3b3f6b', '#d9b871'], ['#5b6b3a', '#efe3c2'], ['#8c6a2c', '#1f1a12'],
  ['#2c5a63', '#e7c38a'], ['#6b3a5b', '#e8d3b0'], ['#4a4a4a', '#d6a15a'], ['#a0712f', '#2a1d10'],
  ['#2e3f2f', '#cdb27a'], ['#874a2b', '#f0dcbc'],
];

function hash(text) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

const thick = (count, min, max, per) => Math.min(max, min + count * per);

export function liveBooks(feed) {
  const books = [];
  const updated = feed ? `Updated ${fmtDate(feed.updatedAt)}` : 'Waiting on Lexicon';

  const learning = feed?.learning ?? [];
  const byTopic = new Map();
  for (const idea of learning) {
    const topic = idea.topics[0] ?? 'Unfiled';
    if (!byTopic.has(topic)) byTopic.set(topic, []);
    byTopic.get(topic).push(idea);
  }
  books.push({
    id: 'field-notes',
    section: 'notebooks',
    title: 'Field Notes',
    subtitle: 'What I’m learning',
    cloth: '#22379a',
    foil: '#d08a54',
    height: 2.55,
    width: 1.7,
    thickness: thick(learning.length, 0.42, 0.78, 0.012),
    live: true,
    spec: {
      Binding: 'Ultramarine cloth, copper foil',
      Format: '6.5 × 9.5 in, sewn',
      Theme: (feed?.stats.topics ?? []).slice(0, 4).map((t) => t.name).join(', ') || 'Everything',
      Entries: String(learning.length),
      Printed: updated,
    },
    blocks: () => [
      b(`<h2>Field Notes</h2><p class="lede">The newest ideas I’ve saved in Lexicon, in my own words. Each one is reviewed by explaining it back. The dots show how well it has stuck.</p>`),
      ...(learning.length ? [] : [empty(feed)]),
      ...[...byTopic.entries()].flatMap(([topic, ideas]) => [
        chapter(topic),
        ...ideas.map((idea) =>
          b(`<div class="note"><h4>${esc(idea.title)}</h4><p>${esc(idea.note)}</p><p class="note-meta">${dots(idea.box)}${idea.source ? ` · from <em>${esc(idea.source.title)}</em>` : ''} · ${fmtDate(idea.addedAt)}</p></div>`),
        ),
      ]),
    ],
  });

  const quotes = feed?.quotes ?? [];
  books.push({
    id: 'quotes',
    section: 'notebooks',
    title: 'Commonplace',
    subtitle: 'Favorite quotes',
    cloth: '#6e1f2a',
    foil: '#e2c27d',
    height: 2.35,
    width: 1.55,
    thickness: thick(quotes.length, 0.36, 0.7, 0.012),
    live: true,
    spec: { Binding: 'Oxblood cloth, gold foil', Format: '6 × 9 in, sewn', Theme: 'Lines worth keeping', Entries: String(quotes.length), Printed: updated },
    blocks: () => [
      b(`<h2>Commonplace</h2><p class="lede">Lines I wanted to keep, word for word, captured in Lexicon as I read or listened.</p>`),
      ...(quotes.length ? [] : [empty(feed)]),
      ...quotes.map((q) =>
        b(`<figure class="quote"><blockquote>${esc(q.quote)}</blockquote><figcaption>${q.source ? `${esc(q.source.author ?? '')}${q.source.author ? ', ' : ''}<em>${esc(q.source.title)}</em>` : esc(q.title)}</figcaption></figure>`),
      ),
    ],
  });

  const words = feed?.words ?? [];
  books.push({
    id: 'words',
    section: 'notebooks',
    title: 'A Private Lexicon',
    spineTitle: 'Lexicon',
    subtitle: 'Favorite words',
    cloth: '#c08d2a',
    foil: '#1d1a14',
    height: 2.2,
    width: 1.5,
    thickness: thick(words.length, 0.34, 0.66, 0.008),
    live: true,
    spec: { Binding: 'Ochre cloth, black foil', Format: '5.5 × 8.5 in, sewn', Theme: 'Words I looked up and kept', Entries: String(words.length), Printed: updated },
    blocks: () => [
      b(`<h2>A Private Lexicon</h2><p class="lede">Words I looked up, liked, and am trying to use.</p>`),
      ...(words.length ? [] : [empty(feed)]),
      ...words
        .slice()
        .sort((a, z) => a.word.localeCompare(z.word))
        .map((w) =>
          b(`<div class="entry"><p><strong>${esc(w.word)}</strong>${w.partOfSpeech ? ` <em>${esc(w.partOfSpeech)}</em>` : ''}</p><p>${esc(w.meaning)}</p>${w.example ? `<p class="example">“${esc(w.example)}”</p>` : ''}</div>`),
        ),
    ],
  });

  for (const book of feed?.books ?? []) {
    const [cloth, foil] = READ_CLOTHS[hash(book.title) % READ_CLOTHS.length];
    const h = hash(book.title + (book.author ?? ''));
    books.push({
      id: `book-${book.id}`,
      section: book.status === 'reading' ? 'reading' : 'read',
      title: book.title,
      subtitle: book.author ?? '',
      byline: book.author ?? '',
      cloth,
      foil,
      height: 2.05 + (h % 7) * 0.07,
      width: 1.4 + (h % 5) * 0.06,
      thickness: thick(book.notes, 0.26, 0.6, 0.03),
      ribbon: book.status === 'reading',
      live: true,
      spec: {
        Author: book.author ?? 'Unknown',
        Status: book.status === 'reading' ? 'Reading now' : 'Finished',
        Notes: `${book.notes} in Lexicon`,
        'Last note': fmtDate(book.lastAddedAt),
      },
      blocks: () => [
        b(`<h2>${esc(book.title)}</h2>${book.author ? `<p class="lede">${esc(book.author)}</p>` : ''}<p class="meta">${book.status === 'reading' ? 'Reading now' : 'Finished'}</p>`),
        b(`<p class="meta">My notes from this book, as saved in Lexicon.</p>`),
        ...(book.highlights.length ? [] : [b(`<p class="meta">No notes yet.</p>`)]),
        ...book.highlights.map((n) =>
          n.quote
            ? b(`<figure class="quote"><blockquote>${esc(n.text)}</blockquote><figcaption>${esc(n.title)}</figcaption></figure>`)
            : b(`<div class="note"><h4>${esc(n.title)}</h4><p>${esc(n.text)}</p></div>`),
        ),
      ],
    });
  }
  return books;
}

function dots(box) {
  const filled = Math.max(1, Math.min(5, box || 1));
  return `<span class="dots" aria-label="Recall strength ${filled} of 5">${'●'.repeat(filled)}${'○'.repeat(5 - filled)}</span>`;
}

function empty(feed) {
  return b(
    feed
      ? `<p class="meta">Nothing here yet. It fills in as I save things in Lexicon.</p>`
      : `<p class="meta">Lexicon didn’t answer just now, so these pages are blank. Try again in a minute.</p>`,
  );
}
