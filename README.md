# alecconti.github.io

A bookshelf. Work is bound as books, and the notebooks show what I'm learning, printed live from [Lexicon](https://github.com/alecconti/Lexicon).

- `js/books.js`: every book. Internships, Projects and About are written here. Field Notes, Commonplace (quotes), A Private Lexicon (words) and the Reading / Finished books are built from Lexicon's public feed (`/api/public/shelf`) each time someone visits.
- `js/main.js`: the Three.js shelf (scrolling, hover, pulling a book out and opening it).
- `js/reader.js`: page layout and page turns.
- `js/textures.js`: cloth, foil and paper drawn on canvases.
- `js/vendor/three.module.min.js`: Three.js r170, kept here so the site does not depend on a CDN.

To add a book by hand, add an entry to `STATIC_BOOKS` in `js/books.js`. The PNC book is a placeholder there.

In Lexicon, mark a book Reading or Finished on its source page to move it between shelves. Tag anything `Private` to keep it off the site.

Run locally with `python3 -m http.server 8000` and open http://localhost:8000.
