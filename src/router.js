/* ==========================================================
 * src/router.js — ROUTER (matches URLs to controllers)
 * PLAIN ENGLISH: A list of "this URL → run this function."
 * LOGIC: express.Router() makes a mini route list; app.js plugs
 *   it in with app.use(router).
 * WHY WE NEED IT: Keeps all API routes in one easy-to-read place.
 * LEARNING GAP: Pass the handler NAME without () — Express calls
 *   it later when a request arrives.
 * ========================================================== */
import express from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';

/* PLAIN ENGLISH: Bring in the author controller function.
 * LOGIC: getAuthorsHandler lives in src/controllers/authors.js.
 * WHY WE NEED IT: The GET /authors route below needs it.
 * LEARNING GAP: The path starts with "./" because router.js and
 *   the controllers folder are both inside src. */
import { getAuthorsHandler } from './controllers/authors.js';

const router = express.Router();

/* ----------------------------------------------------------
 * GET /books → return all books as JSON
 * PLAIN ENGLISH: When someone visits /books, send back every book.
 * LOGIC: Runs getBooksHandler, which returns 200 + the books,
 *   or 500 if something breaks.
 * WHY WE NEED IT: The "Get All Books" route.
 * LEARNING GAP: The @openapi comment right below describes this
 *   route for Swagger. It does NOT change how the route works.
 *   It must sit DIRECTLY above the route it describes.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Books returned successfully
 *       500:
 *         description: Unable to retrieve books
 */
router.get('/books', getBooksHandler);

/* ----------------------------------------------------------
 * GET /books/:id → return one book (or 404 if not found)
 * PLAIN ENGLISH: When someone visits /books/b1, send back that
 *   one book.
 * LOGIC: Runs getBookByIdHandler, which returns 200 + the book,
 *   404 if no book has that id, or 500 if something breaks.
 * WHY WE NEED IT: The "Get Single Book" route.
 * LEARNING GAP:
 *   - ":id" is a placeholder. /books/b1 sets req.params.id
 *     to "b1".
 *   - In Express the route says /books/:id, but in the @openapi
 *     comment it's written /books/{id}. Same meaning, different
 *     style, because OpenAPI uses curly braces.
 *   - The "parameters" section tells Swagger to show a box
 *     where you type the id.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get one book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom book id, such as b1
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Unable to retrieve book
 */
router.get('/books/:id', getBookByIdHandler);

/* ----------------------------------------------------------
 * GET /authors → return all authors as JSON
 * PLAIN ENGLISH: When someone visits /authors, send back every
 *   author (a1, a2, a3 from the Atlas "authors" collection).
 * LOGIC: Runs getAuthorsHandler, which returns 200 + the
 *   authors, or 500 if something breaks.
 * WHY WE NEED IT: The "Get All Authors" route, and the first
 *   route built end to end for issue #9.
 * LEARNING GAP: The "Authors" tag makes Swagger show a separate
 *   Authors section, apart from Books.
 * ---------------------------------------------------------- */
/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: A list of authors
 *       500:
 *         description: Unable to retrieve authors
 */
router.get('/authors', getAuthorsHandler);

export default router;
